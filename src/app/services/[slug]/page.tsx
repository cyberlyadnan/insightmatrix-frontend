import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  BarChart3, 
  MessageSquare, 
  Users, 
  PieChart,
  ClipboardList,
  TrendingUp,
  Share2
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { GridVisual } from "@/components/common/HeaderVisuals";

interface ServiceDetail {
  title: string;
  slug: string;
  badge: string;
  description: string;
  longDescription: string;
  icon: any;
  color: string;
  accent: string;
  features: { title: string; desc: string }[];
  stats: { label: string; value: string }[];
  process: { step: string; title: string; desc: string }[];
}

const servicesData: Record<string, ServiceDetail> = {
  "survey-participation": {
    title: "Survey Participation",
    slug: "survey-participation",
    badge: "Consumer Insights",
    description: "Join our global panel and earn rewards by sharing your authentic opinions on products, services, and trends.",
    longDescription: "InsightMatrix provides a premium bridge between your daily experiences and the brands shaping the future. As a participant, you're not just a data point; you're a strategic advisor. Our platform ensures that your time is respected, your privacy is iron-clad, and your compensation is guaranteed.",
    icon: ClipboardList,
    color: "text-pink-600",
    accent: "bg-pink-50",
    features: [
      { title: "Verified Demographics", desc: "Our AI-driven matching system ensures you only see surveys that actually apply to your lifestyle." },
      { title: "Instant Payouts", desc: "No weeks of waiting. Once you hit the minimum threshold, withdraw via PayPal or Gift Cards." },
      { title: "Mobile Excellence", desc: "A world-class app experience that lets you earn while on the move, with zero friction." },
      { title: "Data Anonymity", desc: "Your personal details are never shared. We only provide aggregated insights to our partners." }
    ],
    stats: [
        { label: "Active Members", value: "2.4M" },
        { label: "Daily Surveys", value: "500+" },
        { label: "Avg. Reward", value: "$2.50" }
    ],
    process: [
        { step: "01", title: "Create Profile", desc: "Tell us about yourself so we can find your perfect matches." },
        { step: "02", title: "Get Invited", desc: "Receive instant notifications for high-paying studies." },
        { step: "03", title: "Earn Rewards", desc: "Share your thoughts and watch your balance grow." }
    ]
  },
  "market-research-data-collection": {
    title: "Market Insight Data",
    slug: "market-research-data-collection",
    badge: "Enterprise Data",
    description: "Access our vast, diverse panel to rapidly collect high-quality data for your corporate or independent research projects.",
    longDescription: "High-stakes decisions require high-fidelity data. InsightMatrix offers enterprises the ability to tap into real human reality in real-time. Whether you are testing a new product concept or tracking brand sentiment across 140 countries, our infrastructure delivers accuracy you can bank on.",
    icon: TrendingUp,
    color: "text-violet-600",
    accent: "bg-violet-50",
    features: [
      { title: "Precision Targeting", desc: "Filter by over 500+ demographic points to find your exact niche audience." },
      { title: "Fraud Detection", desc: "Multi-layered verification ensures every response comes from a real, engaged human." },
      { title: "Agile Speed", desc: "From launch to 1,000 completes in as little as 24 hours." },
      { title: "Live Dashboard", desc: "Watch your data populate in real-time with integrated visualization tools." }
    ],
    stats: [
        { label: "Global Reach", value: "140+" },
        { label: "Data Quality", value: "99.9%" },
        { label: "Response Time", value: "< 2hr" }
    ],
    process: [
        { step: "01", title: "Define Audience", desc: "Select your demographics and sample size requirements." },
        { step: "02", title: "Launch Study", desc: "Deploy your survey across our programmatic network." },
        { step: "03", title: "Extract Insights", desc: "Download raw data or use our integrated analytics." }
    ]
  },
  "survey-panel-management": {
    title: "Panel Management",
    slug: "survey-panel-management",
    badge: "Panel Infrastructure",
    description: "Leverage our robust technology infrastructure to build, manage, and engage your own custom research panel.",
    longDescription: "Building a panel is difficult, but managing it for long-term health is even harder. InsightMatrix provides the end-to-end OS for panel owners. From white-labeled registration portals to automated incentive fulfillment and fraud monitoring, we give you the tools to keep your audience engaged and your data accurate.",
    icon: Users,
    color: "text-sky-600",
    accent: "bg-sky-50",
    features: [
      { title: "Custom Branding", desc: "Fully white-labeled experience that keeps your brand front and center for participants." },
      { title: "Health Metrics", desc: "Monitor churn, response rates, and panel fatigue with predictive AI alerts." },
      { title: "Automated Incentives", desc: "Global reward engine supporting cash, cards, and crypto in 100+ local currencies." },
      { title: "Security First", desc: "Bank-level encryption and full double-opt-in workflows for maximum panel trust." }
    ],
    stats: [
        { label: "Partner Panels", value: "850+" },
        { label: "API Uptime", value: "99.99%" },
        { label: "Annual Completes", value: "12M" }
    ],
    process: [
        { step: "01", title: "Onboard Panel", desc: "Migrate your existing users or start fresh with our tools." },
        { step: "02", title: "Set Rules", desc: "Configure reward logic, frequency caps, and quality checks." },
        { step: "03", title: "Engage & Scale", desc: "Run your studies and scale your community sustainably." }
    ]
  },
  "survey-distribution-network": {
    title: "Distribution Network",
    slug: "survey-distribution-network",
    badge: "Programmatic Supply",
    description: "Extend your survey reach beyond traditional boundaries with our programmatic distribution network and API integrations.",
    longDescription: "Reach is the lifeblood of survey research. Our programmatic distribution network connects your studies with thousands of publisher sites, mobile apps, and loyalty programs globally. We don't just find people; we find the *right* people at the exact moment they are ready to engage.",
    icon: Share2,
    color: "text-rose-600",
    accent: "bg-rose-50",
    features: [
      { title: "API-Direct Supply", desc: "Deep integrations with the world's leading panel aggregators and loyalty hubs." },
      { title: "Smart allocation", desc: "Our algorithm automatically routes respondents to the study they are most likely to finish." },
      { title: "Clean Sourcing", desc: "Blocked proxies, device fingerprinting, and behavioral analysis on every entrant." },
      { title: "Global Publishers", desc: "Tap into unique audiences that aren't available on traditional survey sites." }
    ],
    stats: [
        { label: "Supply Partners", value: "2K+" },
        { label: "Daily Entries", value: "1.2M" },
        { label: "Fraud Blocked", value: "15%" }
    ],
    process: [
        { step: "01", title: "Connect API", desc: "Integrate your research platform with our distribution layer." },
        { step: "02", title: "Define Quotas", desc: "Set your target counts and balancing requirements." },
        { step: "03", title: "Stream Traffic", desc: "Watch live respondents flow into your survey ecosystem." }
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData[slug];
  return {
    title: service ? `${service.title} | InsightMatrix` : "Service | InsightMatrix",
    description: service?.description,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = servicesData[slug];

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb & Navigation */}
      <div className="bg-white pt-24 pb-6 border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/services" className="hover:text-brand-primary transition-colors">Services</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900">{service.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-subtle/30 blur-[100px] -z-10" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${service.accent} ${service.color} text-[10px] font-black uppercase tracking-widest mb-8`}>
                        <Icon className="w-3 h-3" /> {service.badge}
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-8">
                        {service.title}
                    </h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10">
                        {service.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/register" className="inline-flex items-center justify-center px-10 py-4 text-base font-black rounded-full text-white bg-brand-primary hover:bg-brand-hover shadow-xl shadow-brand-primary/20 transition-all hover:scale-105">
                            Get Started Now
                        </Link>
                        <Link href="/contact" className="inline-flex items-center justify-center px-10 py-4 text-base font-black rounded-full text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                            Talk to an Expert
                        </Link>
                    </div>
                </div>

                <div className="hidden lg:block">
                     <div className="relative p-10 bg-white border border-gray-100 rounded-[3rem] shadow-2xl">
                         <div className="grid grid-cols-2 gap-6">
                            {service.stats.map((stat, i) => (
                                <div key={i} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 group hover:bg-brand-primary transition-all duration-500">
                                    <div className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2 group-hover:text-white/60">{stat.label}</div>
                                    <div className="text-3xl font-black text-gray-900 group-hover:text-white">{stat.value}</div>
                                </div>
                            ))}
                            <div className="p-6 rounded-3xl bg-gray-900 text-white flex flex-col justify-center">
                                <ShieldCheck className="w-8 h-8 text-brand-primary mb-4" />
                                <div className="text-xs font-bold uppercase tracking-widest opacity-60">Compliance</div>
                                <div className="text-lg font-black leading-tight">ISO 27001 Certified</div>
                            </div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
      </section>

      {/* Deep Dive Content */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 gap-16">
                <div className="lg:col-span-7">
                    <h2 className="text-3xl font-black text-gray-900 mb-8">Transforming opinion into intelligence.</h2>
                    <p className="text-lg text-gray-600 leading-relaxed font-medium mb-12">
                        {service.longDescription}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {service.features.map((feature, i) => (
                            <div key={i} className="group p-8 bg-white border border-gray-100 rounded-3xl hover:shadow-xl transition-all">
                                <div className={`w-12 h-12 rounded-2xl ${service.accent} ${service.color} flex items-center justify-center mb-6`}>
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-black text-gray-900 mb-3">{feature.title}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 lg:col-start-9 mt-20 lg:mt-0">
                    <div className="sticky top-32">
                        <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white overflow-hidden relative">
                             <Zap className="absolute -top-10 -right-10 w-40 h-40 opacity-10 text-brand-primary" />
                             <h3 className="text-2xl font-black mb-6 relative z-10">How it works</h3>
                             <div className="space-y-8 relative z-10">
                                {service.process.map((p, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="text-brand-primary font-black italic">{p.step}</div>
                                        <div>
                                            <div className="text-sm font-black uppercase tracking-widest mb-1">{p.title}</div>
                                            <div className="text-xs text-gray-400 font-medium leading-relaxed">{p.desc}</div>
                                        </div>
                                    </div>
                                ))}
                             </div>
                             <Link href="/register" className="mt-10 w-full inline-flex items-center justify-center py-4 bg-brand-primary rounded-full font-black text-sm hover:bg-brand-hover transition-colors">
                                Start Registration
                             </Link>
                        </div>

                        <div className="mt-8 p-8 border border-gray-100 rounded-[2.5rem] flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Inquiries</div>
                                <div className="text-sm font-bold text-gray-900">talk@insightmatrix.com</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Final Brand CTA */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-brand-subtle rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
                <Globe className="absolute -bottom-20 -left-20 w-80 h-80 opacity-5 text-brand-primary rotate-12" />
                <div className="relative z-10 max-w-2xl mx-auto">
                    <span className="text-xs font-black uppercase tracking-widest text-brand-primary mb-6 inline-block">Global Network</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-8 leading-tight">Connect with a worldwide panel today.</h2>
                    <p className="text-lg text-gray-600 font-medium mb-12">
                        Whether you're a participant or a researcher, our platform offers the infrastructure you need to thrive in the modern insights economy.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                         <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-gray-900 text-white rounded-full font-black text-base hover:bg-black transition-colors shadow-2xl">
                            Unlock Dashboard
                         </Link>
                         <Link href="/contact" className="w-full sm:w-auto px-10 py-5 border-2 border-gray-950 text-gray-950 rounded-full font-black text-base hover:bg-gray-950 hover:text-white transition-all shadow-lg active:scale-95">
                            Schedule a Demo
                         </Link>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
