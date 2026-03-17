"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  
  // Define auth routes
  const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthPage = authRoutes.includes(pathname);
  const isAdminPage = pathname.startsWith("/admin");
  const isPanelPage = pathname.startsWith("/panel");

  useEffect(() => {
    if (isAuthPage) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Initial check
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
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <Link 
              href="/" 
              className={`text-2xl font-black tracking-tight transition-colors ${
                isScrolled || !isHomePage ? "text-brand-primary" : "text-white"
              }`}
            >
              InsightMatrix<span className="text-xl align-top font-normal">&reg;</span>
            </Link>
            
            {/* Country Selector (mock) */}
            <button className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors text-sm font-medium ${
              isScrolled || !isHomePage
                ? "border-gray-200 text-gray-700 hover:bg-gray-50" 
                : "border-white/30 text-white hover:bg-white/10"
            }`}>
              <span>🇬🇧</span> UK
            </button>
          </div>

          {/* Desktop Menu */}
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

          {/* Right Actions */}
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
              className={`p-2.5 rounded-full border transition-all flex items-center justify-center ${
                isScrolled || !isHomePage
                  ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                  : "border-white/40 text-white hover:bg-white/10"
              }`}
            >
              <Search size={18} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none ${
                isScrolled || !isHomePage ? "text-gray-900" : "text-white"
              }`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute top-full left-0 w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 text-base font-bold text-gray-800 hover:text-brand-primary border-b border-gray-50"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center border border-gray-200 text-gray-800 px-5 py-3 rounded-full font-bold hover:bg-gray-50 transition"
              >
                Contact
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center border border-gray-200 text-gray-800 px-5 py-3 rounded-full font-bold hover:bg-gray-50 transition"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
