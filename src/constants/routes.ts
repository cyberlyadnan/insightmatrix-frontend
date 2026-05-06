export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  panel: {
    root: "/user",
    surveys: "/user/surveys",
    wallet: "/user/wallet",
    settings: "/user/settings",
    help: "/user/help",
  },
  admin: {
    root: "/admin",
    settings: "/admin/settings",
  },
} as const;

export const AUTH_ROUTE_LIST = [
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
] as const;

export function isAuthRoute(pathname: string): boolean {
  return (AUTH_ROUTE_LIST as readonly string[]).includes(pathname);
}
