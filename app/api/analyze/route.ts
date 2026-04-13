import { NextRequest, NextResponse } from "next/server";
import { analyzeFood } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
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

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your-api-key-here") {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured. Add your key to .env.local" },
        { status: 500 }
      );
    }

    const analysis = await analyzeFood(image, mediaType || "image/jpeg");
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analyze error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to analyze food";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
