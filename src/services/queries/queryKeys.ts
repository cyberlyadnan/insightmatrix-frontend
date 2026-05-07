/**
 * Central factory for TanStack Query keys — prevents collisions and eases invalidation.
 */
export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const,
    profile: ["auth", "profile"] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (id: string) => ["users", id] as const,
    list: (filters: Record<string, unknown>) => ["users", "list", filters] as const,
  },
  surveys: {
    all: ["surveys"] as const,
    detail: (id: string) => ["surveys", id] as const,
    list: (filters: Record<string, unknown>) => ["surveys", "list", filters] as const,
  },
  analytics: {
    dashboard: ["analytics", "dashboard"] as const,
  },
  admin: {
    overview: ["admin", "overview"] as const,
    deletionRequests: ["admin", "deletion-requests"] as const,
  },
  prescreens: {
    all: ["prescreens"] as const,
    list: (filters: Record<string, unknown>) => ["prescreens", "list", filters] as const,
    detail: (id: string) => ["prescreens", id] as const,
    categories: ["prescreens", "categories"] as const,
  },
  contactQueries: {
    all: ["contact-queries"] as const,
    list: (filters: Record<string, unknown>) => ["contact-queries", "list", filters] as const,
    subjects: ["contact-queries", "subjects"] as const,
  },
} as const;
