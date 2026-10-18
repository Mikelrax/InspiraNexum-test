import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sql.js"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
