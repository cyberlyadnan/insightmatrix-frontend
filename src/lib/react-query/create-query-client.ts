import {
  MutationCache,
  QueryCache,
  QueryClient,
  type QueryClientConfig,
} from "@tanstack/react-query";
import { env } from "@/config";
import { parseApiError } from "@/services/api/errors";
import { QUERY_GC_TIME_MS, QUERY_STALE_TIME_MS } from "./constants";

function getHttpStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  if (!("response" in error)) return undefined;
  const response = (error as { response?: { status?: number } }).response;
  return response?.status;
}

function logQueryError(queryKey: unknown, error: unknown) {
  if (!env.isDev) return;
  const message = parseApiError(error, "Query failed");
  console.error("[RQ query]", queryKey, message, error);
}

function logMutationError(mutationKey: unknown, error: unknown) {
  if (!env.isDev) return;
  const message = parseApiError(error, "Mutation failed");
  console.error("[RQ mutation]", mutationKey, message, error);
}

const defaultOptions: QueryClientConfig["defaultOptions"] = {
  queries: {
    staleTime: QUERY_STALE_TIME_MS,
    gcTime: QUERY_GC_TIME_MS,
    retry: (failureCount, error) => {
      const status = getHttpStatus(error);
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),
    refetchOnWindowFocus: env.isProd,
    refetchOnReconnect: true,
    /** Prefer explicit `throwOnError` / error boundaries per route */
    throwOnError: false,
    networkMode: "online",
  },
  mutations: {
    retry: 0,
    networkMode: "online",
  },
};

/**
 * Browser + shared defaults. For Server Components prefetch, use `createServerQueryClient()` per request.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => logQueryError(query.queryKey, error),
    }),
    mutationCache: new MutationCache({
      onError: (error, _vars, _ctx, mutation) =>
        logMutationError(mutation.options.mutationKey, error),
    }),
    defaultOptions,
  });
}
