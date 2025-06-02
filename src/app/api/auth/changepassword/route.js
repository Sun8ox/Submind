import { NextResponse } from 'next/server';
import { changePassword, validateToken } from '@/lib/auth/auth'; 
import { validateUserId, validatePassword } from '@/lib/auth/validate';

export async function POST(request) {
    try {
        const { oldPassword, newPassword } = await request.json();

        // Get cookies and auth token
        const cookieStore = await request.cookies;
        const authToken = cookieStore.get('Submind.AuthToken');
        
        // Check if auth token exists
        if (!authToken) return NextResponse.json({ success: false, message: "Authentication token is missing" }, { status: 401 });

        // Decode and validate the token
        const { success: decodingStatus, message: decodingMessage, userId } = await validateToken(authToken.value);
        
        // Check if decoding was successful and userId is present
        if (decodingStatus.success === false) return NextResponse.json({ success: false, message: decodingMessage }, { status: 401 });
        if (!userId) return NextResponse.json({ success: false, message: "User ID not found in token" }, { status: 401 });

        // Validate input
        if (!userId || !oldPassword || !newPassword) {
            return NextResponse({ success: false, message: "Missing required fields" }, { status: 400 });
        }
        
        // Validate user ID and passwords
        const { success: isValidUserId, message: userIdMessage } = validateUserId(userId);
        if (!isValidUserId) return NextResponse.json({ success: false, message: userIdMessage }, { status: 400 });
        const { success: isValidOldPassword, message: oldPasswordMessage } = validatePassword(oldPassword);
        if (!isValidOldPassword) return NextResponse.json({ success: false, message: oldPasswordMessage }, { status: 400 });
        const { success: isValidNewPassword, message: newPasswordMessage } = validatePassword(newPassword);
        if (!isValidNewPassword) return NextResponse.json({ success: false, message: newPasswordMessage }, { status: 400 });
        


        // Change password
        const { success, message } = await changePassword(userId, oldPassword, newPassword);

        if (!success) {
            return NextResponse.json({ success: false, message }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "Password changed successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error changing password:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}