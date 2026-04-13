import Anthropic from "@anthropic-ai/sdk";
import type { FoodAnalysis } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const FOOD_ANALYSIS_PROMPT = `You are an expert food nutritionist and microbiologist. Analyze this food image and return a detailed JSON object.

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, no explanation text.

The JSON must match this exact structure:
{
  "foodName": "Name of the food",
  "description": "Brief description of the dish and its preparation",
  "servingSize": "Estimated serving size (e.g., '1 plate ~300g')",
  "nutrition": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "fiber": 0,
    "sugar": 0,
    "vitamins": [
      { "name": "Vitamin A", "amount": "120mcg", "dailyPercent": 13 }
    ],
    "minerals": [
      { "name": "Iron", "amount": "2.5mg", "dailyPercent": 14 }
    ]
  },
  "gutHealth": {
    "score": 75,
    "beneficialBacteria": [
      { "name": "Lactobacillus acidophilus", "benefit": "Improves lactose digestion and strengthens gut lining" }
    ],
    "harmfulPathogens": [
      { "name": "None significant", "risk": "Low risk when properly prepared" }
    ],
    "prebioticContent": "Description of prebiotic fiber content",
    "probioticContent": "Description of probiotic content",
    "overallVerdict": "Brief gut health assessment"
  },
  "brainHealth": {
    "score": 70,
    "keyNutrients": ["Omega-3", "B12"],
    "verdict": "Brief brain health assessment"
  },
  "healthTips": [
    "Tip 1 about this food",
    "Tip 2 about this food"
  ]
}

Rules:
- Be accurate with nutritional estimates based on standard serving sizes
- List specific bacteria strains (Lactobacillus, Bifidobacterium, etc.) that the food promotes or contains
- List any pathogen risks (Salmonella, E. coli, Listeria, etc.) with context
- Gut health score: 0-100 based on fiber, fermented content, prebiotic value, anti-inflammatory properties
- Brain health score: 0-100 based on omega-3, antioxidants, B-vitamins, iron, choline
- Include at least 4 vitamins and 4 minerals with daily percent values
- Health tips should be actionable and specific to this food
- If you cannot identify the food, make your best guess and note uncertainty in the description`;

export async function analyzeFood(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif"
): Promise<FoodAnalysis> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: FOOD_ANALYSIS_PROMPT,
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Parse JSON — handle potential markdown code blocks
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned) as FoodAnalysis;
}

export async function chatWithNutritionist(
  message: string,
  foodHistory: string
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: `You are GutSense AI, a friendly and knowledgeable gut health nutritionist. You help users improve their diet with a focus on:
- Gut microbiome health (beneficial bacteria, reducing pathogens)
- Balanced nutrition (protein, vitamins, minerals, fiber)
- Vegetarian alternatives with better nutritional profiles
- Practical, achievable dietary changes

The user's recent food history:
${foodHistory || "No meals logged yet."}

Keep responses concise, warm, and actionable. Use simple language. When suggesting foods, mention specific gut bacteria benefits. Focus on what the user CAN eat, not just what to avoid.`,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}
