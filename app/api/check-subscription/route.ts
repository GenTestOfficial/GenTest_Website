import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // TODO: Replace this with actual subscription check logic
    // For now, we'll return a mock response
    return NextResponse.json({
      tier: "free", // or "pro" based on actual subscription status
      usage: 0, // current token usage
      limit: 4000, // token limit based on tier
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 