import { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Target,
  Lightbulb,
  Users,
  Globe,
  ShieldCheck,
  Zap,
  BookOpen,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { FloatingTagsVisual } from "@/components/shared/HeaderVisuals";
import { ROUTES } from "@/constants/routes";
import { ABOUT_CONTENT } from "@/constants/site-content";

export const metadata: Metadata = {
  title: "About Us | InsightMatrix",
  description:
    "Learn more about InsightMatrix, our mission, vision, and how we are transforming the survey research industry.",
};

export default function AboutPage() {
  const visualTags = [
    { text: "Niche Demographics", color: "bg-brand-primary" },
    { text: "Accuracy", color: "bg-brand-primary" },
    { text: "Scalability", color: "bg-brand-accent2" },
    { text: "Global Coverage", color: "bg-violet-600" },
    { text: "AI Verified", color: "bg-teal-600" },
    { text: "Real People", color: "bg-brand-accent1" },
  ];

  return (
    <div className="bg-white">
      <PageHeader
        badge={ABOUT_CONTENT.header.badge}
        title={ABOUT_CONTENT.header.title}
        description={ABOUT_CONTENT.header.description}
        buttonText="Talk to experts"
        buttonHref="/contact"
        visual={
          <FloatingTagsVisual
            imageSrc="https://i.pravatar.cc/300?img=26"
            tags={visualTags}
            badgeText="Insight Reality"
          />
        }
      />

      {/* Mission & Vision Section */}
      <div className="py-24 sm:py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            <div className="group">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-brand-subtle flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="ml-5 text-3xl font-extrabold tracking-tight text-gray-900">
                  Our Mission
                </h3>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed p-10 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/40 relative">
                <span className="absolute top-4 left-6 text-6xl font-serif text-brand-primary/10">{`"`}</span>
                {ABOUT_CONTENT.mission}
              </p>
            </div>
            <div className="group">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-brand-subtle flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  <Lightbulb className="h-8 w-8" />
                </div>
                <h3 className="ml-5 text-3xl font-extrabold tracking-tight text-gray-900">
                  Our Vision
                </h3>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed p-10 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/40 relative">
                <span className="absolute top-4 left-6 text-6xl font-serif text-brand-primary/10">{`"`}</span>
                {ABOUT_CONTENT.vision}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values / Features */}
      <div className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto lg:text-center mb-20">
            <h2 className="text-base font-bold leading-7 text-brand-primary uppercase tracking-widest">
              Our Engineering
            </h2>
            <p className="mt-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
              Setting higher standards than the industry norm
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Community First",
                desc: "Fair member rewards and a global community across all demographics.",
                icon: Users,
              },
              {
                title: "Global Coverage",
                desc: "Proprietary panels in 120+ countries for truly representative research.",
                icon: Globe,
              },
              {
                title: "Privacy Verified",
                desc: "Data protection standards that go beyond GDPR and CCPA requirements.",
                icon: ShieldCheck,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="bg-brand-subtle w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-brand-primary">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-extrabold text-gray-900 mb-4">{feature.title}</h4>
                <p className="text-gray-500 text-lg leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel Book — B2B resource */}
      <div className="border-y border-gray-100 bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-gray-600">
                <BookOpen className="h-3.5 w-3.5 text-brand-primary" aria-hidden />
                Why InsightMatrix
              </div>
              <h2 className="mt-6 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Panel Book — global reach, verified people
              </h2>
              <p className="mt-6 text-lg font-medium leading-relaxed text-gray-600 sm:text-xl">
                InsightMatrix is built for teams who need confident decisions at scale: high-quality
                data from real, verified participants, with a multi-layered approach to
                quality—panel design, expert oversight, and modern fraud detection—so your research
                stays accurate, reliable, and trusted.
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                Request the InsightMatrix Panel Book to learn more about our methodology, geographic
                footprint, respondent profiling, and how we support brands, agencies, and
                publishers.
              </p>
              <Link
                href={ROUTES.panelBook}
                className="mt-10 inline-flex h-12 items-center justify-center rounded-xl bg-gray-900 px-8 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-black"
              >
                Get the Panel Book
              </Link>
            </div>
            <div className="relative rounded-[2rem] border border-gray-100 bg-gray-50/80 p-10 shadow-inner sm:p-12">
              <div
                className="absolute -right-6 -top-6 hidden h-24 w-24 rounded-3xl bg-brand-primary/15 blur-2xl lg:block"
                aria-hidden
              />
              <ul className="relative space-y-5 text-gray-700">
                {[
                  "Overview of our panel philosophy and coverage",
                  "Profiling dimensions and sample design considerations",
                  "Quality, compliance, and how we protect participants",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-base font-semibold leading-snug">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto lg:text-center mb-20">
            <h2 className="text-base font-bold leading-7 text-brand-primary uppercase tracking-widest">
              Our Leadership
            </h2>
            <p className="mt-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
              Meet the minds behind the matrix
            </p>
            <p className="mt-6 text-xl leading-relaxed text-gray-600">
              Our team consists of industry veterans from data science, market research, and
              software engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Sarah Jenkins",
                role: "Head of Research",
                img: "https://i.pravatar.cc/300?img=47",
                bio: "15+ years leading global consumer insights.",
              },
              {
                name: "David Chen",
                role: "Lead Data Scientist",
                img: "https://i.pravatar.cc/300?img=11",
                bio: "Pioneer in predictive behavioral modeling.",
              },
              {
                name: "Elena Rodriguez",
                role: "Panel Operations",
                img: "https://i.pravatar.cc/300?img=5",
                bio: "Expert in community building and reward systems.",
              },
              {
                name: "Marcus Thorne",
                role: "VP of Engineering",
                img: "https://i.pravatar.cc/300?img=33",
                bio: "Architected scalable systems for Fortune 500s.",
              },
            ].map((member, i) => (
              <div key={i} className="group flex flex-col items-center text-center">
                <div className="relative mb-6 overflow-hidden rounded-[2.5rem] w-full aspect-square">
                  <div className="absolute inset-0 bg-brand-primary mix-blend-multiply opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-10" />
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-4">
                  {member.role}
                </p>
                <p className="text-gray-500 leading-relaxed font-medium">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats / Proof Section */}
      <div className="bg-gray-900 py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight sm:text-5xl mb-8">
                Why industry leaders <span className="text-brand-primary">trust us</span>
              </h2>
              <div className="space-y-6">
                {[
                  "ACE Methodology for higher data quality",
                  "MRP Predictive Modelling for forecasting",
                  "Automated bot checks with advanced AI",
                  "High-frequency data collection for rapid insights",
                  "Niche demographics & representative samples",
                ].map((item, i) => (
                  <div key={i} className="flex items-center text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center mr-4">
                      <CheckCircle2 className="h-4 w-4 text-brand-primary" />
                    </div>
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-16 lg:mt-0 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-accent1 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary/10 text-brand-primary mb-6">
                  <Zap className="w-10 h-10" />
                </div>
                <p className="text-6xl font-black text-white mb-4">99.9%</p>
                <p className="text-2xl font-bold text-gray-200">Accuracy Standard</p>
                <div className="mt-8 flex justify-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <img
                        key={i}
                        src={`https://i.pravatar.cc/100?img=${i + 40}`}
                        className="w-8 h-8 rounded-full border-2 border-gray-900"
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 font-bold">Trusted by 2M+ experts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
