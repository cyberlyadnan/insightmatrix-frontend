import Link from "next/link";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-[#596cc6] via-[#d74c86] to-[#f67b5f] overflow-hidden">
      {/* Abstract Background Shapes to add texture */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-accent1/20 blur-3xl mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pt-40 pb-16 md:pt-20 md:pb-24 lg:pt-28 lg:pb-32 flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/20 shadow-sm text-white mb-8 mt-4 lg:mt-0">
              <span className="flex h-2.5 w-2.5 rounded-full bg-green-400 mr-2 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
              Join 2M+ Creators & Brands
            </div> */}
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
              Connect. <br className="hidden lg:block"/>
              Collaborate. <br className="hidden lg:block"/>
              Influence.
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium drop-shadow-sm">
              The premier social platform bridging the gap between innovative brands and insightful creators. Share your voice, test new products, and get rewarded.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-brand-primary bg-white hover:bg-gray-50 shadow-xl shadow-black/10 transition-all hover:-translate-y-0.5"
              >
                Start Collaborating
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-white bg-transparent border border-white/30 hover:bg-white/10 transition-all"
              >
                Explore Platform
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[rgba(215,76,134,1)] object-cover"
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="User avatar"
                  />
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center text-yellow-300 mb-0.5 drop-shadow-sm">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm font-semibold text-white/90 drop-shadow-sm">Rated 4.9/5 by our community</p>
              </div>
            </div>
          </div>

          {/* Right Visuals - Social Media Collab Vibe */}
          <div className="flex-1 relative w-full w-max-md lg:w-auto">
            <div className="relative w-full aspect-[4/3] lg:aspect-square flex items-center justify-center">
              {/* Main Floating Card */}
              <div className="absolute w-full max-w-[340px] bg-white rounded-3xl shadow-2xl shadow-black/20 border border-white/40 p-6 z-20 transition-transform hover:scale-105 duration-300 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/100?img=5" alt="Brand" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">NextGen Tech UX</h4>
                      <p className="text-xs font-bold text-brand-primary bg-brand-subtle inline-block px-2 py-0.5 rounded-full mt-1">Collab Request</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">$50</span>
                </div>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed font-medium">
                  We are looking for product enthusiasts to test our new interface and provide detailed feedback.
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex -space-x-2">
                    {[1,2,3].map((i) => (
                      <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} className="w-8 h-8 rounded-full border-2 border-white" alt="avatar" />
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">+12</div>
                  </div>
                  <button className="text-sm font-bold text-white bg-brand-primary px-5 py-2.5 rounded-full hover:bg-brand-hover transition shadow-md shadow-brand-primary/30">
                    Accept
                  </button>
                </div>
              </div>

              {/* Smaller floating elements */}
              <div className="absolute top-[5%] md:top-[10%] right-[3%] lg:-right-[5%] bg-white p-3 rounded-2xl shadow-xl shadow-black/10 border border-white/50 flex items-center gap-3 z-30 animate-[bounce_6s_infinite]">
                 <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">
                   <ShieldCheck className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 font-bold">Verified</p>
                   <p className="text-sm font-black text-gray-900">100% Secure</p>
                 </div>
              </div>

              <div className="absolute bottom-[5%] md:bottom-[10%] left-[3%] lg:-left-[10%] bg-white p-4 rounded-2xl shadow-xl shadow-black/10 border border-white/50 z-30 animate-[bounce_5s_infinite_100ms]">
                <div className="flex items-center gap-3">
                   <img src="https://i.pravatar.cc/100?img=3" alt="avatar" className="w-10 h-10 rounded-full object-cover"/>
                   <div>
                     <p className="text-sm font-black text-gray-900">Sarah J.</p>
                     <p className="text-xs font-bold text-green-600">Earned $120 today</p>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
