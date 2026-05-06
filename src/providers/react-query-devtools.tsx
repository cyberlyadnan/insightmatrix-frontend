"use client";

import dynamic from "next/dynamic";
import { env } from "@/config";

const Devtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then((mod) => ({
      default: mod.ReactQueryDevtools,
    })),
  { ssr: false }
);

export function ReactQueryDevtoolsPanel() {
  if (!env.isDev) return null;

  return <Devtools initialIsOpen={false} buttonPosition="bottom-left" position="bottom" />;
}
