import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "GutSense — AI Gut Health Tracker",
  description:
    "Snap a photo of your food and get instant nutrition, gut bacteria, and brain health analysis powered by Claude AI.",
  icons: { icon: "/icon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-text antialiased">
        <div className="pb-20">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
