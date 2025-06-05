import { validateToken } from "./auth.js";
import { getUserById } from "./db.js";

export async function getUserData(authToken) {
    try {
        // Check if auth token exists
        if (!authToken) return { success: false, message: "Authentication token is missing. Please log in again." };
        if (!authToken.value) return { success: false, message: "Authentication token is invalid. Please log out and login again." };

        // Decode and validate the token
        const { success, message, userId } = await validateToken(authToken.value);

        if (success === false) return { success: false, message: message };
        if (!userId) return { success: false, message: "Authentification token is invalid." };
        // Get user data by ID
        const userData = await getUserById(userId);
        if (!userData) return { success: false, message: "User not found." };
        if (userData.banned) return { success: false, message: "User is banned." };
        if (userData.verified === false) return { success: false, message: "User is not verified." };

        // Return user data
        return { success: true, user: userData };
    } catch (error) {
        console.error("Token validation error:", error);
        return { success: false, message: "Invalid token" };
    }
}

export async function validateAuthToken(authToken) {
    try {
        // Check if auth token exists
        if (!authToken) return { success: false, message: "Authentication token is missing. Please log in again." };
        if (!authToken.value) return { success: false, message: "Authentication token is invalid. Please log out and login again." };

        // Decode and validate the token
        const { success, message, userId, userData } = await validateToken(authToken.value);

        if (success === false) return { success: false, message: message };
        if (!userId) return { success: false, message: "Authentification token is invalid." };

        // Return user data
        return { success: true, userId, userData};
    } catch (error) {
        console.error("Token validation error:", error);
        return { success: false, message: "Invalid token" };
    }
}

// TODO
export async function getUserByUsername(username) {

}

export async function getPublicUserInfo(userId){
    const userData = await getUserById(userId);
    if (!userData) return { success: false, message: "User not found." };
    return {
        success: true,
        user: {
            id: userData.id,
            username: userData.username,
            role: userData.role,
            bio: userData.bio,
            createdAt: userData.created_at
        }
    };
}


// TODO
export async function editUser(userId, userData){
    const { fullname, bio } = userData;


}