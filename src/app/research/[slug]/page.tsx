"use client";

import { useParams, notFound } from "next/navigation";
import { caseStudies } from "@/lib/data-research";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Calendar, User, CheckCircle2, Quote, ArrowRight, Share2, Printer, TrendingUp, Target, Zap, PieChart, LineChart, BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, any> = {
  TrendingUp,
  Target,
  Zap,
  PieChart,
  LineChart,
  BarChart3
};

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const study = caseStudies.find((s) => s.slug === slug);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!study) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen w-full">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-brand-primary z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Immersive Hero Header */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden bg-gray-950 w-full">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={study.image} 
            alt={study.title} 
            className="w-full h-full object-cover opacity-40 scale-105 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/60 to-gray-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-transparent to-transparent" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-violet-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Breadcrumbs */}
              <nav className="flex flex-wrap items-center gap-y-2 gap-x-3 mb-10">
                <Link href="/" className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Home</Link>
                <ChevronRight size={10} className="text-white/20" />
                <Link href="/research" className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Research</Link>
                <ChevronRight size={10} className="text-white/20" />
                <span className="text-brand-primary text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{study.category}</span>
              </nav>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest mb-8 shadow-2xl"
              >
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                In-Depth Methodology
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tighter break-words overflow-hidden">
                {study.title}
              </h1>

              <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-xl mb-12">
                {study.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-8 text-white/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Client</div>
                    <div className="text-sm font-bold text-white tracking-tight">{study.client}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Timeline</div>
                    <div className="text-sm font-bold text-white tracking-tight">{study.duration}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative lg:block hidden"
            >
              <div className="grid grid-cols-2 gap-4">
                {study.results.map((result, i) => {
                  const Icon = iconMap[result.iconName] || Zap;
                  return (
                    <div 
                      key={i} 
                      className={`p-8 rounded-[2.5rem] ${i === 2 ? 'col-span-2' : ''} bg-white/5 border border-white/10 backdrop-blur-2xl hover:bg-white/10 transition-colors group`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform">
                        <Icon size={24} />
                      </div>
                      <div className="text-4xl font-black text-white mb-2 tracking-tighter">{result.value}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{result.label}</div>
                    </div>
                  );
                })}
              </div>
              {/* Decorative Blur */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-primary/20 blur-[100px] rounded-full" />
            </motion.div>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.2em]">Scroll</div>
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Main Story */}
          <div className="lg:col-span-8">
            <article className="prose prose-lg sm:prose-xl max-w-none">
              <section className="mb-24">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-px bg-brand-primary" />
                   <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest">01. The Challenge</h2>
                </div>
                <p className="text-gray-600 text-xl font-medium leading-relaxed mb-12">
                  {study.challenge}
                </p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-[2rem] lg:rounded-[3rem] p-6 sm:p-10 lg:p-14 relative overflow-hidden border border-gray-100"
                >
                  <Quote className="absolute -top-6 -right-6 text-gray-200/50 w-32 h-32 lg:w-48 lg:h-48 -z-0" />
                  <div className="relative z-10">
                    <p className="text-gray-800 font-black text-2xl lg:text-3xl leading-tight mb-10 tracking-tight">
                      "The level of granularity InsightMatrix provides is industry-shifting. We didn't just see the data; we saw the future of our market."
                    </p>
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                          <Building2 size={24} />
                       </div>
                       <div>
                          <div className="text-sm font-black text-gray-900">VP of Strategic Operations</div>
                          <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{study.client}</div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              <section className="mb-24">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-px bg-violet-500" />
                   <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest">02. Our Strategy</h2>
                </div>
                <p className="text-gray-600 text-xl font-medium leading-relaxed mb-8">
                  {study.solution}
                </p>
                <div className="grid sm:grid-cols-2 gap-6 my-12">
                   {[
                     { title: "Rapid Deployment", desc: "Global data collection in under 48 hours." },
                     { title: "Identity Verification", desc: "Proprietary AI filters for 100% real human input." }
                   ].map((feature, i) => (
                     <div key={i} className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <CheckCircle2 className="text-brand-primary mb-4" />
                        <h4 className="font-black text-gray-900 mb-2 break-words">{feature.title}</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                     </div>
                   ))}
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {study.fullStory}
                </p>
              </section>
            </article>

            {/* Content Footer */}
            <div className="pt-16 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Share Research</span>
                  <div className="flex gap-2">
                     {[Share2, Printer].map((Icon, i) => (
                       <button key={i} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors">
                          <Icon size={16} />
                       </button>
                     ))}
                  </div>
               </div>
               <Link href="/research" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gray-900 text-white font-black text-sm hover:bg-black transition-all group">
                  Discover more studies <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
               </Link>
            </div>
          </div>

          {/* Detailed Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              {/* Impact Card */}
              <div className="p-6 sm:p-8 pb-10 rounded-[2.5rem] lg:rounded-[3rem] bg-gray-900 text-white shadow-2xl shadow-gray-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-[60px]" />
                <h3 className="text-xl font-black mb-8 border-b border-white/5 pb-6">Engagement Impact</h3>
                <div className="space-y-10">
                   {study.results.map((res, i) => (
                     <div key={i}>
                        <div className="flex justify-between items-end mb-3">
                           <span className="text-xs font-black uppercase tracking-widest text-gray-400">{res.label}</span>
                           <span className="text-xl font-black">{res.value}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: '85%' }}
                             viewport={{ once: true }}
                             className="h-full bg-brand-primary" 
                           />
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              {/* Research Protocol Card */}
              <div className="p-6 sm:p-10 rounded-[2.5rem] lg:rounded-[3rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/40">
                <h3 className="text-xl font-black text-gray-900 mb-8">Metadata</h3>
                <div className="space-y-6">
                    {[
                      { label: "Category", value: study.category, icon: Tag },
                      { label: "Method", value: "Multi-Source Panel", icon: Users },
                      { label: "Confidence", value: "99.2%", icon: ShieldCheck }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-wrap items-center justify-between gap-4 group">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-brand-primary transition-colors shrink-0">
                               <item.icon size={16} />
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                         </div>
                         <span className="text-sm font-bold text-gray-800 break-words">{item.value}</span>
                      </div>
                    ))}
                </div>
                
                <Link 
                  href="/contact"
                  className="mt-12 w-full py-5 bg-brand-primary hover:bg-brand-hover text-white font-black rounded-2xl transition-all shadow-xl shadow-brand-primary/30 flex items-center justify-center gap-2"
                >
                   Partner on a Study
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Recommended Section */}
      <section className="bg-gray-50 py-32 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-16">
               <h2 className="text-4xl font-black text-gray-900">Recommended for you</h2>
               <Link href="/research" className="text-sm font-black text-brand-primary hover:underline uppercase tracking-widest">Library</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {caseStudies.filter(s => s.slug !== slug).map((s, idx) => (
                 <Link key={idx} href={`/research/${s.slug}`} className="group bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-xl transition-all">
                    <div className="aspect-video rounded-2xl overflow-hidden mb-6">
                       <img src={s.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                    </div>
                    <div className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-3">{s.category}</div>
                    <h4 className="text-lg font-black text-gray-900 leading-tight group-hover:text-brand-primary transition-colors">{s.title}</h4>
                 </Link>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}

// Add missing icon for the metadata section
import { Building2, Clock, Tag, Users, ShieldCheck } from "lucide-react";
