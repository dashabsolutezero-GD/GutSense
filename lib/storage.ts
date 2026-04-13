import type { SavedMeal, FoodAnalysis, DailyNutrition } from "./types";

const MEALS_KEY = "gutsense_meals";

export function saveMeal(
  analysis: FoodAnalysis,
  imageData: string
): SavedMeal {
  const meal: SavedMeal = {
    id: crypto.randomUUID(),
    analysis,
    imageData,
    timestamp: Date.now(),
  };
  const meals = getMeals();
  meals.unshift(meal);
  // Keep last 100 meals
  if (meals.length > 100) meals.length = 100;
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
  return meal;
}

export function getMeals(): SavedMeal[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(MEALS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getTodaysMeals(): SavedMeal[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfDay = today.getTime();
  return getMeals().filter((m) => m.timestamp >= startOfDay);
}

export function getDailyNutrition(): DailyNutrition {
  const meals = getTodaysMeals();
  const totals: DailyNutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    mealCount: meals.length,
  };
  for (const meal of meals) {
    const n = meal.analysis.nutrition;
    totals.calories += n.calories;
    totals.protein += n.protein;
    totals.carbs += n.carbs;
    totals.fat += n.fat;
    totals.fiber += n.fiber;
  }
  return totals;
}

export function getFoodHistorySummary(): string {
  const meals = getMeals().slice(0, 20);
  if (meals.length === 0) return "No meals logged yet.";
  return meals
    .map((m) => {
      const date = new Date(m.timestamp).toLocaleDateString();
      const n = m.analysis.nutrition;
      return `${date}: ${m.analysis.foodName} (${n.calories} cal, ${n.protein}g protein, gut score: ${m.analysis.gutHealth.score}/100)`;
    })
    .join("\n");
}

export function deleteMeal(id: string): void {
  const meals = getMeals().filter((m) => m.id !== id);
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}
