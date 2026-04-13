"use client";

import { useState, useEffect } from "react";
import MealCard from "@/components/MealCard";
import FoodAnalysisCard from "@/components/FoodAnalysisCard";
import { getMeals, deleteMeal } from "@/lib/storage";
import type { SavedMeal } from "@/lib/types";

export default function HistoryPage() {
  const [meals, setMeals] = useState<SavedMeal[]>([]);
  const [selected, setSelected] = useState<SavedMeal | null>(null);

  useEffect(() => {
    setMeals(getMeals());
  }, []);

  const handleDelete = (id: string) => {
    deleteMeal(id);
    setMeals(getMeals());
    setSelected(null);
  };

  if (selected) {
    return (
      <main className="max-w-lg mx-auto px-5 py-6">
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-text-secondary hover:text-text flex items-center gap-1 mb-4 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to History
        </button>

        {selected.imageData && (
          <div className="rounded-2xl overflow-hidden mb-4 card-shadow-lg">
            <img
              src={selected.imageData}
              alt={selected.analysis.foodName}
              className="w-full max-h-[35vh] object-contain bg-surface"
            />
          </div>
        )}

        <FoodAnalysisCard analysis={selected.analysis} />

        <button
          onClick={() => handleDelete(selected.id)}
          className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-danger bg-danger-light hover:bg-danger/10 transition-colors"
        >
          Delete from History
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-5 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text">Food History</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          {meals.length} meal{meals.length !== 1 ? "s" : ""} logged
        </p>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-surface card-shadow flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-text-secondary font-medium">
            No meals logged yet
          </p>
          <p className="text-xs text-muted mt-1">
            Scan food from the camera tab to start
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onClick={() => setSelected(meal)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
