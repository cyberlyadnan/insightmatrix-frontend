"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface PageHeaderProps {
  badge?: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
  visual?: ReactNode;
}

export default function PageHeader({
  badge,
  title,
  description,
  buttonText,
  buttonHref = "/register",
  visual,
}: PageHeaderProps) {
  return (
    <div className="relative pt-24 pb-16 lg:pt-36 lg:pb-24 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-subtle/50 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-light/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 text-left">
            {badge && (
              <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-brand-subtle border border-brand-light text-brand-primary mb-8 shadow-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                {badge}
              </div>
            )}

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-accent1 to-brand-accent2">
                {title}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed font-medium max-w-2xl">
              {description}
            </p>

            {buttonText && (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href={buttonHref}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-lg font-extrabold rounded-full text-white bg-brand-primary hover:bg-brand-hover shadow-xl shadow-brand-primary/20 transition-all hover:-translate-y-0.5"
                >
                  {buttonText}
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Link>
              </div>
            )}
          </div>

          <div className="flex-1 relative w-full max-w-lg">{visual}</div>
        </div>
      </div>
    </div>
  );
}
