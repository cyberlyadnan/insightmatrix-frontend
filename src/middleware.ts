import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_KEYS } from "./constants/cookies";
import { ROUTES } from "./constants/routes";

const AUTH_PATH_LIST = [
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
  ROUTES.verifyEmail,
] as const;

function isAuthPath(pathname: string): boolean {
  return (AUTH_PATH_LIST as readonly string[]).includes(pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_KEYS.accessToken)?.value;

  if (isAuthPath(pathname) && token) {
    return NextResponse.redirect(new URL(ROUTES.dashboard.root, request.url));
  }

  const guardEnabled = process.env.NEXT_PUBLIC_ENABLE_ROUTE_GUARD === "true";
  if (!guardEnabled) {
    return NextResponse.next();
  }

  const requiresAuth = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (requiresAuth && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
