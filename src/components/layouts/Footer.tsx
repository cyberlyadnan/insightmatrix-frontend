"use client";

import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, ArrowRight, Globe, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { isAuthRoute } from "@/constants";

export default function Footer() {
  const pathname = usePathname();
  const isAuthPage = isAuthRoute(pathname);
  const isAdminPage = pathname.startsWith("/admin");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isSurveyStartPage = pathname.startsWith("/survey/start");
  const isSurveyCallbackPage = pathname.startsWith("/survey/callback");

  const currentYear = new Date().getFullYear();

  if (isAuthPage || isAdminPage || isDashboardPage || isSurveyStartPage || isSurveyCallbackPage) {
    return null;
  }

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="text-2xl font-black text-white tracking-tighter inline-flex items-center gap-1 group"
            >
              InsightMatrix
              <span className="text-xl align-top font-normal text-brand-primary group-hover:rotate-12 transition-transform">
                &reg;
              </span>
            </Link>
            <p className="mt-6 text-base leading-relaxed max-w-sm">
              The world&apos;s most connected proprietary panel. Engineering accuracy into every
              step of the research process.
            </p>
            <div className="mt-8 flex items-center gap-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300"
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-6">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6">
              Stay Updated
            </h3>
            <p className="text-sm mb-6 leading-relaxed">
              Get the latest market insights and platform updates delivered to your inbox.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-primary transition-colors pr-12"
              />
              <button
                type="button"
                className="absolute right-1 top-1 bottom-1 w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center hover:bg-brand-hover transition-colors"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6">
              Support
            </h3>
            <div className="space-y-4">
              <a
                href="mailto:help@insightmatrix.com"
                className="flex items-center gap-3 group text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                  <Mail size={14} className="group-hover:text-brand-primary transition-colors" />
                </div>
                help@insightmatrix.com
              </a>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Globe size={14} />
                </div>
                Multi-language support 24/7
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16">
          <div>
            <h4 className="text-white font-black text-sm mb-8">Solutions</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="#" className="hover:text-brand-primary transition-colors">
                  Brand tracking
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-primary transition-colors">
                  Audience profiling
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-primary transition-colors">
                  Market intelligence
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-primary transition-colors">
                  Public opinion
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black text-sm mb-8">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="#" className="hover:text-brand-primary transition-colors">
                  Survey Panel
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-primary transition-colors">
                  Distribution
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-primary transition-colors">
                  Quality control
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-primary transition-colors">
                  API for research
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black text-sm mb-8">Company</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/about" className="hover:text-brand-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-primary transition-colors">
                  Case studies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-primary transition-colors">
                  Partnerships
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-primary transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black text-sm mb-8">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-brand-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy#cookies"
                  className="hover:text-brand-primary transition-colors"
                >
                  Cookie policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy#your-rights"
                  className="hover:text-brand-primary transition-colors"
                >
                  Your privacy choices
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[10px] uppercase font-black tracking-widest text-gray-600">
            <p>&copy; {currentYear} InsightMatrix Global</p>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <span>🇬🇧</span> UK-EN
            </div>
          </div>

          <div className="flex gap-8">
            <Link
              href="#"
              className="text-[10px] uppercase font-black tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              Cookie Settings
            </Link>
            <Link
              href="#"
              className="text-[10px] uppercase font-black tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              Do Not Sell My Info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
