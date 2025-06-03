import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth/auth';
import { validateEmail, validateUsername, validatePassword } from '@/lib/validate';

export async function POST(request) {
    try {
        const { email, username, password } = await request.json();

        // Validate input
        if (!email && !username || !password) {
            return NextResponse.json(
                { success: false, message: "Username and password are required" },
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Validate email, username, and password        
        // If username is provided, validate it; otherwise validate email
        if (username) {
            // Username
            const { success: usernameValid } = validateUsername(username);
            if (!usernameValid) return NextResponse.json({ success: false, message: "Wrong username or password! ER: u1" }, { status: 400, headers: { "Content-Type": "application/json" } });

        } else {
            // Email
            const { success: emailValid } = validateEmail(email);
            if (!emailValid) return NextResponse.json({ success: false, message: "Wrong username or password! ER: e1" }, { status: 400, headers: { "Content-Type": "application/json" } });
        }

        // Validate password
        const { success: passwordValid } = validatePassword(password);
        if (!passwordValid) return NextResponse.json({ success: false, message: "Wrong username or password!" }, { status: 400, headers: { "Content-Type": "application/json" } });


        // Authenticate user
        const { success, message, token} = await authenticateUser({ email, username, password });

        if (!success) {
            return NextResponse.json(
                { success: false, message: message },
                { status: 401, headers: { "Content-Type": "application/json" } });
            }

        const response = NextResponse.json(
            { success: true, message: "Login successful"}, 
            { status: 200, headers: { "Content-Type": "application/json" }
        });

        // Set the authentication token in a secure, HTTP-only cookie
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
            { success: false, message: "Internal server error" },
            { status: 500, headers: { "Content-Type": "application/json" }
        });
    }
}