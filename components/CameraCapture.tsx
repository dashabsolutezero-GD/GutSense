"use client";

import { useState, useRef, useCallback } from "react";
import type { FoodAnalysis } from "@/lib/types";
import { saveMeal } from "@/lib/storage";
import FoodAnalysisCard from "./FoodAnalysisCard";

export default function CameraCapture() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const analyzeFood = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setSaved(false);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImageData(dataUrl);

      try {
        const [header, base64] = dataUrl.split(",");
        const mediaType = header.match(/:(.*?);/)?.[1] || "image/jpeg";

        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, mediaType }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `Server error: ${res.status}`);
        }

        const data: FoodAnalysis = await res.json();
        setAnalysis(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to analyze food"
        );
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) analyzeFood(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      analyzeFood(file);
    }
  };

  const handleSave = () => {
    if (analysis && imageData) {
      saveMeal(analysis, imageData);
      setSaved(true);
    }
  };

  const reset = () => {
    setImageData(null);
    setAnalysis(null);
    setError(null);
    setLoading(false);
    setSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  // ── Results View ───────────────────────────────────────
  if (imageData) {
    return (
      <div className="space-y-4">
        <div className="relative rounded-2xl overflow-hidden bg-surface card-shadow-lg">
          <img
            src={imageData}
            alt="Food photo"
            className="w-full max-h-[40vh] object-contain"
          />
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-text">
                Analyzing with Claude AI...
              </span>
              <span className="text-xs text-muted animate-pulse-soft">
                Identifying nutrition, bacteria &amp; more
              </span>
            </div>
          )}
        </div>

        {analysis && <FoodAnalysisCard analysis={analysis} />}

        {error && (
          <div className="rounded-2xl bg-danger-light border border-danger/15 p-4 text-center card-shadow">
            <p className="text-danger text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 py-3 rounded-xl bg-surface text-text font-semibold hover:bg-surface-hover transition-colors card-shadow"
          >
            Scan Another
          </button>
          {analysis && !saved && (
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all active:scale-[0.98] glow-green"
            >
              Save to History
            </button>
          )}
          {saved && (
            <div className="flex-1 py-3 rounded-xl bg-primary-light text-primary font-semibold text-center">
              Saved!
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Capture / Upload View ──────────────────────────────
  return (
    <div className="space-y-4">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={() => cameraInputRef.current?.click()}
        className="w-full py-20 rounded-2xl bg-surface border-2 border-dashed border-primary/25 hover:border-primary/50 transition-all flex flex-col items-center gap-4 group card-shadow"
      >
        <div className="w-18 h-18 rounded-full bg-primary-light flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg
            className="w-9 h-9 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
            />
          </svg>
        </div>
        <div>
          <span className="text-primary font-semibold block">Take Photo</span>
          <span className="text-muted text-sm">Opens camera on mobile</span>
        </div>
      </button>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full py-14 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center gap-2 ${
          dragOver
            ? "bg-primary-light border-primary"
            : "bg-surface border-border hover:border-muted card-shadow"
        }`}
      >
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
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <span className="text-text-secondary text-sm font-medium">
          Upload a photo
        </span>
        <span className="text-muted text-xs">
          Drag &amp; drop or click to browse
        </span>
      </div>
    </div>
  );
}
