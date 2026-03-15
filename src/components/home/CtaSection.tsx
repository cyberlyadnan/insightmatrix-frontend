import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group">
          {/* Animated Glow behind the main CTA card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary via-brand-accent1 to-brand-accent2 rounded-[3.5rem] blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-gray-900 rounded-[3.5rem] overflow-hidden p-8 sm:p-16 lg:p-24 shadow-2xl">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-primary/20 to-transparent pointer-events-none" />
            <Sparkles className="absolute -top-10 -right-10 w-48 h-48 opacity-10 text-brand-primary animate-pulse" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
              
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-brand-primary font-bold text-sm mb-8 backdrop-blur-sm">
                  <Zap className="w-4 h-4 mr-2 fill-current" /> Fast & Free Onboarding
                </div>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-6 leading-[1.1]">
                  Ready to share <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent2 font-black">your reality?</span>
                </h2>
                <p className="text-lg text-gray-400 font-medium mb-10 max-w-2xl leading-relaxed">
                  Join 2M+ members worldwide who shape the future of global brands. Sign up in seconds, share your opinion, and earn rewards immediately.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                  <Link
                    href="/register"
                    className="group/btn w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-base font-black rounded-full text-gray-900 bg-white hover:bg-gray-100 shadow-2xl shadow-white/10 transition-all hover:scale-105"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-base font-black rounded-full text-white border-2 border-white/20 hover:bg-white/10 transition-all"
                  >
                    Partnerships
                  </Link>
                </div>

                <div className="mt-12 flex flex-wrap justify-center lg:justify-start items-center gap-8">
                   <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                      <ShieldCheck className="w-5 h-5 text-brand-primary" /> GDPR Protected
                   </div>
                   <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/100?img=${i+25}`} className="w-7 h-7 rounded-full border-2 border-gray-900" />)}
                      </div>
                      2.4M+ Members
                   </div>
                </div>
              </div>

              {/* Visual Side Element */}
              <div className="flex-1 hidden xl:flex justify-end">
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] max-w-sm rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center mb-6 shadow-lg shadow-brand-primary/40">
                       <Zap className="w-7 h-7 text-white fill-current" />
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-3">Live Insights</p>
                    <p className="text-xl font-black text-white leading-tight mb-8">Empowering brands with reality-driven data.</p>
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="h-2 w-24 bg-brand-primary rounded-full" />
                        <span className="text-white font-black text-xs">88% Accuracy</span>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
