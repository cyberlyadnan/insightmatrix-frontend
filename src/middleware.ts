import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_KEYS } from "./constants/cookies";

export function middleware(request: NextRequest) {
  const guardEnabled = process.env.NEXT_PUBLIC_ENABLE_ROUTE_GUARD === "true";
  if (!guardEnabled) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_KEYS.accessToken)?.value;

  const requiresAuth = pathname.startsWith("/panel") || pathname.startsWith("/admin");

  if (requiresAuth && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/admin/:path*"],
};
