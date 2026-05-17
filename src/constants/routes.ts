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
    vendors: "/admin/vendors",
    vendorsCreate: "/admin/vendors/create",
    vendor: (id: string) => `/admin/vendors/${id}`,
    vendorEdit: (id: string) => `/admin/vendors/${id}/edit`,
    surveys: "/admin/surveys",
    surveysCreate: "/admin/surveys/create",
    survey: (id: string) => `/admin/surveys/${id}`,
    surveyEdit: (id: string) => `/admin/surveys/${id}/edit`,
    surveyAnalytics: (id: string) => `/admin/surveys/${id}/analytics`,
    companyPayments: "/admin/company-payments",
    panelBook: "/admin/panel-book",
  },
  vendor: {
    login: "/vendor/login",
    dashboard: "/vendor/dashboard",
    profile: "/vendor/profile",
    surveys: "/vendor/surveys",
    survey: (allocationId: string) => `/vendor/surveys/${allocationId}`,
    start: (allocationCode: string) => `/vendor/start/${allocationCode}`,
  },
  surveyStart: (id: string) => `/survey/start/${id}`,
  /** Partner redirect targets — each records a different outcome via POST to the API */
  surveyCallback: (outcome: "complete" | "quota-full" | "terminate" | "quality") =>
    `/survey/callback/${outcome}`,
  /** Public legal & resources */
  terms: "/terms",
  privacy: "/privacy",
  panelBook: "/panel-book",
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

/** B2B vendor portal — uses vendor* cookies, not member session */
export function isVendorRoute(pathname: string): boolean {
  return pathname === ROUTES.vendor.login || pathname.startsWith("/vendor/");
}
