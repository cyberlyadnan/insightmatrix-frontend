import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel Book | InsightMatrix",
  description:
    "Request the InsightMatrix Panel Book: methodology, global reach, respondent profiling, and quality standards.",
};

export default function PanelBookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
