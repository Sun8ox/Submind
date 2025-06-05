import { NextResponse } from 'next/server';
import { getVideosByUserId } from '@/lib/videos/db';
import { validateAuthToken } from '@/lib/auth/user';

export async function GET(request) {
    const cookieStore = await request.cookies;

    const authToken = cookieStore.get('Submind.AuthToken');
    const { success, message, userId } = await validateAuthToken(authToken);
    if (!success) return NextResponse.json({ success: false, message }, { status: 401 });

    const videos = await getVideosByUserId(userId, 1, 10);
    if (!videos) return NextResponse.json({ success: false, message: 'No videos found' }, { status: 404 });
    return NextResponse.json({ success: true, videos }, { status: 200 });
}