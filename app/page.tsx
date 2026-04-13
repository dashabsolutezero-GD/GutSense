"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DailySummary from "@/components/DailySummary";
import MealCard from "@/components/MealCard";
import { getDailyNutrition, getTodaysMeals } from "@/lib/storage";
import { createClient } from "@/lib/supabase-browser";
import type { SavedMeal, DailyNutrition } from "@/lib/types";

export default function Dashboard() {
  const [nutrition, setNutrition] = useState<DailyNutrition>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    mealCount: 0,
  });
  const [recentMeals, setRecentMeals] = useState<SavedMeal[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    setNutrition(getDailyNutrition());
    setRecentMeals(getTodaysMeals().slice(0, 5));
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, [supabase.auth]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <main className="max-w-lg mx-auto px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold gradient-text">GutSense</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-text-secondary text-sm">{greeting}</p>
            {userEmail && (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/login";
                }}
                className="text-[10px] text-muted hover:text-danger transition-colors"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
        <Link
          href="/camera"
          className="w-12 h-12 rounded-full bg-primary flex items-center justify-center glow-green hover:bg-primary-dark transition-all active:scale-95"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Link>
      </div>

      {/* Daily Summary */}
      <section className="mb-6">
        <DailySummary nutrition={nutrition} />
      </section>

      {/* Quick Actions */}
      <section className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/camera"
            className="bg-surface rounded-2xl p-4 hover:bg-surface-hover transition-colors group card-shadow"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-text">Scan Food</p>
            <p className="text-xs text-muted mt-0.5">Photo analysis</p>
          </Link>

          <Link
            href="/chat"
            className="bg-surface rounded-2xl p-4 hover:bg-surface-hover transition-colors group card-shadow"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-light flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <svg
                className="w-5 h-5 text-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-text">AI Nutritionist</p>
            <p className="text-xs text-muted mt-0.5">Diet advice</p>
          </Link>
        </div>
      </section>

      {/* Recent Meals */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            Today&apos;s Meals
          </h2>
          {recentMeals.length > 0 && (
            <Link href="/history" className="text-xs font-medium text-primary">
              See all
            </Link>
          )}
        </div>

        {recentMeals.length === 0 ? (
          <div className="bg-surface rounded-2xl p-8 text-center card-shadow">
            <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-text-secondary">
              No meals yet today
            </p>
            <p className="text-xs text-muted mt-1">
              Scan your first meal to start tracking
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} compact />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
