import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getUserSubscription, updateUserSubscription, SubscriptionData } from '@/lib/database';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user's subscription data
    const subscription = await getUserSubscription(userId);
    if (!subscription) {
      return new NextResponse('No active subscription found', { status: 400 });
    }

    const subscriptionId = subscription.stripeSubscriptionId;
    if (!subscriptionId) {
      return new NextResponse('No subscription ID found', { status: 400 });
    }

    // Cancel the subscription at the end of the current period
    const stripeSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    }) as unknown as { current_period_end: number };

    // Update user's subscription status
    const updatedSubscription: SubscriptionData = {
      ...subscription,
      status: 'canceled',
      updated_at: new Date().toISOString()
    };

    await updateUserSubscription(userId, updatedSubscription);

    return NextResponse.json({ 
      success: true,
      message: 'Subscription will be cancelled at the end of the billing period',
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString()
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 