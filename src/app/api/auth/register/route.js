import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth/auth'; 
import { validateUsername, validateEmail, validatePassword } from '@/lib/validate';

export async function POST(request) {
    try {
        const { username, email, password, passwordAgain} = await request.json();


        // Validate input
        if (!username || !email || !password || !passwordAgain) return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        if (password !== passwordAgain) return NextResponse.json({ success: false, message: 'Passwords do not match' }, { status: 400 });

        // Validate username, email and password
        const { success: isValidUsername, message: usernameMessage } = validateUsername(username);
        if (!isValidUsername) return NextResponse.json({ success: false, message: usernameMessage }, { status: 400 });
        const { success: isValidEmail, message: emailMessage } = validateEmail(email);
        if (!isValidEmail) return NextResponse.json({ success: false, message: emailMessage }, { status: 400 });
        const { success: isValidPassword, message: passwordMessage } = validatePassword(password);
        if (!isValidPassword) return NextResponse.json({ success: false, message: passwordMessage }, { status: 400 });


        // Register user
        const user = await registerUser({ username, email, password });
        if (user.success === false) return NextResponse.json({ success: false, message: user.message}, { status: 500 });
        if (user.token === false) return NextResponse.json({ success: false, message: 'Failed to create authentication token' }, { status: 500 });

        const response =  NextResponse.json({ success: true, message: "Registration successful. Please check your email for verification." }, { status: 201 });

        // Set the authentication token in a secure, HTTP-only cookie
        response.cookies.set('Submind.AuthToken', user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 1, // 1 day
        })

        return response;
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }   
}