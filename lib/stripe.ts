import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
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
    price: 25,
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