import Link from "next/link";
import { CheckCircle2, Award, Clock, Shield, Zap, TrendingUp, Sparkles, Star } from "lucide-react";

export default function Benefits() {
  const benefits = [
    { 
      title: "High-Paying Surveys", 
      description: "Our platform partners with top global brands, ensuring competitive compensation for your valuable insights.", 
      icon: Award,
      accent: "text-rose-500",
      bg: "bg-rose-50"
    },
    { 
      title: "Flexible Participation", 
      description: "Complete surveys on any device, anywhere, anytime. Our mobile-first design makes participation seamless.", 
      icon: Clock,
      accent: "text-violet-500",
      bg: "bg-violet-50"
    },
    { 
      title: "Strict Data Privacy", 
      description: "We adhere to GDPR and CCPA standards. Your personal data is anonymized and never shared without consent.", 
      icon: Shield,
      accent: "text-sky-500",
      bg: "bg-sky-50"
    },
    { 
      title: "Instant Payouts", 
      description: "Withdraw your earnings instantly via PayPal, Bank Transfer, or Gift Cards once you reach the threshold.", 
      icon: Zap,
      accent: "text-brand-primary",
      bg: "bg-brand-subtle"
    },
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-subtle/30 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-start">
          
          {/* Left Side: Content */}
          <div className="sticky top-32 ">
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-subtle border border-brand-light text-brand-primary text-xs font-black tracking-widest uppercase">
              The InsightMatrix Advantage
            </span>
            <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
              Why <span className="text-brand-primary">Choose</span> InsightMatrix?
            </h2>
            <p className="text-xl text-gray-500 leading-relaxed font-medium mb-12 max-w-xl">
              We bridge the gap between visionary brands and insightful consumers. Our platform offers a premium experience for both participants and researchers.
            </p>
            
            <div className="relative group ">
               <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-accent1 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
               <div className="relative bg-gray-900 rounded-[2rem] p-10 text-white overflow-hidden">
                  <Sparkles className="absolute -top-10 -right-10 w-40 h-40 opacity-10 text-white" />
                  <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                    <TrendingUp className="text-brand-primary" />
                    Maximize your earnings
                  </h3>
                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">Join our specialized expert panels to receive high-relevance surveys matched to your professional background.</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    {[
                      "IT & Tech", "Healthcare", "Finance", "Education"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm font-bold text-gray-300">
                         <Star className="w-4 h-4 text-brand-primary fill-current" />
                         {item}
                      </div>
                    ))}
                  </div>

                  <Link href="/register" className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-lg font-black text-gray-900 hover:bg-gray-100 transition-all hover:scale-105 shadow-xl shadow-black/20">
                    Join Expert Panel
                  </Link>
               </div>
            </div>
          </div>

          {/* Right Side: Benefits Grid */}
          <div className="mt-20 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index} 
                  className={`group p-10 ${index === 0 ? 'mt-16':''} rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden ${index % 2 === 1 ? 'lg:translate-y-12' : ''}`}
                >
                  {/* Hover Accent Blob */}
                  <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full ${benefit.bg} opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-700`} />

                  <div className={`w-16 h-16 rounded-2xl ${benefit.bg} ${benefit.accent} flex items-center justify-center mb-8 shadow-sm transition-transform duration-500 group-hover:rotate-12`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-500 text-lg leading-relaxed font-medium">
                    {benefit.description}
                  </p>
                  
                  <div className="mt-8 flex items-center gap-2 text-xs font-black text-brand-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Reliable <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
