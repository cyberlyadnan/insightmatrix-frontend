import type { QueryFunctionContext } from "@tanstack/react-query";
import { apiClient } from "@/services/api";

type ApiGetContext = Pick<QueryFunctionContext, "signal">;

/**
 * Standard GET queryFn — forwards TanStack `signal` for cancellation when the query unmounts or refetches.
 *
 * @example
 * useQuery({
 *   queryKey: queryKeys.surveys.detail(id),
 *   queryFn: ({ signal }) => apiGet<Survey>(`/surveys/${id}`, { signal }),
 * });
 */
export async function apiGet<T>(url: string, ctx?: ApiGetContext): Promise<T> {
  const { data } = await apiClient.get<T>(url, { signal: ctx?.signal });
  return data;
}
