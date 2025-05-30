import { NextResponse } from 'next/server';
import { changePassword } from '@/lib/auth'; 

export async function POST(request) {
    try {
        const { userId, oldPassword, newPassword } = await request.json();

        if (!userId || !oldPassword || !newPassword) {
            return NextResponse({ success: false, message: "Missing required fields" }, { status: 400 });
        }

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