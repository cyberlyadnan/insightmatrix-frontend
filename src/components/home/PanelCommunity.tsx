"use client";

import Link from "next/link";
import { Star, Bell, Menu, Coins } from "lucide-react";
import { ImxLogo } from "@/components/brand";

const floatingAvatars = [
  // Left Side Avatars
  {
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    label: "/spending habits",
    pos: "top-4 left-2 lg:-left-12 xl:-left-20",
  },
  {
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    label: "/social behaviour",
    pos: "top-32 left-0 lg:-left-16 xl:-left-24",
  },
  {
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    label: "/steam gaming",
    pos: "top-64 left-2 lg:-left-12 xl:-left-20",
  },
  {
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    label: "/political views",
    pos: "bottom-8 left-1 lg:-left-14 xl:-left-22",
  },

  // Right Side Avatars
  {
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    label: "/amazon shopping",
    pos: "top-6 right-2 lg:-right-12 xl:-right-20",
  },
  {
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    label: "/brand surveys",
    pos: "top-36 right-0 lg:-right-16 xl:-right-24",
  },
  {
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    label: "/gaming history",
    pos: "top-72 right-2 lg:-right-12 xl:-right-20",
  },
  {
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    label: "/banking txns",
    pos: "bottom-12 right-1 lg:-right-14 xl:-right-22",
  },
];

export default function PanelCommunity() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#f8faff] overflow-hidden">
      {/* Background Lighting Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-brand-primary/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative max-w-5xl mx-auto">
          {/* Floating Avatars (Desktop / Wide screens) */}
          {floatingAvatars.map((item, idx) => (
            <div
              key={idx}
              className={`absolute hidden lg:flex flex-col items-center gap-1 z-30 transition-all duration-300 hover:scale-110 ${item.pos}`}
            >
              <img
                src={item.img}
                alt={item.label}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-white shadow-xl object-cover"
              />
              <span className="text-[11px] font-bold text-gray-700 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md border border-slate-100 whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}

          {/* Main Blue Container Card */}
          <div className="relative rounded-[2.5rem] bg-[#0b4fd9] p-8 sm:p-12 lg:p-16 shadow-2xl text-white flex flex-col lg:flex-row items-center justify-between min-h-[440px]">
            {/* Left Main Content */}
            <div className="lg:w-6/12 z-20 text-left mb-10 lg:mb-0 pr-0 lg:pr-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] mb-6">
                &quot;The best survey app ever&quot;
              </h2>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed font-medium mb-10">
                Our 30 million members say our surveys are interesting, our app is easy to use, they
                appreciate the rewards &amp; love seeing their opinions reported around the world.
              </p>

              <Link
                href="/register"
                className="inline-flex items-center justify-center px-9 py-4 rounded-full bg-white text-[#0b4fd9] font-black text-base hover:bg-slate-100 transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                Join the community
              </Link>
            </div>

            {/* Right Side Phone Mockup (Overlapping visually) */}
            <div className="lg:w-6/12 relative z-20 flex justify-center lg:justify-end w-full">
              <div className="w-[290px] sm:w-[310px] bg-white rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-slate-200 overflow-hidden text-gray-900 transform lg:translate-x-4 lg:scale-105 transition-transform">
                {/* Header Bar */}
                <div className="bg-white px-5 pt-6 pb-3 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Menu className="w-5 h-5 text-gray-800" />
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                        1
                      </span>
                    </div>
                    <ImxLogo size="xs" surface="light" href={null} className="max-w-[5.5rem]" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-xs font-extrabold text-gray-800">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <span>1,200 &rsaquo;</span>
                  </div>
                </div>

                {/* App Screen Content */}
                <div className="p-5 bg-slate-50 space-y-4">
                  <h3 className="text-base font-black text-gray-900">Hello, Michael !</h3>

                  {/* Horizontal Scroll / Feature Card */}
                  <div className="relative">
                    <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-1">
                      {/* Card 1: Pink/Orange Gradient */}
                      <div className="w-[85%] shrink-0 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 p-5 text-white shadow-md">
                        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                          <Bell className="w-3.5 h-3.5 text-white" />
                        </div>
                        <h4 className="text-sm font-black mb-1">Research survey</h4>
                        <p className="text-[11px] text-white/95 font-medium mb-4 leading-tight">
                          Earn points for taking this research survey
                        </p>
                        <button
                          type="button"
                          className="px-4 py-1.5 rounded-full border border-white text-[11px] font-black text-white hover:bg-white/20 transition backdrop-blur-sm"
                        >
                          Start now
                        </button>
                      </div>

                      {/* Card 2 Peek */}
                      <div className="w-[15%] shrink-0 rounded-2xl bg-brand-primary p-4 text-white opacity-80" />
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      <span className="w-2 h-2 rounded-full bg-brand-primary" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    </div>
                  </div>

                  {/* Daily Questions Photo Card */}
                  <div className="relative rounded-2xl overflow-hidden shadow-md h-32 border border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&q=80"
                      alt="Daily questions"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 text-white">
                      <h4 className="text-sm font-black tracking-tight">Daily questions</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trustpilot Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm font-bold text-gray-800">
            <span className="font-black text-gray-900 text-base">Excellent</span>
            <div className="flex items-center gap-1 bg-[#00b67a] text-white px-2.5 py-1 rounded">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
              ))}
            </div>
            <span className="underline decoration-slate-300 font-semibold text-gray-600">
              117,871 reviews on
            </span>
            <span className="font-black text-gray-900 text-base flex items-center gap-1">
              ★ Trustpilot
            </span>
          </div>

          {/* Mobile Responsive Avatars Grid (Displays on small screens) */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 flex-wrap mt-10">
            {floatingAvatars.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-gray-700"
              >
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
