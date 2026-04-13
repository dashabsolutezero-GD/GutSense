export interface FoodAnalysis {
  foodName: string;
  description: string;
  servingSize: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    vitamins: NutrientDetail[];
    minerals: NutrientDetail[];
  };
  gutHealth: {
    score: number;
    beneficialBacteria: BacteriaInfo[];
    harmfulPathogens: PathogenInfo[];
    prebioticContent: string;
    probioticContent: string;
    overallVerdict: string;
  };
  brainHealth: {
    score: number;
    keyNutrients: string[];
    verdict: string;
  };
  healthTips: string[];
}

export interface NutrientDetail {
  name: string;
  amount: string;
  dailyPercent: number;
}

export interface BacteriaInfo {
  name: string;
  benefit: string;
}

export interface PathogenInfo {
  name: string;
  risk: string;
}

export interface SavedMeal {
  id: string;
  analysis: FoodAnalysis;
  imageData: string;
  timestamp: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface DailyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  mealCount: number;
}
