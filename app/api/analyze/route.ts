import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { analyzeFood } from "@/lib/anthropic";
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
    const limit = await checkLimit(supabase, user.id, "scan", "free");
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: `Daily scan limit reached (${limit.used}/${limit.limit}). Upgrade to Plus for more scans.`,
          limitReached: true,
          used: limit.used,
          limit: limit.limit,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { image, mediaType } = body as {
      image: string;
      mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
    };

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
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

    const analysis = await analyzeFood(image, mediaType || "image/jpeg");

    // Increment usage after successful analysis
    await incrementUsage(supabase, user.id, "scan");

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analyze error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to analyze food";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
