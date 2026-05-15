"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { RedirectIfAuthenticated } from "@/components/auth/redirect-if-authenticated";
import { ImxLogo } from "@/components/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white relative">
      {/* Back Button - Responsive Positioning */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 text-gray-600 hover:text-brand-primary hover:border-brand-primary transition-all shadow-sm font-bold text-sm lg:bg-white lg:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Left Side - Visual/Branding */}
      <div className="relative hidden lg:flex items-center justify-center bg-gradient-to-br from-brand-accent1 via-brand-primary to-brand-accent2 overflow-hidden">
        {/* Animated Shapes */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white/10 blur-3xl mix-blend-overlay"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-brand-accent1/20 blur-3xl mix-blend-overlay"
        />

        <div className="relative z-10 px-12 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <ImxLogo href="/" size="lg" surface="dark" className="mb-8" />
            <h2 className="text-4xl font-extrabold mb-6">Welcome back</h2>
            <p className="text-xl text-white/90 max-w-md mx-auto leading-relaxed">
              Join thousands of creators and brands and start collaborating today. Your perspective
              matters.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <h4 className="text-2xl font-bold mb-1">2M+</h4>
              <p className="text-sm text-white/80">Active Users</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <h4 className="text-2xl font-bold mb-1">50k+</h4>
              <p className="text-sm text-white/80">Active Brands</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forms */}
      <div className="flex items-center justify-center p-8 bg-gray-50/50 pt-24 lg:pt-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <ImxLogo href="/" size="md" surface="light" />
          </div>
          <RedirectIfAuthenticated>{children}</RedirectIfAuthenticated>
        </div>
      </div>
    </div>
  );
}
