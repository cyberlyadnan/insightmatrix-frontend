import type { PageHelpContent } from "@/components/crm/page-help";

/** Concise help copy for admin main pages. */
export const ADMIN_PAGE_HELP = {
  dashboard: {
    title: "Dashboard",
    about:
      "View your business overview including active surveys, vendors and operational statistics.",
    actions: "Monitor today’s activity, pending queries, and account deletion requests.",
    tips: "Use the cards to spot workload at a glance, then open the matching module from the sidebar.",
  },
  companies: {
    title: "Survey Providers",
    about: "Manage external survey companies and routers you receive inventory from.",
    actions: "Add providers, update contact details, and set active or inactive status.",
    tips: "Create a provider before linking surveys. Keep company codes unique.",
  },
  vendors: {
    title: "Vendors",
    about: "Manage B2B subpanel partners with vendor portal access.",
    actions: "Create vendors, pause accounts, and review performance metrics.",
    tips: "Active vendors can receive allocations. Configure callback URLs before going live.",
  },
  surveys: {
    title: "Surveys",
    about: "Create and manage surveys, monitor progress and track survey activity.",
    actions: "Add routing surveys, copy share links, pause or resume studies, and open analytics.",
    tips: "Keep survey codes unique. Use share links for internal traffic and allocations for vendors.",
  },
  vendorAllocations: {
    title: "Vendor Allocations",
    about: "Allocate surveys to vendors and monitor their progress.",
    actions: "Assign quota, generate routing links, and track completes per vendor.",
    tips: "Vendors only see the generated routing link — never the raw supplier URL.",
  },
  surveyRespondents: {
    title: "Survey Respondents",
    about: "Browse the respondent data warehouse for panel and vendor traffic.",
    actions: "Search by survey, project ID, tracking id, or token and open respondent details.",
    tips: "Filter by status to focus on completes, terminates, or pending prescreens.",
  },
  respondentAnalytics: {
    title: "Respondent Analytics",
    about: "Review aggregate respondent outcomes across all surveys.",
    actions: "Check completes, terminations, conversion rate, and status breakdowns.",
    tips: "Use filters when available to narrow by survey or vendor before exporting.",
  },
  respondentExports: {
    title: "Export Center",
    about: "Export filtered respondent records for reporting and partner delivery.",
    actions:
      "Set format, status, survey, vendor, and date range, then download CSV, Excel, or PDF.",
    tips: "Status filters apply to all formats. Empty results show an error instead of an empty file. Prefer CSV for very large datasets.",
  },
  securityLogs: {
    title: "Security Logs",
    about: "Inspect security checks and blocked traffic on public survey entry points.",
    actions: "Review block rates, bot signals, and recent security events.",
    tips: "Investigate spikes in block rate before adjusting allowlists or routing rules.",
  },
  companyPayments: {
    title: "Company Payments",
    about: "Track supplier billing invoices generated from routing surveys.",
    actions: "Update payment status and download invoice PDFs for partners.",
    tips: "New surveys auto-create a pending invoice line when billing amounts are set.",
  },
  queries: {
    title: "Queries",
    about: "Handle inbound contact and support messages from the website.",
    actions: "Triage pending items, update status, and remove obsolete messages.",
    tips: "Start with Pending. Mark items in progress so the team avoids duplicate work.",
  },
  panelBook: {
    title: "Panel Book",
    about: "Browse and manage the panel book used for targeting and outreach.",
    actions: "Search members and review profile attributes relevant to studies.",
    tips: "Keep records up to date before launching new survey campaigns.",
  },
  prescreen: {
    title: "Prescreening",
    about: "Create and manage dynamic prescreen questionnaires for routing.",
    actions: "Build forms, publish, set required screens, and duplicate templates.",
    tips: "Publish only when questions are final. Required forms apply to panel and routing traffic.",
  },
  settings: {
    title: "Settings",
    about: "Configure admin preferences and platform notification options.",
    actions: "Review account settings and operational preferences for your team.",
    tips: "Changes here affect how the admin workspace behaves for signed-in users.",
  },
} as const satisfies Record<string, PageHelpContent>;
