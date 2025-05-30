import { NextResponse } from 'next/server';
import { validateToken } from '@/lib/auth';
import { dbVerifyUser } from '@/lib/db';


export async function POST(request) {
    try {
        const { userId, token } = await request.json();
        const cookieStore = await request.cookies;

        // Validate input
        if (!token) return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 });

       
        // Check if the user is authenticated
        const jwtToken = cookieStore.get("Submind.AuthToken");

        // If no JWT token is found, return
        if (!jwtToken) return NextResponse.json({ success: false, message: "Authentication token is required" }, { status: 401 });

        // Get user ID from the JWT token
        const tokenValue = await validateToken(jwtToken.value);
        
        // Verify user ID from JWT token
        if (tokenValue.success === false) return NextResponse.json({ success: false, message: "Invalid authentication token" }, { status: 401 });
        if (tokenValue.userId !== userId) return NextResponse.json({ success: false, message: "User ID does not match" }, { status: 403 });

        // Verify the user with the provided token
        const verificationResult = await dbVerifyUser(token, userId);

        // If verification fails, return an error
        if (!verificationResult) {
            return NextResponse.json({ success: false, message: "Verification token is invalid" }, { status: 400 });
        }

        // If verification is successful, return a success response
        return NextResponse.json({ success: true, message: "User verified successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error during user verification:", error);
        return NextResponse.json({ success: false, message: "An error occurred during verification" }, { status: 500 });
    }
}