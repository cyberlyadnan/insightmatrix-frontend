/** Shared cache timings — tune per domain when APIs stabilize */

export const QUERY_GC_TIME_MS = 5 * 60 * 1000;
export const QUERY_STALE_TIME_MS = 60 * 1000;

/** Long-lived reference data (roles, locales, static lookups) */
export const QUERY_STALE_TIME_STATIC_MS = 10 * 60 * 1000;
