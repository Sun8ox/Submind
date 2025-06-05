import { validateAuthToken } from "@/lib/auth/user";
import { validateId } from "@/lib/validate";
import { NextResponse } from "next/server";
import { getVideoInfoById } from "@/lib/videos/db";

export async function GET(request, { params }) {
    try {
        const { videoId } = await params;
        const cookieStore = await request.cookies;

        // Validate videoId
        if (!videoId) return NextResponse.json({ success: false, message: 'Video ID is required' }, { status: 400 });
        const { success: videoIdValidSuccess, message: videoIdValidMessage } = validateId(videoId);
        if (!videoIdValidSuccess) return NextResponse.json({ success: false, message: videoIdValidMessage }, { status: 400 });
        
        // Validate auth token
        const authToken = cookieStore.get("Submind.AuthToken");
        const { success: authValidSuccess, message: authValidMessage, userId, userData } = await validateAuthToken(authToken);
        if (!authValidSuccess) return NextResponse.json({ success: false, message: authValidMessage }, { status: 401 });

        // Get video info from database
        const videoInfo = await getVideoInfoById(videoId);
        if (!videoInfo) return NextResponse.json({ success: false, message: 'Video not found' }, { status: 404 });
        if (videoInfo.authorid != userId && userData.role != "Admin") return  NextResponse.json({ success: false, message: 'You do not have permission to view this video' }, { status: 403 });
        

        return NextResponse.json({ success: true, video: videoInfo }, { status: 200 });
    } catch (error) {
        console.error("Error fetching video info:", error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}