import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
  typescript: true,
});

export type Plan = {
  name: string;
  price?: number;
  priceId?: string;
  custom?: boolean;
  features: string[];
};

export const PLANS: Record<string, Plan> = {
  PRO: {
    name: 'Pro',
    price: 20,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      '100,000 tokens per month',
      'Support for JavaScript, TypeScript, Python',
      'Advanced test generation with multiple frameworks',
      'Multiple file uploads',
      'Advanced test patterns and edge cases',
      'Priority support',
      'Detailed test documentation'
    ]
  },
  ENTERPRISE: {
    name: 'Enterprise',
    custom: true,
    features: [
      'Unlimited tokens',
      'Support for all programming languages',
      'Custom test frameworks and patterns',
      'Bulk file processing',
      'Dedicated support team',
      'Custom integrations',
      'On-premise deployment'
    ]
  }
};

export async function getStripeSession(priceId: string) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=false`,
  });

  return session;
} 