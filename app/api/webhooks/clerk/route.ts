import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const headersList = await headers();
    const signature = headersList.get('svix-signature');

    if (!signature) {
      return new NextResponse('No signature', { status: 400 });
    }

    if (body.type === 'user.created') {
      const userId = body.data.id;
      
      if (!userId) {
        return new NextResponse('No userId in event', { status: 400 });
      }

      // Create user in database if they don't exist
      await prisma.$queryRaw`
        INSERT INTO "User" (id, tier, token_usage, token_limit, subscription)
        VALUES (${userId}, 'free', 0, 5000, NULL)
        ON CONFLICT (id) DO NOTHING
      `;
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Clerk webhook error:', error);
    return new NextResponse('Webhook error', { status: 400 });
  }
} 