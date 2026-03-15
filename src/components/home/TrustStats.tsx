import { Users, DollarSign, Globe2, Star } from "lucide-react";

export default function TrustStats() {
  const stats = [
    { 
      label: "Registered Users", 
      value: "2.4M+", 
      icon: Users,
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
    { 
      label: "Rewards Paid Out", 
      value: "$18.5M+", 
      icon: DollarSign,
      color: "text-brand-primary",
      bg: "bg-brand-primary/10"
    },
    { 
      label: "Global Reach", 
      value: "140+", 
      icon: Globe2,
      color: "text-violet-500",
      bg: "bg-violet-500/10"
    },
    { 
      label: "Trustpilot Rating", 
      value: "4.9/5", 
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
  ];

  return (
    <section className="py-24 bg-gray-900 border-y border-white/5 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 hover:-translate-y-2">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tighter mb-3">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-brand-primary transition-colors">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
