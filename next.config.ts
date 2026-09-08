import type { NextConfig } from "next";

/** Same-origin API proxy so httpOnly auth cookies work with the Next dev server */
const backendOrigin =
  process.env.BACKEND_URL ||
  process.env.API_PUBLIC_URL ||
  process.env.NEXT_PUBLIC_API_PUBLIC_URL ||
  "https://api.insightmatrix.online";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
