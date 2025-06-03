import { NextResponse } from 'next/server';
import { getSubscriptionByUserId } from '@/lib/subscriptions/db';
import { validateToken } from '@/lib/auth/auth';
import { getVideosBySubscription } from '@/lib/videos/db';
import { isNextPaymentDue } from '@/lib/subscriptions/utils';


const pageSize = 10; 

export async function GET(request) {
    try {
        const pageNumber = request.nextUrl.searchParams.get('page') || 1;

        // Get cookies and auth token
        const cookieStore = await request.cookies;
        const authToken = cookieStore.get('Submind.AuthToken');

        //
        /// TODO
        // make it work without token
        //

        // Check if auth token exists
        if (!authToken) return NextResponse.json({ success: false, message: "Authentication token is missing" }, { status: 401 });
        if (!authToken.value) return NextResponse.json({ success: false, message: "Authentication token is invalid" }, { status: 401 });

        // Decode and validate the token
        const { success: decodingStatus, message: decodingMessage, userId } = await validateToken(authToken.value);
        if (decodingStatus.success === false) return NextResponse.json({ success: false, message: decodingMessage }, { status: 401 });
        if (!userId) return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    
        // Get user's subscription data
        const subscriptionData = await getSubscriptionByUserId(userId);

        let subscriptionType = "Free";
        if (subscriptionData) {
            const isSubscriptionValid = isNextPaymentDue(subscriptionData.nextpayment);
            if (!isSubscriptionValid) return NextResponse.json({ success: false, message: "Your subscription is not active. Please renew your subscription to view videos." }, { status: 403 });
            subscriptionType = subscriptionData.type || "Free";
        }

        // Fetch videos based on subscription type
        const videos = await getVideosBySubscription(subscriptionType, pageNumber, pageSize, "Public");
        if (!videos) return NextResponse.json({ success: false, message: "No videos found" }, { status: 404 });
        
        return NextResponse.json({ success: true, page: pageNumber, videos}, { status: 200 });
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}