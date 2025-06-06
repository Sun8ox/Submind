import { NextResponse } from 'next/server';
import { getUserData } from '@/lib/auth/user';
import { getVideosByUserId } from '@/lib/videos/db';

export async function GET(request) {
    try {
        const cookieStore = await request.cookies;
        const authToken = cookieStore.get('Submind.AuthToken');
        const { success, message, user } = await getUserData(authToken, false);
        if (!success) return NextResponse.json({ success, message }, { status: 400 });

        const response = {
            success: true,
            message: 'User data retrieved successfully',
            user: {
                id: user.id,
                username: user.username,
                fullname: user.fullname || null,
                email: user.email,
                bio: user.bio || "No bio yet.",
                role: user.role,
                verified: user.verified,
                createdAt: user.created_at,
            },
            videos: user.role == "ADMIN" || user.role == "CREATOR" ? await getVideosByUserId(user.id, 1, 10, false) : null
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/users/get:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}