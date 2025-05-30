import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export async function POST(request) {
    try {
        const { email, username, password } = await request.json();

        // Validate input, TODO
        
        if (!email && !username || !password) {
            return NextResponse.json(
                { success: false, error: "Username and password are required" },
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { success, message, token} = await authenticateUser({ email, username, password });

        if (!success) {
            return NextResponse.json(
                { success: false, error: message },
                { status: 401, headers: { "Content-Type": "application/json" } });
            }

        const response = NextResponse.json(
            { success: true, message: "Login successful"}, 
            { status: 200, headers: { "Content-Type": "application/json" }
        });

        response.cookies.set('Submind.AuthToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 1, // 1 day
        })


        return response;
    } catch (error) {
        console.error("Login error:", error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500, headers: { "Content-Type": "application/json" }
        });
    }
}