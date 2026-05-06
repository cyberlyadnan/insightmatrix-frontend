import { dehydrate, type QueryClient } from "@tanstack/react-query";

/**
 * Serialize cache for `<HydrationBoundary state={...}>` after prefetching in a Server Component.
 */
export function dehydrateQueryClient(queryClient: QueryClient) {
  return dehydrate(queryClient);
}
