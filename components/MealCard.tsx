"use client";

import type { SavedMeal } from "@/lib/types";

interface Props {
  meal: SavedMeal;
  compact?: boolean;
  onClick?: () => void;
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function MealCard({ meal, compact, onClick }: Props) {
  const { analysis } = meal;
  const n = analysis.nutrition;

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-3 bg-surface rounded-2xl p-3.5 w-full text-left hover:bg-surface-hover transition-colors card-shadow"
      >
        {meal.imageData && (
          <img
            src={meal.imageData}
            alt={analysis.foodName}
            className="w-12 h-12 rounded-xl object-cover shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text truncate">
            {analysis.foodName}
          </p>
          <p className="text-xs text-muted">
            {n.calories} cal &middot; {timeAgo(meal.timestamp)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-primary">
            {analysis.gutHealth.score}
          </p>
          <p className="text-[10px] text-muted">gut</p>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="bg-surface rounded-2xl p-4 w-full text-left hover:bg-surface-hover transition-colors card-shadow"
    >
      <div className="flex gap-4">
        {meal.imageData && (
          <img
            src={meal.imageData}
            alt={analysis.foodName}
            className="w-20 h-20 rounded-2xl object-cover shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-text">
            {analysis.foodName}
          </h3>
          <p className="text-xs text-muted mt-0.5">
            {timeAgo(meal.timestamp)}
          </p>

          <div className="flex gap-5 mt-3">
            <div className="text-center">
              <p className="text-sm font-bold text-accent">{n.calories}</p>
              <p className="text-[10px] text-muted">cal</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-teal">{n.protein}g</p>
              <p className="text-[10px] text-muted">protein</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-primary">
                {analysis.gutHealth.score}
              </p>
              <p className="text-[10px] text-muted">gut</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-blue">
                {analysis.brainHealth.score}
              </p>
              <p className="text-[10px] text-muted">brain</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
