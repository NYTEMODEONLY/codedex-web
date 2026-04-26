import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin Turbopack workspace root to this project so Next stops auto-
  // detecting the user-home lockfile.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
