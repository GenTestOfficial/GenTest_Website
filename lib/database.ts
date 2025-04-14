import { PrismaClient, Prisma } from '@prisma/client';

export const prisma = new PrismaClient();

export type SubscriptionStatus = 'active' | 'canceled' | 'inactive';

export interface SubscriptionData {
  plan: string;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  updated_at: string;
}

export interface User {
  id: string;
  tier: 'free' | 'pro';
  token_usage: number;
  token_limit: number;
  last_updated: Date;
  subscription: SubscriptionData | null;
}

type PrismaUser = {
  id: string;
  tier: string;
  token_usage: number;
  token_limit: number;
  last_updated: Date;
  subscription: Prisma.JsonValue | null;
};

function transformUser(user: PrismaUser): User {
  return {
    id: user.id,
    tier: user.tier as 'free' | 'pro',
    token_usage: user.token_usage,
    token_limit: user.token_limit,
    last_updated: user.last_updated,
    subscription: user.subscription as unknown as SubscriptionData | null
  };
}

export async function ensureUserExists(userId: string): Promise<User> {
  try {
    let user = await prisma.user.findUnique({
      where: { id: userId }
    }) as PrismaUser | null;

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          tier: 'free',
          token_usage: 0,
          token_limit: 5000
        }
      }) as PrismaUser;
    }

    return transformUser(user);
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    throw error;
  }
}

export async function getUser(userId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    }) as PrismaUser | null;

    if (!user) {
      return null;
    }

    return transformUser(user);
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function updateUserTokenUsage(userId: string, tokensUsed: number): Promise<User> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        token_usage: {
          increment: tokensUsed
        },
        last_updated: new Date()
      }
    }) as PrismaUser;

    return transformUser(user);
  } catch (error) {
    console.error('Error updating user token usage:', error);
    throw error;
  }
}

export async function updateUserSubscription(userId: string, subscriptionData: SubscriptionData): Promise<User> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        last_updated: new Date()
      }
    }) as PrismaUser;

    await prisma.$queryRaw`UPDATE "User" SET subscription = ${JSON.stringify(subscriptionData)}::jsonb WHERE id = ${userId}`;

    return transformUser(user);
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
}

export async function getTokenUsage(userId: string): Promise<{ usage: number; limit: number }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        token_usage: true,
        token_limit: true,
      },
    });
    return {
      usage: user?.token_usage || 0,
      limit: user?.token_limit || 5000,
    };
  } catch (error) {
    console.error('Error getting token usage:', error);
    return { usage: 0, limit: 5000 };
  }
}

export async function getUserSubscription(userId: string): Promise<SubscriptionData | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    }) as PrismaUser | null;

    return user?.subscription as unknown as SubscriptionData | null;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    throw error;
  }
}

export async function createTestHistory(
  userId: string,
  code: string,
  testCode: string,
  framework: string,
  language: string,
  tokensUsed: number
) {
  try {
    await prisma.$queryRaw`
      INSERT INTO "TestHistory" (id, "userId", code, "testCode", framework, language, "tokensUsed", timestamp)
      VALUES (gen_random_uuid(), ${userId}, ${code}, ${testCode}, ${framework}, ${language}, ${tokensUsed}, NOW())
    `;
    return true;
  } catch (error) {
    console.error('Error creating test history:', error);
    return false;
  }
}

export async function trackUsage(userId: string, tokensUsed: number) {
  try {
    await updateUserTokenUsage(userId, tokensUsed);
    return true;
  } catch (error) {
    console.error('Error tracking usage:', error);
    return false;
  }
}