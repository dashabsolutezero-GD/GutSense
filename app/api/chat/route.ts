import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { chatWithNutritionist } from "@/lib/anthropic";
import { checkLimit, incrementUsage } from "@/lib/usage";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check usage limit
    const limit = await checkLimit(supabase, user.id, "chat", "free");
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: `Daily chat limit reached (${limit.used}/${limit.limit}). Upgrade to Plus for more messages.`,
          limitReached: true,
          used: limit.used,
          limit: limit.limit,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { message, foodHistory } = body as {
      message: string;
      foodHistory: string;
    };

    if (!message) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    if (
      !process.env.ANTHROPIC_API_KEY ||
      process.env.ANTHROPIC_API_KEY === "your-api-key-here"
    ) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    const reply = await chatWithNutritionist(message, foodHistory || "");

    // Increment usage after successful response
    await incrementUsage(supabase, user.id, "chat");

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to get response";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
