import bscryptjs from 'bcryptjs';
import { getUserByEmail, getUserByUsername, getUserById, dbChangePassword } from './db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

export async function validateToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { success: true, userId: decoded.id };
    } catch (error) {
        console.error("Token validation error:", error);
        return { success: false, message: "Invalid token" };
    }
}

export async function registerUser(userData) {
    try {

        const { email, username, password } = userData;

        if (!email || !username || !password) {
            return { success: false, message: "Email, username, and password are required" };
        }

        const existingUserByEmail = await getUserByEmail(email);
        if (existingUserByEmail) {
            return { success: false, message: "Email is already registered" };
        }

        const existingUserByUsername = await getUserByUsername(username);
        if (existingUserByUsername) {
            return { success: false, message: "Username is already taken" };
        }

        const passwordHash = await bscryptjs.hash(password, 10);

        // TODO email verification
        


        return { success: true, message: "Registration successful. Check mail for verification link." };


    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, message: "Registration failed" };
    }

}

export async function authenticateUser(userLoginData) {
    try {

        const { email, username, password } = userLoginData;

        if (!email && !username) return { success: false, message: "Email or username is required" };

        const userData = username ? await getUserByUsername(username) : await getUserByEmail(email);

        if (!userData) return { success: false, message: "User not found" };
        
        const isPasswordValid = await bscryptjs.compare(password, userData.password);
        
        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid username or password",
            };
        }

        const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });

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

export async function changePassword(userId, oldPassword, newPassword) {
    try {
        const user = await getUserById(userId);
        if (!user) return { success: false, message: "User not found" };

        const isOldPasswordValid = await bscryptjs.compare(oldPassword, user.password);
        if (!isOldPasswordValid) return { success: false, message: "Old password is incorrect" };

        const isPasswordNew = await bscryptjs.compare(newPassword, user.password);
        if (isPasswordNew) return { success: false, message: "New password cannot be the same as the old password" };

        const newPasswordHash = await bscryptjs.hash(newPassword, 10);

        const updatedUser = await dbChangePassword(userId, newPasswordHash);
        if (!updatedUser) return { success: false, message: "Failed to update password" };

        return { success: true, message: "Password changed successfully" };
    } catch (error) {
        console.error("Error changing password:", error);
        return { success: false, message: "Failed to change password" };
    }
}