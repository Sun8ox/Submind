import { NextResponse } from 'next/server';
import { validateId } from '@/lib/validate';
import { getPublicUserInfo } from '@/lib/auth/user';
import { getVideosByUserId } from '@/lib/videos/db';

export async function GET(request, { params }) {
    try {
        const { userId } = await params;

        // Validate userId
        const { success, message } = validateId(userId);
        if (!success) return NextResponse.json({ success, message }, { status: 400 });
        
        // Fetch public user info
        const { success: fetchSuccess, message: fetchMessage, user } = await getPublicUserInfo(userId);
        if (!fetchSuccess) return NextResponse.json({ success: fetchSuccess, message: fetchMessage }, { status: 400 });

        // Prepare response
        const response = {
            success: true,
            message: 'Public user data retrieved successfully',
            user: user,
            videos: user.role === "ADMIN" || user.role === "CREATOR" ? await getVideosByUserId(user.id, 1, 10, true) : null
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/users/get:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });   
    }
}