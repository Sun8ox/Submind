import { NextResponse } from 'next/server';
import { changePassword } from '@/lib/auth/auth'; 
import { validateUserId, validatePassword } from '@/lib/validate';
import { getUserData } from '@/lib/auth/user';

export async function POST(request) {
    try {
        const { oldPassword, newPassword } = await request.json();

        // Get cookies and auth token
        const cookieStore = await request.cookies;
        const authToken = cookieStore.get('Submind.AuthToken');

        // Get user data from the auth token
        const { success: userDataStatus, message: userDataMsg, user } = await getUserData(authToken);
        if (!userDataStatus) return NextResponse.json({ success: false, userDataMsg }, { status: 401 });

        // Validate input
        if (!user.id || !oldPassword || !newPassword) {
            return NextResponse({ success: false, message: "Missing required fields" }, { status: 400 });
        }
        
        // Validate user ID and passwords
        const { success: isValidUserId, message: userIdMessage } = validateUserId(user.id);
        if (!isValidUserId) return NextResponse.json({ success: false, message: userIdMessage }, { status: 400 });
        const { success: isValidOldPassword, message: oldPasswordMessage } = validatePassword(oldPassword);
        if (!isValidOldPassword) return NextResponse.json({ success: false, message: oldPasswordMessage }, { status: 400 });
        const { success: isValidNewPassword, message: newPasswordMessage } = validatePassword(newPassword);
        if (!isValidNewPassword) return NextResponse.json({ success: false, message: newPasswordMessage }, { status: 400 });

        // Change password
        const { success, message } = await changePassword(user.id, oldPassword, newPassword);

        if (!success) {
            return NextResponse.json({ success: false, message }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "Password changed successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error changing password:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}