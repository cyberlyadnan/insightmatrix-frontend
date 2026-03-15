import Link from "next/link";
import { ArrowLeft, Home, Search, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-subtle/40 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-light/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mt-20 text-center max-w-full sm:max-w-2xl mx-auto w-full">
        {/* Large 404 Visual */}
        <div className="relative inline-block mb-8 sm:mb-12 w-full max-w-full px-4 overflow-hidden">
            <h1 className="text-[5rem] min-[400px]:text-[7rem] sm:text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-brand-primary via-brand-accent1 to-white/20 select-none">
                404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
                <div className="whitespace-nowrap inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gray-900 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-2xl">
                    <Search className="w-3 h-3 text-brand-primary" /> Lost in Reality?
                </div>
            </div>
        </div>

        {/* Message */}
        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-6">
            Page could <span className="text-brand-primary">not</span> be found
        </h2>
        <p className="text-lg sm:text-xl text-gray-500 font-medium mb-12 leading-relaxed">
            The insights you're looking for aren't here. It seems this link has expired or the reality of this page has shifted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-lg font-black rounded-full text-white bg-brand-primary hover:bg-brand-hover shadow-xl shadow-brand-primary/20 transition-all hover:scale-105"
            >
                <Home className="mr-2 w-5 h-5" /> Back to Home
            </Link>
            <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-lg font-black rounded-full text-gray-900 border-2 border-gray-100 hover:bg-gray-50 transition-all"
            >
                Contact Support
            </Link>
        </div>

        {/* Decorative Sparkle */}
        {/* <div className="mt-20 flex justify-center text-brand-light">
            <Sparkles className="w-12 h-12 animate-pulse" />
        </div> */}
      </div>
      
      {/* Bottom Footer Mockup Line */}
      <div className="absolute text-center bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-gray-400">
          InsightMatrix Global Error Management
      </div>
    </div>
  );
}
