import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Navbar, Footer } from "@/components/layouts";
import { AppProviders } from "@/providers";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "InsightMatrix | Professional Survey Platform",
  description:
    "Join the premier platform for high-quality survey research and data collection. Earn rewards and shape the future.",
  keywords: ["surveys", "market research", "rewards", "panel management"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col antialiased bg-gray-50 text-gray-900`}
      >
        <AppProviders>
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
