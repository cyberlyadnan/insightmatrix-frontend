export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  dashboard: {
    root: "/dashboard",
    surveys: "/dashboard/surveys",
    /** Required member profile questionnaire before surveys (when configured in admin) */
    prescreen: "/dashboard/prescreen",
    wallet: "/dashboard/wallet",
    settings: "/dashboard/settings",
    settingsAccount: "/dashboard/settings/account",
    settingsSecurity: "/dashboard/settings/security",
    help: "/dashboard/help",
  },
  admin: {
    root: "/admin",
    settings: "/admin/settings",
    prescreen: "/admin/prescreen",
    prescreenCreate: "/admin/prescreen/create",
    companies: "/admin/companies",
    companiesCreate: "/admin/companies/create",
    company: (id: string) => `/admin/companies/${id}`,
    companyEdit: (id: string) => `/admin/companies/${id}/edit`,
    surveys: "/admin/surveys",
    surveysCreate: "/admin/surveys/create",
    survey: (id: string) => `/admin/surveys/${id}`,
    surveyEdit: (id: string) => `/admin/surveys/${id}/edit`,
    surveyAnalytics: (id: string) => `/admin/surveys/${id}/analytics`,
    companyPayments: "/admin/company-payments",
  },
  surveyStart: (id: string) => `/survey/start/${id}`,
  /** Partner redirect targets — each records a different outcome via POST to the API */
  surveyCallback: (outcome: "complete" | "quota-full" | "terminate" | "quality") =>
    `/survey/callback/${outcome}`,
  /** Public legal */
  terms: "/terms",
  privacy: "/privacy",
} as const;

export const AUTH_ROUTE_LIST = [
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
  ROUTES.verifyEmail,
] as const;

export function isAuthRoute(pathname: string): boolean {
  return (AUTH_ROUTE_LIST as readonly string[]).includes(pathname);
}
