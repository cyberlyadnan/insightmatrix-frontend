import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_KEYS } from "./constants/cookies";
import { ROUTES } from "./constants/routes";

const VENDOR_AUTH_PATH = ROUTES.vendor.login;

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

  const vendorToken = request.cookies.get(COOKIE_KEYS.vendorAccessToken)?.value;

  if (pathname === VENDOR_AUTH_PATH && vendorToken) {
    return NextResponse.redirect(new URL(ROUTES.vendor.dashboard, request.url));
  }

  if (isAuthPath(pathname) && token) {
    return NextResponse.redirect(new URL(ROUTES.dashboard.root, request.url));
  }

  const guardEnabled = process.env.NEXT_PUBLIC_ENABLE_ROUTE_GUARD === "true";
  if (!guardEnabled) {
    return NextResponse.next();
  }

  const requiresMemberAuth = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const requiresVendorAuth = pathname.startsWith("/vendor") && pathname !== VENDOR_AUTH_PATH;

  if (requiresMemberAuth && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (requiresVendorAuth && !vendorToken) {
    const loginUrl = new URL(VENDOR_AUTH_PATH, request.url);
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
    "/vendor/login",
    "/vendor/dashboard",
    "/vendor/profile",
  ],
};
