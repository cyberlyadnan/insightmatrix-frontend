"use client";

import { useQueryClient, type QueryKey } from "@tanstack/react-query";

/** Thin facade around common invalidation/removal patterns used across features */
export function useQueryInvalidation() {
  const queryClient = useQueryClient();

  return {
    invalidate: (queryKey: QueryKey) => queryClient.invalidateQueries({ queryKey }),
    invalidateMany: (predicate: Parameters<typeof queryClient.invalidateQueries>[0]) =>
      queryClient.invalidateQueries(predicate),
    remove: (queryKey: QueryKey) => queryClient.removeQueries({ queryKey }),
    reset: (queryKey: QueryKey) => queryClient.resetQueries({ queryKey }),
    prefetch: queryClient.prefetchQuery.bind(queryClient),
    fetch: queryClient.fetchQuery.bind(queryClient),
    cancel: queryClient.cancelQueries.bind(queryClient),
    client: queryClient,
  };
}
