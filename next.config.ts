import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async rewrites() {
    const api = (process.env.API_SERVER_URL || "http://localhost:5000").replace(
      /\/$/,
      "",
    );
    return [{ source: "/api/:path*", destination: `${api}/api/:path*` }];
  },
};
export default nextConfig;
