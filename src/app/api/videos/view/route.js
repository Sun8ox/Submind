import { NextResponse } from 'next/server';
import { validateToken } from '@/lib/auth/auth';
import { getSubscriptionByUserId } from '@/lib/subscriptions/db';
import { isNextPaymentDue } from '@/lib/subscriptions/utils';
import { getSignedVideoUrl } from '@/lib/videos/storage';
import { getVideoInfoById } from '@/lib/videos/db';

export async function GET(request) {
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

        // Get user's subscription data
        const subscriptionData = await getSubscriptionByUserId(userId);
        if (!subscriptionData) return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 });
        const isSubscriptionValid = isNextPaymentDue(subscriptionData.nextpayment);
        if (!isSubscriptionValid) return NextResponse.json({ success: false, message: "Your subscription is not active. Please renew your subscription to view videos." }, { status: 403 });
        
        // Get video ID from the request query
        const videoId = request.nextUrl.searchParams.get('videoId');
        if (!videoId) return NextResponse.json({ success: false, message: "Video ID is required" }, { status: 400 });

        // Validate videoId
        // TODO: if (typeof videoId !== 'number') return NextResponse.json({ success: false, message: "Video ID must be a number" }, { status: 400 });

        // Get video info from the database
        const videoInfo = await getVideoInfoById(videoId);
        if (!videoInfo) return NextResponse.json({ success: false, message: "Video not found" }, { status: 404 });
        if (String(videoInfo.author).trim() !== String(userId).trim() && subscriptionData.type !== videoInfo.subscription) return NextResponse.json({ success: false, message: "You do not have permission to view this video" }, { status: 403 });

        // getting signed URL for the video file

        const signedVideoUrl = await getSignedVideoUrl(videoId);
        if (!signedVideoUrl) return NextResponse.json({ success: false, message: "Failed to get video URL" }, { status: 500 });


        // and returning it in the response
        return NextResponse.json({ success: true, message: "Video URL retrieved successfully", videoUrl: signedVideoUrl }, { status: 200 });
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}