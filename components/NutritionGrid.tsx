"use client";

import type { FoodAnalysis } from "@/lib/types";

interface Props {
  nutrition: FoodAnalysis["nutrition"];
}

function MacroCard({
  label,
  value,
  unit,
  bgColor,
  textColor,
}: {
  label: string;
  value: number;
  unit: string;
  bgColor: string;
  textColor: string;
}) {
  return (
    <div className={`${bgColor} rounded-2xl p-4 card-shadow`}>
      <p className="text-xs text-text-secondary mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textColor}`}>
        {value}
        <span className="text-sm font-normal text-muted ml-0.5">{unit}</span>
      </p>
    </div>
  );
}

export default function NutritionGrid({ nutrition }: Props) {
  return (
    <div className="space-y-4">
      {/* Calories highlight */}
      <div className="bg-accent-light rounded-2xl p-5 text-center card-shadow-lg border border-accent/10">
        <p className="text-xs text-text-secondary uppercase tracking-widest mb-1">
          Calories
        </p>
        <p className="text-5xl font-bold text-accent">{nutrition.calories}</p>
        <p className="text-xs text-muted mt-1">per serving</p>
      </div>

      {/* Macros grid */}
      <div className="grid grid-cols-2 gap-3">
        <MacroCard
          label="Protein"
          value={nutrition.protein}
          unit="g"
          bgColor="bg-teal-light"
          textColor="text-teal"
        />
        <MacroCard
          label="Carbs"
          value={nutrition.carbs}
          unit="g"
          bgColor="bg-blue-light"
          textColor="text-blue"
        />
        <MacroCard
          label="Fat"
          value={nutrition.fat}
          unit="g"
          bgColor="bg-accent-light"
          textColor="text-accent"
        />
        <MacroCard
          label="Fiber"
          value={nutrition.fiber}
          unit="g"
          bgColor="bg-primary-light"
          textColor="text-primary"
        />
      </div>

      {/* Sugar */}
      {nutrition.sugar > 0 && (
        <div className="flex items-center justify-between bg-surface rounded-xl px-4 py-3 card-shadow">
          <span className="text-sm text-text-secondary">Sugar</span>
          <span className="text-sm font-bold text-danger">
            {nutrition.sugar}g
          </span>
        </div>
      )}

      {/* Vitamins */}
      {nutrition.vitamins.length > 0 && (
        <div className="bg-surface rounded-2xl p-4 card-shadow">
          <h4 className="text-xs font-semibold text-purple uppercase tracking-wide mb-3">
            Vitamins
          </h4>
          <div className="space-y-2.5">
            {nutrition.vitamins.map((v) => (
              <div key={v.name} className="flex items-center gap-3">
                <span className="text-xs text-text-secondary w-24 shrink-0">
                  {v.name}
                </span>
                <div className="flex-1 h-2 bg-purple-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(v.dailyPercent, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-text-secondary w-10 text-right">
                  {v.dailyPercent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Minerals */}
      {nutrition.minerals.length > 0 && (
        <div className="bg-surface rounded-2xl p-4 card-shadow">
          <h4 className="text-xs font-semibold text-blue uppercase tracking-wide mb-3">
            Minerals
          </h4>
          <div className="space-y-2.5">
            {nutrition.minerals.map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <span className="text-xs text-text-secondary w-24 shrink-0">
                  {m.name}
                </span>
                <div className="flex-1 h-2 bg-blue-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(m.dailyPercent, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-text-secondary w-10 text-right">
                  {m.dailyPercent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
