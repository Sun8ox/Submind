import bscryptjs from 'bcryptjs';
import { getUserByEmail, getUserByUsername, getUserById, dbChangePassword, dbCreateUser, dbCreateVerificationToken, checkIfUsernameOrEmailExists } from './db.js';
import jwt from 'jsonwebtoken';
import { generateVerificationMail } from '@/lib/auth/mail.js';
import { NextResponse } from 'next/server';

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

// Validate token and return user ID and status
export async function validateToken(token) {
    try {
        // Verify the JWT token and retun success and decoded data
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded || !decoded.id) return { success: false, message: "Invalid token" };

        const userData = {
            id: decoded.id,
            username: decoded.userName,
            email: decoded.email,
            role: decoded.role
        }

        return { success: true, userId: decoded.id, userData: userData, message: "Token is valid" };
    } catch (error) {
        // In case of wrong token, return failure
        console.error("Token validation error:", error);
        return { success: false, message: "Invalid token" };
    }
}

// Register new user, havent it tested yet
export async function registerUser(userData) {
    try {

        const { email, username, password } = userData;

        if (!email || !username || !password) return { success: false, message: "Email, username and password are required" };        

        // Check if username or email already exists
        const exists = checkIfUsernameOrEmailExists(username, email)

        if (exists.usernameExists) return { success: false, message: "Username already exists" };
        if (exists.emailExists) return { success: false, message: "Email already exists" };

        // Hash password
        const passwordHash = await bscryptjs.hash(password, 10);

        // Register user in the database
        const registeredUser = await dbCreateUser(username, email, passwordHash);
        if (!registeredUser) return { success: false, message: "Failed to register user" };
        if (!registeredUser.id) return { success: false, message: "Failed to register user" };

        const verificationToken = Math.floor(Math.random() * (999999 - 100000) + 100000);
        // Create verification token for the user in the database
        const verification = await dbCreateVerificationToken(registeredUser, verificationToken);
        if (!verification) return { success: false, message: "Failed to create verification token" };


        const verificationTokenFromDb = verification.token;
        
        const emailVerificationStatus = generateVerificationMail(email, verificationTokenFromDb);
        if (!emailVerificationStatus.success) return { success: false, message: "Failed to send verification email" };

        // Sign JWT token to authenticate user
        const token = jwt.sign({ id: registeredUser.id, userName: registeredUser.username, email: registeredUser.email, role: registeredUser.role }, JWT_SECRET, { expiresIn: '7d' });
        if (!token) return { success: false, message: "Failed to create authentication token" };
        
        // Return success message
        return { success: true, message: "Registration successful. " + emailVerificationStatus.message, token: token };


    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, message: "Registration failed" };
    }

}

// Authenticate user with email or username and password
export async function authenticateUser(userLoginData) {
    try {

        const { email, username, password } = userLoginData;
        if (!email && !username) return { success: false, message: "Email or username is required" };

        // Get user data by email or username
        const userData = username ? await getUserByUsername(username) : await getUserByEmail(email);
        if (!userData) return { success: false, message: "User not found" };

        // Check if passwords match from db
        const isPasswordValid = await bscryptjs.compare(password, userData.password);
        
        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid username or password",
            };
        }

        // Sign JWT token to authenticate user
        const token = jwt.sign({ id: userData.id, userName: userData.username, email: userData.email, role: userData.role }, JWT_SECRET, { expiresIn: '7d' });

        return {
            success: true,
            message: "Authentication successful",
            token: token,
        };

    } catch (error) {
        console.error("Authentication error:", error);

        return {
            success: false,
            message: "Authentication failed",
        };
    }
}

// Change user password
export async function changePassword(userId, oldPassword, newPassword) {
    try {
        // Get user by ID to verify is user exists
        const user = await getUserById(userId);
        if (!user) return { success: false, message: "User not found" };

        // Validate old password
        const isOldPasswordValid = await bscryptjs.compare(oldPassword, user.password);
        if (!isOldPasswordValid) return { success: false, message: "Old password is incorrect" };

        // Validate new password
        const isPasswordNew = await bscryptjs.compare(newPassword, user.password);
        if (isPasswordNew) return { success: false, message: "New password cannot be the same as the old password" };

        // Hash new password
        const newPasswordHash = await bscryptjs.hash(newPassword, 10);

        // Update password in the database
        const updatedUser = await dbChangePassword(userId, newPasswordHash);
        if (!updatedUser) return { success: false, message: "Failed to update password" };

        return { success: true, message: "Password changed successfully" };
    } catch (error) {
        console.error("Error changing password:", error);
        return { success: false, message: "Failed to change password" };
    }
}

export function logout(request) {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('Submind.AuthToken', '', {
        maxAge: -1, 
    });

    return response
}