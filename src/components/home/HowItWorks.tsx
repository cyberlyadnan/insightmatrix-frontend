import { ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Register & Profile",
      description:
        "Create your free account and complete your demographic profile to get matched with the most relevant studies.",
      image:
        "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop",
      color: "bg-brand-subtle",
      accent: "from-brand-primary/20 to-brand-accent2/20",
    },
    {
      title: "Participate in Studies",
      description:
        "Receive invitations to high-quality market research studies, exclusive product tests, and insightful opinion polls.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
      color: "bg-violet-100",
      accent: "from-violet-500/20 to-purple-500/20",
    },
    {
      title: "Earn Rewards",
      description:
        "Get compensated for your time and insights. Redeem points for cash, premium gift cards, or local charitable donations.",
      image:
        "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?q=80&w=800&auto=format&fit=crop",
      color: "bg-sky-100",
      accent: "from-sky-500/20 to-cyan-500/20",
    },
  ];

  return (
    <section className="py-32 bg-[#fafafa] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-subtle rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-subtle rounded-full blur-[120px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-subtle border border-brand-light text-brand-primary text-sm font-bold tracking-widest uppercase">
            Simple Process
          </span>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight text-gray-900">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent1">
              InsightMatrix
            </span>{" "}
            Works
          </h2>
          <p className="text-gray-500 text-xl leading-relaxed font-medium">
            Join millions of users worldwide and start earning in three simple, transparent steps.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[40%] left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => {
              return (
                <div key={index} className="group flex flex-col items-center text-center">
                  {/* Step Image Container */}
                  <div className="relative mb-10 w-full max-w-[280px]">
                    {/* Number Badge */}
                    <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-white shadow-2xl flex items-center justify-center text-gray-900 font-extrabold text-lg z-20 border border-gray-100 transition-transform group-hover:scale-110">
                      {index + 1}
                    </div>

                    {/* Image Circle/Frame */}
                    <div
                      className={`relative aspect-square rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl transition-all duration-500 group-hover:shadow-brand-primary/20 group-hover:-translate-y-2`}
                    >
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Gradient Overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />
                    </div>

                    {/* Decorative accent behind image */}
                    <div
                      className={`absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-br ${step.accent} blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 transform scale-90 group-hover:scale-105`}
                    />
                  </div>

                  {/* Text Content */}
                  <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight group-hover:text-brand-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-lg leading-relaxed font-medium mb-6 px-4">
                    {step.description}
                  </p>

                  <div className="mt-auto">
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-20 flex justify-center">
          <button className="bg-gray-900 text-white px-10 py-4 rounded-full font-black text-lg hover:bg-gray-800 shadow-2xl transition-all hover:scale-105 flex items-center gap-3">
            Register for Free <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
