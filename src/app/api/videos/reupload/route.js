import { NextResponse } from 'next/server';

import { SubscriptionTypes } from '@/lib/subscriptions/types';
import { getVideoInfoById } from '@/lib/videos/db';
import { getPresignedVideoUrl } from '@/lib/videos/storage';
import { getUserData } from '@/lib/auth/user';
import { validateId } from '@/lib/validate';
import { validateAuthToken } from '@/lib/auth/user';

const validContentTypes = ["video/mp4", "video/webm", "video/ogg"];

const fileMaxSize = 1024 * 1024 * 1024; // 1GB
const signedUrlValidity = 5 * 60 * 60; // 5 hours

export async function POST(request) {
    try {
        // Get cookies and auth token
        const cookieStore = await request.cookies;
        const authToken = cookieStore.get('Submind.AuthToken');

        // Check auth token
        const { success, message, userData: user } = await validateAuthToken(authToken);
        if (!success) return NextResponse.json({ success: false, message: message }, { status: 401 });
        if (user.role !== "CREATOR" && user.role !== "ADMIN") return NextResponse.json({ success: false, message: "You do not have permission to upload videos" }, { status: 403 });
    
        // userId is valid, proceed with the request

        const { videoId, fileSize, contentType } = await request.json();

        // Validate data
        if (!fileSize) return NextResponse.json({ success: false, message: "File size is required" }, { status: 400 });
        if (fileSize && typeof fileSize !== 'number') return NextResponse.json({ success: false, message: "File size must be a number" }, { status: 400 });
        if (fileSize && fileSize <= 0) return NextResponse.json({ success: false, message: "File size must be greater than 0" }, { status: 400 });
        if (fileSize && fileSize > fileMaxSize) return NextResponse.json({ success: false, message: "File is too big." }, { status: 400 });

        if (!videoId) return NextResponse.json({ success: false, message: "Video ID is required" }, { status: 400 });
        const { success: isValidId, message: idMessage } = validateId(videoId);
        if (!isValidId) return NextResponse.json({ success: false, message: idMessage }, { status: 400 });
        
        if (!contentType) return NextResponse.json({ success: false, message: "Content type is required" }, { status: 400 });
        if (!validContentTypes.includes(contentType)) return NextResponse.json({ success: false, message: "Invalid content type. Supported types are: " + validContentTypes.join(", ") }, { status: 400 });

        // Check if video author is the same as the userId

        const videoInfo = await getVideoInfoById(videoId);
        if (!videoInfo) return NextResponse.json({ success: false, message: "Video not found" }, { status: 404 });
        if (videoInfo.author != user.id) return NextResponse.json({ success: false, message: "You do not have permission to reupload this video" }, { status: 403 });


        // Get Presigned URL for upload
        const presignedUrl = await getPresignedVideoUrl(videoId, contentType, signedUrlValidity);
        if (!presignedUrl) return NextResponse.json({ success: false, message: "Failed to get presigned URL" }, { status: 500 });

        return NextResponse.json({
            success: true,
            message: "Presigned URL generated successfully.",
            presignedUrl: presignedUrl,
            videoId: videoId
        }, { status: 200 });
    
    } catch (error) {
        console.error("Error validating token:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }

}