"use client";

import type { FoodAnalysis } from "@/lib/types";

interface Props {
  gutHealth: FoodAnalysis["gutHealth"];
  brainHealth: FoodAnalysis["brainHealth"];
}

function ScoreRing({
  score,
  label,
  color,
  bgColor,
  size = 90,
}: {
  score: number;
  label: string;
  color: string;
  bgColor: string;
  size?: number;
}) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex flex-col items-center gap-2 ${bgColor} rounded-2xl p-4`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="score-ring" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={5}
            className="text-background"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-text">{score}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-text-secondary">{label}</span>
    </div>
  );
}

export default function BacteriaPanel({ gutHealth, brainHealth }: Props) {
  return (
    <div className="space-y-4">
      {/* Scores */}
      <div className="grid grid-cols-2 gap-3">
        <ScoreRing
          score={gutHealth.score}
          label="Gut Health"
          color="#10b981"
          bgColor="bg-primary-light"
        />
        <ScoreRing
          score={brainHealth.score}
          label="Brain Health"
          color="#3b82f6"
          bgColor="bg-blue-light"
        />
      </div>

      {/* Gut verdict */}
      <div className="bg-primary-light rounded-2xl p-4 border border-primary/15 card-shadow">
        <p className="text-sm text-text leading-relaxed">
          {gutHealth.overallVerdict}
        </p>
      </div>

      {/* Beneficial bacteria */}
      {gutHealth.beneficialBacteria.length > 0 && (
        <div className="bg-surface rounded-2xl p-4 card-shadow">
          <h4 className="text-xs font-semibold text-teal uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal" />
            Beneficial Bacteria
          </h4>
          <div className="space-y-2.5">
            {gutHealth.beneficialBacteria.map((b, i) => (
              <div key={i} className="bg-teal-light rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-teal">{b.name}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {b.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pathogen risks */}
      {gutHealth.harmfulPathogens.length > 0 && (
        <div className="bg-surface rounded-2xl p-4 card-shadow">
          <h4 className="text-xs font-semibold text-danger uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-danger" />
            Pathogen Awareness
          </h4>
          <div className="space-y-2.5">
            {gutHealth.harmfulPathogens.map((p, i) => (
              <div key={i} className="bg-danger-light rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-danger">{p.name}</p>
                <p className="text-xs text-text-secondary mt-0.5">{p.risk}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prebiotic / Probiotic */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface rounded-2xl p-4 card-shadow">
          <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1.5">
            Prebiotic
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            {gutHealth.prebioticContent}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 card-shadow">
          <p className="text-[10px] font-semibold text-teal uppercase tracking-wide mb-1.5">
            Probiotic
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            {gutHealth.probioticContent}
          </p>
        </div>
      </div>

      {/* Brain health */}
      <div className="bg-blue-light rounded-2xl p-4 card-shadow">
        <p className="text-xs font-semibold text-blue mb-2">
          Brain Health Nutrients
        </p>
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {brainHealth.keyNutrients.map((n) => (
            <span
              key={n}
              className="text-[11px] bg-blue/10 text-blue font-medium px-2.5 py-1 rounded-full"
            >
              {n}
            </span>
          ))}
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          {brainHealth.verdict}
        </p>
      </div>
    </div>
  );
}
