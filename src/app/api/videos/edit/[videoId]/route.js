import { validateId, validateText } from "@/lib/validate";
import { NextResponse } from "next/server";
import { validateAuthToken } from "@/lib/auth/user";
import { getVideoInfoById, updateVideoInfo } from "@/lib/videos/db";

export async function POST(request, { params }) {
    try {
        const { videoId } = await params;
        const cookieStore = await request.cookies;

        const { name = null, description = null, subscription = null, publicity = null } = await request.json();

        // Validate required fields
        const { success: videoIdValidSucces, message: videoIdValidMessage } = validateId(videoId);
        if (!videoIdValidSucces) return NextResponse.json({ success: false, message: videoIdValidMessage }, { status: 400 });

        if(name){
            const { success, message: message } = validateText(name, 1, 100);
            if (!success) return NextResponse.json({ success: false, message: message }, { status: 400 });
        }
        if (description) {
            const { success, message } = validateText(description, 1, 500);
            if (!success) return NextResponse.json({ success: false, message: message }, { status: 400 });
        }
        if (subscription) {
            const { success, message } = validateText(subscription, 1, 10);
            if (!success) return NextResponse.json({ success: false, message: message }, { status: 400 });
        }
        if (publicity) {
            const { success, message } = validateText(publicity, 1, 10);
            if (!success) return NextResponse.json({ success: false, message: message }, { status: 400 });
        }

        // Validate auth token
        const authToken = cookieStore.get("Submind.AuthToken");
        const { success: authValidSuccess, message: authValidMessage, userId } = await validateAuthToken(authToken);
        if (!authValidSuccess) return NextResponse.json({ success: false, message: authValidMessage }, { status: 401 });

        // Get current video data
        const videoInfo = await getVideoInfoById(videoId);
        if (!videoInfo) return NextResponse.json({ success: false, message: 'Video not found' }, { status: 404 });

        // Check if user is the owner of the video
        if (videoInfo.author != userId) return NextResponse.json({ success: false, message: 'You do not have permission to edit this video' }, { status: 403 });

        // Prepare update data
        const updateData = {
            name: name,
            description: description,
            subscription_type: subscription,
            publicity: publicity
        };

        // Update video info
        const updatedVideo = await updateVideoInfo(videoId, updateData);
        if (!updatedVideo) return NextResponse.json({ success: false, message: 'Failed to update video' }, { status: 500 });
        if (updatedVideo === null) return NextResponse.json({ success: false, message: 'Video not found or update failed' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Video updated successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error updating video:", error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}