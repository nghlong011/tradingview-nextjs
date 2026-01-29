import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Đảm bảo các native modules hoạt động trên Vercel
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
