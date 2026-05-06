import { QueryClient } from "@tanstack/react-query";

function getHttpStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  if (!("response" in error)) return undefined;
  const response = (error as { response?: { status?: number } }).response;
  return response?.status;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
          const status = getHttpStatus(error);
          if (status === 401 || status === 403 || status === 404) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: process.env.NODE_ENV === "production",
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
