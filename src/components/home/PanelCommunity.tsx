import Link from "next/link";
import { Star, Bell, ChevronRight, Users, TrendingUp, Shield } from "lucide-react";
import { ImxLogo } from "@/components/brand";

const floatingAvatars = [
  { img: 11, label: "/spending habits", pos: { top: "5%", left: "2%" } },
  { img: 12, label: "/social behaviour", pos: { top: "26%", left: "-1%" } },
  { img: 13, label: "/brands loved", pos: { top: "50%", left: "2%" } },
  { img: 14, label: "/stream gaming", pos: { top: "72%", left: "-1%" } },
  { img: 15, label: "/browsing history", pos: { top: "90%", left: "3%" } },
  { img: 16, label: "/amazon shopping", pos: { top: "5%", right: "2%" } },
  { img: 17, label: "/brand surveys", pos: { top: "26%", right: "-1%" } },
  { img: 18, label: "/netflix history", pos: { top: "50%", right: "2%" } },
  { img: 19, label: "/gaming history", pos: { top: "72%", right: "-1%" } },
  { img: 20, label: "/banking txns", pos: { top: "90%", right: "3%" } },
];

export default function PanelCommunity() {
  return (
    <section className="relative py-32 bg-white overflow-hidden">
      {/* Background gradient wash */}
      <div className="absolute inset-x-0 top-0 h-[700px] bg-gradient-to-b from-brand-subtle/80 via-sky-50/40 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[600px] rounded-full bg-gradient-to-r from-brand-light/40 via-sky-100/50 to-brand-subtle blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-subtle border border-brand-light text-brand-primary text-sm font-bold tracking-wide uppercase">
            Our Community
          </span>
          <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent1">
            Engaged panelists
            <br className="hidden sm:block" /> share their realities
          </h2>
          <p className="text-gray-500 text-xl leading-relaxed">
            At the heart of InsightMatrix is a global online community of responsive panel members,
            across all demographics, sharing their opinions, behaviour and lived reality.
          </p>
        </div>

        {/* ── Main Visual Area ── */}
        <div className="relative min-h-[680px] flex items-center justify-center">
          {/* Floating avatars — desktop only */}
          {floatingAvatars.map((av, i) => (
            <div
              key={i}
              className="absolute hidden xl:flex flex-col items-center gap-1.5 z-10"
              style={{
                top: av.pos.top,
                ...(av.pos.left != null ? { left: av.pos.left } : {}),
                ...(av.pos.right != null ? { right: av.pos.right } : {}),
              }}
            >
              <img
                src={`https://i.pravatar.cc/100?img=${av.img}`}
                alt="panelist"
                className="w-16 h-16 rounded-full border-4 border-white shadow-xl object-cover"
              />
              <span className="text-[11px] font-bold text-gray-500 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full shadow-md border border-gray-100 whitespace-nowrap">
                {av.label}
              </span>
            </div>
          ))}

          {/* Central content */}
          <div className="flex flex-col lg:flex-row items-stretch gap-8 w-full xl:w-[72%] z-20">
            {/* Left dark card */}
            <div className="flex-1 rounded-3xl bg-gradient-to-br from-gray-900 via-[#1a1040] to-gray-900 p-10 flex flex-col justify-between gap-10 shadow-2xl shadow-gray-900/40 min-h-[480px]">
              {/* Top decorative glow */}
              <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-brand-primary/20 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              <div className="relative">
                {/* Quote marks */}
                <div className="text-6xl font-serif text-brand-primary/30 leading-none mb-2">{`"`}</div>
                <p className="text-3xl font-extrabold text-white leading-snug mb-5">
                  The best survey
                  <br />
                  platform ever
                </p>
                <p className="text-gray-400 text-base leading-relaxed">
                  Our 2 million members say surveys are interesting, the platform is beautifully
                  easy to use, they love the rewards &amp; genuinely enjoy seeing their opinions
                  shape real products and decisions around the world.
                </p>
              </div>

              {/* Stats row */}
              <div className="relative grid grid-cols-3 gap-4 py-6 border-t border-white/10">
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-white">2M+</p>
                  <p className="text-gray-500 text-xs font-semibold mt-1">Active Members</p>
                </div>
                <div className="text-center border-x border-white/10">
                  <p className="text-3xl font-extrabold text-white">120+</p>
                  <p className="text-gray-500 text-xs font-semibold mt-1">Countries</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-white">$15M</p>
                  <p className="text-gray-500 text-xs font-semibold mt-1">Rewards Paid</p>
                </div>
              </div>

              <div className="relative flex flex-col gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 font-bold text-base hover:bg-gray-100 transition shadow-lg w-full sm:w-auto text-center"
                >
                  <Users className="w-5 h-5" />
                  Join the community
                </Link>
                {/* Trustpilot */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-xs font-semibold">Excellent</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-green-400 text-green-400" />
                    ))}
                  </div>
                  <span className="text-gray-500 text-xs">100k+ reviews on Trustpilot</span>
                </div>
              </div>
            </div>

            {/* Right phone mockup — enlarged */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-[240px] sm:w-[270px]">
                {/* Glow behind phone */}
                <div className="absolute inset-0 scale-110 rounded-[3rem] bg-gradient-to-br from-brand-primary/30 to-brand-accent1/20 blur-2xl" />

                <div className="relative rounded-[3rem] border-[10px] border-gray-800 bg-gray-900 shadow-2xl shadow-gray-900/60 overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-gray-800 rounded-full z-10" />

                  {/* Screen */}
                  <div className="bg-[#f5f5f7] min-h-[500px] flex flex-col">
                    {/* App top bar */}
                    <div className="bg-white px-4 pt-10 pb-3 flex items-center justify-between shadow-sm">
                      <ImxLogo size="xs" surface="light" href={null} className="max-w-[5.5rem]" />
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        <Users className="w-2.5 h-2.5" /> 2,400 &rsaquo;
                      </div>
                    </div>

                    <div className="px-4 py-4 flex flex-col gap-3.5">
                      <p className="text-sm font-bold text-gray-800">Hello, Alex! 👋</p>

                      {/* Active survey card */}
                      <div className="rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent1 p-4 text-white shadow-lg shadow-brand-primary/30">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Bell className="w-3.5 h-3.5 opacity-90" />
                          <span className="text-[11px] font-bold opacity-90">Research Survey</span>
                        </div>
                        <p className="text-[12px] font-semibold leading-tight mb-3 opacity-90">
                          Earn points for taking this research survey.
                        </p>
                        <button className="bg-white/20 border border-white/30 rounded-full px-4 py-1.5 text-[11px] font-bold backdrop-blur-sm flex items-center gap-1">
                          Start now <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Stat cards */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-white rounded-2xl p-3 shadow-sm">
                          <div className="flex items-center gap-1 mb-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <p className="text-[9px] text-gray-400 font-semibold">Points Earned</p>
                          </div>
                          <p className="text-lg font-extrabold text-gray-900 leading-none">1,240</p>
                          <p className="text-[9px] text-green-500 font-bold mt-1">+120 this week</p>
                        </div>
                        <div className="bg-white rounded-2xl p-3 shadow-sm">
                          <div className="flex items-center gap-1 mb-1">
                            <Shield className="w-3 h-3 text-brand-primary" />
                            <p className="text-[9px] text-gray-400 font-semibold">Surveys Done</p>
                          </div>
                          <p className="text-lg font-extrabold text-gray-900 leading-none">34</p>
                          <p className="text-[9px] text-brand-primary font-bold mt-1">Top 5%</p>
                        </div>
                      </div>

                      {/* Daily question photo card */}
                      <div className="relative rounded-2xl overflow-hidden h-28 shadow-md">
                        <img
                          src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80"
                          alt="Daily questions"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent" />
                        <span className="absolute bottom-2.5 left-3 text-[11px] font-extrabold text-white z-10">
                          Daily questions
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile avatar strip */}
        <div className="flex xl:hidden items-center justify-center gap-3 flex-wrap mt-14">
          {[11, 12, 13, 14, 15, 16, 17, 18].map((i) => (
            <img
              key={i}
              src={`https://i.pravatar.cc/80?img=${i}`}
              alt="panelist"
              className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
            />
          ))}
          <div className="w-12 h-12 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center shadow-md border-2 border-white">
            2M+
          </div>
        </div>
      </div>
    </section>
  );
}
