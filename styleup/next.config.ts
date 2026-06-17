import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "export" removed — app now requires a Node server (Vercel) for API routes
  // basePath only used when deploying to a sub-path (e.g. GitHub Pages demo)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export default nextConfig;
