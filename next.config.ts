import type { NextConfig } from "next";

/**
 * Same-origin `/api/v1` proxy so httpOnly auth cookies bind to the Next origin
 * (e.g. localhost:3000). Never fall back to production — that sets
 * Domain=.insightmatrix.online; Secure cookies the browser rejects locally,
 * which causes login → dashboard → bounce back to login.
 */
const LOCAL_BACKEND = "http://127.0.0.1:5000";

const backendOrigin = (
  process.env.BACKEND_URL ||
  process.env.API_PUBLIC_URL ||
  process.env.NEXT_PUBLIC_API_PUBLIC_URL ||
  LOCAL_BACKEND
).replace(/\/$/, "");

if (process.env.NODE_ENV !== "production") {
  console.info(`[next.config] API rewrite → ${backendOrigin}`);
}

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
