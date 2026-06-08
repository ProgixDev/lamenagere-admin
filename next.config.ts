import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, Next detects a stray
  // package-lock.json in the user's home directory and resolves modules from
  // there — pulling in a second copy of React (home: 19.2.6 vs project: 19.2.4).
  // Duplicate React breaks client-side hydration: pages render but event
  // handlers never attach, so buttons appear dead (no error in the UI).
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
