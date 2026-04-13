import { NextRequest, NextResponse } from "next/server";
import { chatWithNutritionist } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
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

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your-api-key-here") {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured. Add your key to .env.local" },
        { status: 500 }
      );
    }

    const reply = await chatWithNutritionist(message, foodHistory || "");
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to get response";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
