import { NextResponse } from 'next/server';
import { deleteVideo } from '@/lib/videos/videos';
import { getUserData } from '@/lib/auth/user';
import { getVideoInfoById } from '@/lib/videos/db';
import { validateId  } from '@/lib/validate';

export async function GET(request, { params}) {
    try {
        const { videoId } = await params;
        const cookieStore = await request.cookies;
        
        // Validate videoId
        if (!videoId) return NextResponse.json({ success: false, message: "Video ID is required." }, { status: 400 });
        const { success: isValidId, message: idMessage } = validateId(videoId);
        if (!isValidId) return NextResponse.json({ success: false, message: idMessage }, { status: 400 });

        // Get user data from the auth token
        const token = cookieStore.get('Submind.AuthToken');
        const { success: getUserDataSuccess, message: getUserDataMessage, user} = await getUserData(token);
        if (getUserDataSuccess === false) return NextResponse.json({ success: false, message: getUserDataMessage }, { status: 401 });

        // Get video info from the database
        const videoInfo = await getVideoInfoById(videoId);
        if (!videoInfo) return NextResponse.json({ success: false, message: "Video not found." }, { status: 404 });

        // Check if user is authorized to delete the video
        if (user.role != "Admin" && user.id != videoInfo.authorid) return NextResponse.json({ success: false, message: "You are not authorized to delete this video." }, { status: 403 });
        
        const { success, message } = await deleteVideo(videoId);
        if (success === false) return NextResponse.json({ success: false, message }, { status: 500 });


        // Return success response
        return NextResponse.json({ success: true, message: "Video deleted successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
    }
}