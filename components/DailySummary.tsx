"use client";

import type { DailyNutrition } from "@/lib/types";

interface Props {
  nutrition: DailyNutrition;
}

const CALORIE_GOAL = 2000;
const PROTEIN_GOAL = 50;
const CARB_GOAL = 250;
const FAT_GOAL = 65;

function ProgressBar({
  value,
  max,
  color,
  bgColor,
  label,
}: {
  value: number;
  max: number;
  color: string;
  bgColor: string;
  label: string;
}) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-text-secondary">
          {label}
        </span>
        <span className="text-xs text-muted">
          {value}g / {max}g
        </span>
      </div>
      <div className={`h-2 ${bgColor} rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function DailySummary({ nutrition }: Props) {
  const calPct = Math.min(
    Math.round((nutrition.calories / CALORIE_GOAL) * 100),
    100
  );

  return (
    <div className="bg-surface rounded-2xl p-5 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text">
          Today&apos;s Nutrition
        </h3>
        <span className="text-xs text-muted bg-background px-2.5 py-1 rounded-full">
          {nutrition.mealCount} meal{nutrition.mealCount !== 1 ? "s" : ""}
        </span>
      </div>

      {nutrition.mealCount === 0 ? (
        <p className="text-sm text-muted text-center py-4">
          No meals logged today. Scan your food to start tracking!
        </p>
      ) : (
        <div className="space-y-4">
          {/* Calorie ring */}
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="score-ring" width={96} height={96}>
                <circle
                  cx={48}
                  cy={48}
                  r={40}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={6}
                  className="text-accent-light"
                />
                <circle
                  cx={48}
                  cy={48}
                  r={40}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={
                    2 * Math.PI * 40 - (calPct / 100) * 2 * Math.PI * 40
                  }
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-accent">
                  {nutrition.calories}
                </span>
                <span className="text-[9px] text-muted">kcal</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <ProgressBar
                value={nutrition.protein}
                max={PROTEIN_GOAL}
                color="bg-teal"
                bgColor="bg-teal-light"
                label="Protein"
              />
              <ProgressBar
                value={nutrition.carbs}
                max={CARB_GOAL}
                color="bg-blue"
                bgColor="bg-blue-light"
                label="Carbs"
              />
              <ProgressBar
                value={nutrition.fat}
                max={FAT_GOAL}
                color="bg-accent"
                bgColor="bg-accent-light"
                label="Fat"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
