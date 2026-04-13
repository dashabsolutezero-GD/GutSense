"use client";

import CameraCapture from "@/components/CameraCapture";

export default function CameraPage() {
  return (
    <main className="max-w-lg mx-auto px-5 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text">Scan Food</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Take a photo or upload to get full nutrition &amp; gut health analysis
        </p>
      </div>

      <CameraCapture />
    </main>
  );
}
