import type { DefaultError, UseMutationOptions } from "@tanstack/react-query";

/** Narrow mutation configs at feature boundaries for consistent optimistic update hooks later */
export function mutationDefaults<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(): Pick<UseMutationOptions<TData, TError, TVariables, TContext>, "retry" | "networkMode"> {
  return {
    retry: 0,
    networkMode: "online",
  };
}
