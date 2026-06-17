import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Set by the Pages deploy workflow so assets resolve under /Sales/
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export default nextConfig;
