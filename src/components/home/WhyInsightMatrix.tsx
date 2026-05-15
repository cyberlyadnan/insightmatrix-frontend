import { Users, BarChart3, Cpu, Award } from "lucide-react";

const features = [
  {
    title: "Real People",
    description:
      "Highly engaged panel members share true reflections of their realities — opinions, behavior & lived experiences you can act on.",
    icon: Users,
    accentColor: "from-brand-primary to-brand-accent2",
    bgAccent: "bg-brand-subtle",
    borderAccent: "border-brand-light",
    iconBg: "bg-brand-light",
    iconColor: "text-brand-primary",
    visual: "avatars",
  },
  {
    title: "Accurate Data",
    description:
      "Real data you can trust with full confidence — guiding impactful strategic action with zero noise or distortion.",
    icon: BarChart3,
    accentColor: "from-violet-500 to-purple-600",
    bgAccent: "bg-violet-50",
    borderAccent: "border-violet-100",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    visual: "bars",
  },
  {
    title: "Pioneering Tech & AI",
    description:
      "Always-on, powerful technology that augments real data from real people — delivering insights in true real time.",
    icon: Cpu,
    accentColor: "from-sky-500 to-cyan-500",
    bgAccent: "bg-sky-50",
    borderAccent: "border-sky-100",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    visual: "tech",
  },
  {
    title: "Award-Winning Experts",
    description:
      "Remarkable research experts who tailor data delivery and insights to your organization's unique strategic needs.",
    icon: Award,
    accentColor: "from-amber-500 to-orange-500",
    bgAccent: "bg-amber-50",
    borderAccent: "border-amber-100",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    visual: "awards",
  },
];

function AvatarVisual() {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {[11, 12, 13, 14, 15, 16, 17].map((i) => (
        <img
          key={i}
          src={`https://i.pravatar.cc/100?img=${i}`}
          alt="panel member"
          className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
        />
      ))}
      <div className="w-9 h-9 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center shadow-sm border-2 border-white">
        2M+
      </div>
    </div>
  );
}

function BarsVisual() {
  const bars = [65, 40, 80, 55, 90, 45, 70, 60, 85, 50, 75, 35];
  const colors = ["bg-brand-primary", "bg-brand-accent2", "bg-sky-400", "bg-brand-accent1"];
  return (
    <div className="flex items-end gap-1 h-12">
      {bars.map((h, i) => (
        <div
          key={i}
          style={{ height: `${h}%` }}
          className={`flex-1 rounded-sm ${colors[i % colors.length]} opacity-80`}
        />
      ))}
    </div>
  );
}

function TechVisual() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-white/80 border border-sky-100 rounded-full px-3 py-1.5 shadow-sm text-xs font-bold text-sky-700">
        <Cpu className="w-3.5 h-3.5" />
        AI-Powered
      </div>
      <div className="flex items-center gap-2 bg-white/80 border border-sky-100 rounded-full px-3 py-1.5 shadow-sm text-xs font-bold text-sky-700">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Real-Time
      </div>
    </div>
  );
}

function AwardsVisual() {
  return (
    <div className="flex items-center gap-2">
      {[18, 19, 20].map((i) => (
        <img
          key={i}
          src={`https://i.pravatar.cc/100?img=${i}`}
          alt="expert"
          className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
        />
      ))}
      <div className="ml-1 flex flex-col">
        <div className="flex text-amber-400 text-xs">{"★★★★★"}</div>
        <p className="text-[10px] font-bold text-gray-500 leading-tight">Top Rated Experts</p>
      </div>
    </div>
  );
}

function FeatureVisual({ type }: { type: string }) {
  if (type === "avatars") return <AvatarVisual />;
  if (type === "bars") return <BarsVisual />;
  if (type === "tech") return <TechVisual />;
  return <AwardsVisual />;
}

export default function WhyInsightMatrix() {
  return (
    <section className="py-24 bg-[#f8f7fc] relative overflow-hidden">
      {/* Subtle top gradient wash */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-accent1 via-brand-primary to-brand-accent2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-5 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent1">
            Why InsightMatrix
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Get access to <span className="font-semibold text-gray-800">real-world data</span> and
            market research expertise, powered by reality — from{" "}
            <span className="font-semibold text-gray-800">real people</span>, in{" "}
            <span className="font-semibold text-gray-800">real time</span>. Insights that help you
            make better strategic decisions.
          </p>
        </div>

        {/* Grid of Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`group relative rounded-3xl border ${f.borderAccent} bg-white p-8 flex flex-col gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
              >
                {/* Gradient glow blob */}
                <div
                  className={`absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br ${f.accentColor} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity duration-300`}
                />

                {/* Icon + Title */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    <Icon className={`w-6 h-6 ${f.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900">{f.title}</h3>
                </div>

                {/* Description */}
                <p className="text-gray-500 leading-relaxed text-[15px]">{f.description}</p>

                {/* Visual Element */}
                <div className={`mt-auto pt-5 border-t ${f.borderAccent}`}>
                  <FeatureVisual type={f.visual} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-brand-primary to-brand-accent1 p-px shadow-xl shadow-brand-primary/20">
          <div className="rounded-[calc(1.5rem-1px)] bg-white px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-700 font-semibold text-lg text-center sm:text-left">
              Ready to uncover what really matters to your audience?
            </p>
            <a
              href="/register"
              className="shrink-0 inline-flex items-center px-7 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-brand-primary to-brand-accent1 hover:opacity-90 shadow-md shadow-brand-primary/30 transition-all hover:-translate-y-0.5"
            >
              Get Started Free →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
