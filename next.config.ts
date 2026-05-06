import type { NextConfig } from "next";

/** Same-origin API proxy so httpOnly auth cookies work with the Next dev server */
const backendOrigin = process.env.BACKEND_URL ?? "http://127.0.0.1:5000";

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
