import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow loading images from any domain (for food photos)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
