import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Navbar, Footer } from "@/components/layouts";
import { AppProviders } from "@/providers";
import { SEO_CONTENT } from "@/constants/site-content";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: SEO_CONTENT.defaultTitle,
  description: SEO_CONTENT.defaultDescription,
  keywords: [
    "market research",
    "business intelligence",
    "healthcare research",
    "B2B research",
    "consumer insights",
  ],
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
