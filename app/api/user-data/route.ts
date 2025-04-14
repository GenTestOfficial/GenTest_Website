import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUser } from '@/lib/database';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await getUser(userId);
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json({
      tier: user.tier,
      token_usage: user.token_usage,
      token_limit: user.token_limit,
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 