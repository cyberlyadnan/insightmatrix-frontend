import "server-only";

import { createQueryClient } from "@/lib/query-client";

/**
 * Always construct a **new** QueryClient per server request when prefetching in RSC / Route Handlers.
 * Never reuse across requests (no shared cache between users).
 */
export function createServerQueryClient() {
  return createQueryClient();
}
