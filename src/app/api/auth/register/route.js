import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth'; 
export async function POST(request) {
    try {
        const { username, email, password, passwordAgain} = await request.json();


        // Validate input
        if (!username || !email || !password || !passwordAgain) return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        if (password.length < 8) return NextResponse.json({ success: false, message: 'Password must be at least 8 characters long' }, { status: 400 });
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return NextResponse.json({ success: false, message: 'Username can only contain letters, numbers, and underscores' }, { status: 400 });
        if (password !== passwordAgain) return NextResponse.json({ success: false, message: 'Passwords do not match' }, { status: 400 });

        // Register user
        const user = await registerUser({ username, email, password });
        if (user.success === false) return NextResponse.json({ success: false, message: user.message}, { status: 500 });


        return NextResponse.json({ success: true, message: "Registration successful. Please check your email for verification." }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }   
}