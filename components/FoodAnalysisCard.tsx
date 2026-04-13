"use client";

import { useState } from "react";
import type { FoodAnalysis } from "@/lib/types";
import NutritionGrid from "./NutritionGrid";
import BacteriaPanel from "./BacteriaPanel";

interface Props {
  analysis: FoodAnalysis;
}

type Tab = "nutrition" | "gut" | "tips";

export default function FoodAnalysisCard({ analysis }: Props) {
  const [tab, setTab] = useState<Tab>("nutrition");

  const tabs: { key: Tab; label: string }[] = [
    { key: "nutrition", label: "Nutrition" },
    { key: "gut", label: "Gut & Brain" },
    { key: "tips", label: "Tips" },
  ];

  return (
    <div className="animate-slide-up space-y-4">
      {/* Header */}
      <div className="bg-surface rounded-2xl p-5 card-shadow">
        <h3 className="text-xl font-bold text-text">{analysis.foodName}</h3>
        <p className="text-sm text-text-secondary mt-1 leading-relaxed">
          {analysis.description}
        </p>
        <div className="mt-3 inline-flex items-center bg-primary-light text-primary text-xs font-medium px-3 py-1 rounded-full">
          {analysis.servingSize}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-surface rounded-2xl p-1.5 card-shadow">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              tab === t.key
                ? "bg-primary text-white shadow-md"
                : "text-muted hover:text-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {tab === "nutrition" && (
          <NutritionGrid nutrition={analysis.nutrition} />
        )}

        {tab === "gut" && (
          <BacteriaPanel
            gutHealth={analysis.gutHealth}
            brainHealth={analysis.brainHealth}
          />
        )}

        {tab === "tips" && (
          <div className="space-y-2.5">
            {analysis.healthTips.map((tip, i) => (
              <div
                key={i}
                className="bg-surface rounded-2xl px-4 py-3.5 card-shadow flex gap-3 items-start"
              >
                <span className="w-7 h-7 rounded-full bg-primary-light text-primary text-sm font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
