import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { updateUserSubscription, SubscriptionStatus } from '@/lib/database';
import { prisma } from '@/lib/database';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return new NextResponse('No signature', { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      
      if (!userId) {
        return new NextResponse('No userId in session', { status: 400 });
      }

      // Update subscription data
      const subscriptionData = {
        plan: session.metadata.plan,
        status: 'active' as SubscriptionStatus,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        updated_at: new Date().toISOString()
      };

      // Update user to pro tier and reset tokens
      await prisma.$queryRaw`
        UPDATE "User" 
        SET 
          tier = 'pro',
          token_usage = 0,
          token_limit = 100000,
          subscription = ${JSON.stringify(subscriptionData)}::jsonb
        WHERE id = ${userId}
      `;
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse('Webhook error', { status: 400 });
  }
} 