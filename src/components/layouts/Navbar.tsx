"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isAuthRoute } from "@/constants";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const isAuthPage = isAuthRoute(pathname);
  const isAdminPage = pathname.startsWith("/admin");
  const isPanelPage = pathname.startsWith("/panel");

  useEffect(() => {
    if (isAuthPage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAuthPage, pathname]);

  const navLinks = [
    { name: "Data & research", href: "/research" },
    { name: "Solutions", href: "/services" },
    { name: "Why InsightMatrix", href: "/about" },
  ];

  if (isAuthPage || isAdminPage || isPanelPage) return null;

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white border-b border-gray-100 shadow-sm py-2"
            : isHomePage
              ? "bg-transparent py-4 border-b border-transparent"
              : "bg-white/80 backdrop-blur-md py-3 border-b border-gray-100 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex-shrink-0 flex items-center gap-4">
              <Link
                href="/"
                className={`text-2xl font-black tracking-tight transition-colors ${
                  isScrolled || !isHomePage ? "text-brand-primary" : "text-white"
                }`}
              >
                InsightMatrix<span className="text-xl align-top font-normal">&reg;</span>
              </Link>

              <button
                type="button"
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors text-sm font-medium ${
                  isScrolled || !isHomePage
                    ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                    : "border-white/30 text-white hover:bg-white/10"
                }`}
              >
                <span>🇬🇧</span> UK
              </button>
            </div>

            <div className="hidden lg:flex space-x-6 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-semibold transition-colors ${
                    isScrolled || !isHomePage
                      ? "text-gray-700 hover:text-brand-primary"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/contact"
                className={`px-5 py-2 rounded-full font-bold border transition-all ${
                  isScrolled || !isHomePage
                    ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                    : "border-white/40 text-white hover:bg-white/10"
                }`}
              >
                Contact
              </Link>
              <Link
                href="/register"
                className={`px-5 py-2 rounded-full font-bold border transition-all ${
                  isScrolled || !isHomePage
                    ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                    : "border-white/40 text-white hover:bg-white/10"
                }`}
              >
                Sign in
              </Link>
              <button
                type="button"
                className={`p-2.5 rounded-full border transition-all flex items-center justify-center ${
                  isScrolled || !isHomePage
                    ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                    : "border-white/40 text-white hover:bg-white/10"
                }`}
              >
                <Search size={18} />
              </button>
            </div>

            <div className="lg:hidden flex items-center">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`focus:outline-none ${
                  isScrolled || !isHomePage ? "text-gray-900" : "text-white"
                }`}
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-[101] shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <span className="text-xl font-black text-brand-primary tracking-tight">
                  InsightMatrix<span className="text-lg align-top font-normal">&reg;</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-8 px-6 space-y-6">
                <nav className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-4 rounded-2xl text-lg font-bold transition-all ${
                        pathname === link.href
                          ? "bg-brand-primary/10 text-brand-primary"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <div className="pt-8 border-t border-gray-100 space-y-4">
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full py-4 rounded-2xl bg-gray-900 text-white font-black text-lg shadow-xl shadow-gray-200"
                  >
                    Contact Sales
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full py-4 rounded-2xl border-2 border-gray-100 text-gray-900 font-black text-lg hover:bg-gray-50"
                  >
                    Partner Login
                  </Link>
                </div>
              </div>

              <div className="p-6 border-t border-gray-50 bg-gray-50/50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  &copy; 2024 InsightMatrix Global
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
