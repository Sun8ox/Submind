import { validateToken } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';
import { validateToken } from '@/lib/auth/auth';

export async function GET(request) {
    try {

        // Get cookies and auth token
        const cookieStore = await request.cookies;
        const authToken = cookieStore.get('token');

        // Check if auth token exists
        if (!authToken) return NextResponse.json({ success: false, message: "Authentication token is missing" }, { status: 401 });
        if (!authToken.value) return NextResponse.json({ success: false, message: "Authentication token is invalid" }, { status: 401 });

        // Decode and validate the token
        const { success: decodingStatus, message: decodingMessage, userId } = await validateToken(authToken.value);
        if (decodingStatus.success === false) return NextResponse.json({ success: false, message: decodingMessage }, { status: 401 });
        if (!userId) return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });

        // TODO
        // getting signed URL for the video file
        // and returning it in the response


    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}