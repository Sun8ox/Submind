import { NextResponse } from 'next/server';
import { getSubscriptionByUserId } from '@/lib/subscriptions/db';
import { getVideosBySubscription } from '@/lib/videos/db';
import { isNextPaymentDue } from '@/lib/subscriptions/utils';
import { getUserData } from '@/lib/auth/user';

const pageSize = 10; 

export async function GET(request) {
    try {
        const pageNumber = request.nextUrl.searchParams.get('page') || 1;
        let subscriptionType = "Free";

        // Get cookies and auth token
        const cookieStore = await request.cookies;
        const authToken = cookieStore.get('Submind.AuthToken');

        // Get user data from the auth token
        const { success, user } = await getUserData(authToken);
        if(success == true){
            // Get user's subscription data
            const subscriptionData = await getSubscriptionByUserId(user.id);

            // Check if subscription data exists and if the next payment is due
            if (subscriptionData) {
                // Check if subscription is valid
                const isSubscriptionValid = isNextPaymentDue(subscriptionData.nextpayment);
                
                // If subscription is valid, set the subscription type
                if (isSubscriptionValid) {
                    subscriptionType = subscriptionData.type || "Free";
                }
            }
        }

        // Fetch videos based on subscription type and publicity
        const videos = await getVideosBySubscription(subscriptionType, pageNumber, pageSize, "Public");
        if (!videos) return NextResponse.json({ success: false, message: "No videos found" }, { status: 404 });
        
        return NextResponse.json({ success: true, page: pageNumber, videos}, { status: 200 });
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}