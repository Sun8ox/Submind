import { validateToken } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';
import { validateText } from '@/lib/validate';

import { SubscriptionTypes } from '@/lib/subscriptions/types';
import { createVideoInfo } from '@/lib/videos/db';
import { getPresignedVideoUrl } from '@/lib/videos/storage';
import { getUserById } from '@/lib/auth/db';

const validContentTypes = ["video/mp4", "video/webm", "video/ogg"];

const fileMaxSize = 1024 * 1024 * 1024; // 1GB
const signedUrlValidity = 5 * 60 * 60; // 5 hours

export async function POST(request) {
    try {
        // Get cookies and auth token
        const cookieStore = await request.cookies;
        const authToken = cookieStore.get('Submind.AuthToken');

        // Check if auth token exists
        if (!authToken) return NextResponse.json({ success: false, message: "Authentication token is missing" }, { status: 401 });
        if (!authToken.value) return NextResponse.json({ success: false, message: "Authentication token is invalid" }, { status: 401 });

        // Decode and validate the token
        const { success: decodingStatus, message: decodingMessage, userId } = await validateToken(authToken.value);
        if (decodingStatus.success === false) return NextResponse.json({ success: false, message: decodingMessage }, { status: 401 });
        if (!userId) return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });

        // Get userdata from the database
        const userData = await getUserById(userId);
        if (!userData) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        if (userData.banned) return NextResponse.json({ success: false, message: "User account is banned" }, { status: 403 });
        if (userData.role !== "CREATOR" && userData.role !== "ADMIN") return NextResponse.json({ success: false, message: "You do not have permission to upload videos" }, { status: 403 });
    
        // userId is valid, proceed with the request

        const { name, fileSize, description = "None", contentType = "video/mp4", subscription = "Basic" } = await request.json();

        // Validate required fields
        if (!name || typeof name !== 'string' || name.trim() === '') return NextResponse.json({ success: false, message: "Video name is required" }, { status: 400 });
        const { success: nameValid, message: nameValidationFailedMessage } = validateText(name, 1, 100);
        if (!nameValid) return NextResponse.json({ success: false, message: nameValidationFailedMessage }, { status: 400 });
        
        if (description && typeof description !== 'string') return NextResponse.json({ success: false, message: "Description must be a string" }, { status: 400 });
        const { success: descriptionValid, message: descriptionValidationFailedMessage } = validateText(description, 0, 500);
        if (!descriptionValid) return NextResponse.json({ success: false, message: descriptionValidationFailedMessage }, { status: 400 });
        
        if (contentType && typeof contentType !== 'string') return NextResponse.json({ success: false, message: "Content type must be a string" }, { status: 400 });
        if (contentType && !validContentTypes.includes(contentType)) return NextResponse.json({ success: false, message: "Invalid content type" }, { status: 400 });
        
        if (subscription && typeof subscription !== 'string') return NextResponse.json({ success: false, message: "Subscription must be a string" }, { status: 400 });

        if (!fileSize) return NextResponse.json({ success: false, message: "File size is required" }, { status: 400 });
        if (fileSize && typeof fileSize !== 'number') return NextResponse.json({ success: false, message: "File size must be a number" }, { status: 400 });
        if (fileSize && fileSize <= 0) return NextResponse.json({ success: false, message: "File size must be greater than 0" }, { status: 400 });
        if (fileSize && fileSize > fileMaxSize) return NextResponse.json({ success: false, message: "File is too big." }, { status: 400 });

    
        // Create video info
        const videoInfo = {
            name: name,
            description: description || "None",
            author: userId || "Unknown",
            subscription_type: subscription || "Basic",
            video_url: null
        };

        // Create video info in the database
        const createdVideoInfo = await createVideoInfo(videoInfo);
        if (!createdVideoInfo) return NextResponse.json({ success: false, message: "Failed to create video info" }, { status: 500 });

        const videoId = createdVideoInfo.id;

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