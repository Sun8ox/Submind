import { NextResponse } from 'next/server';
import { getUserData } from '@/lib/auth/user';
import { getSubscriptionByUserId } from '@/lib/subscriptions/db';
import { isNextPaymentDue } from '@/lib/subscriptions/utils';
import { getSignedVideoUrl } from '@/lib/videos/storage';
import { getVideoInfoById } from '@/lib/videos/db';
import { validateId } from '@/lib/validate';


export async function GET(request, { params }) {
    try {

        // Get video ID from the request query
        const { videoId } = await params;
        if (!videoId) return NextResponse.json({ success: false, message: "Video ID is required" }, { status: 400 });

        // Validate videoId
        const { success: isValidId, message: idMessage } = validateId(videoId);
        if (!isValidId) return NextResponse.json({ success: false, message: idMessage }, { status: 400 });

        // Get video info from the database
        const videoInfo = await getVideoInfoById(videoId);
        if (!videoInfo) return NextResponse.json({ success: false, message: "Video not found" }, { status: 404 });

        // Get user's subscription data
        if (videoInfo.subscription !== "Free"){
            // Get cookies and auth token
            const cookieStore = await request.cookies;
            const authToken = cookieStore.get('Submind.AuthToken');

            // Check auth token
            const { success, message, user } = await getUserData(authToken);
            if (!success) return NextResponse.json({ success: false, message: message }, { status: 401 });

            // Check if the user has a valid subscription
            const subscriptionData = await getSubscriptionByUserId(user.id);
            if (!subscriptionData) return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 });
            const isSubscriptionValid = isNextPaymentDue(subscriptionData.nextpayment);
            if (!isSubscriptionValid) return NextResponse.json({ success: false, message: "Your subscription is not active. Please renew your subscription to view videos." }, { status: 403 });

            // Check if the user has permission to view the video
            if (videoInfo.authorId != user.id && subscriptionData.type !== videoInfo.subscription) return NextResponse.json({ success: false, message: "You do not have permission to view this video" }, { status: 403 });
        }


        // getting signed URL for the video file
        const signedVideoUrl = await getSignedVideoUrl(videoId);
        if (!signedVideoUrl) return NextResponse.json({ success: false, message: "Failed to get video URL" }, { status: 500 });

        // and returning it in the response
        return NextResponse.json({ success: true, message: "Video URL retrieved successfully", videoUrl: signedVideoUrl, videoInfo: videoInfo }, { status: 200 });
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}