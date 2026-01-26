import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Đảm bảo các native modules hoạt động trên Vercel
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
};

export default nextConfig;
