import { validateToken } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';

export async function POST(request) {

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
    
        // userId is valid, proceed with the request

        // TODO
        // handle uploading the video file

    
    } catch (error) {
        console.error("Error validating token:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }

}