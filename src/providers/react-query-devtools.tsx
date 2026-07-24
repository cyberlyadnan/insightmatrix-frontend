"use client";

import dynamic from "next/dynamic";
import { env } from "@/config";

/** Lazy-load Devtools only in development — guard against undefined export. */
const Devtools = dynamic(
  async () => {
    const mod = await import("@tanstack/react-query-devtools");
    const Comp = mod.ReactQueryDevtools;
    if (!Comp) {
      return function ReactQueryDevtoolsMissing() {
        return null;
      };
    }
    return Comp;
  },
  { ssr: false }
);

export function ReactQueryDevtoolsPanel() {
  if (!env.isDev) return null;

  return <Devtools initialIsOpen={false} buttonPosition="bottom-left" position="bottom" />;
}
