"use client";

import { motion } from "framer-motion";
import { CaseStudy } from "@/lib/data-research";
import Link from "next/link";
import { ArrowRight, Clock, Building2, Tag } from "lucide-react";

export function ResearchHeader() {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-950">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center lg:text-left">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-widest mb-6">
                Insights & Analytics
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-8">
                Data excellence <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-violet-400">
                  Driven by research.
                </span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-10">
                Explore our deep-dive case studies and market reports. We transform millions of data points into actionable intelligence for global innovators.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <button className="px-8 py-4 bg-brand-primary hover:bg-brand-hover text-white font-black rounded-full transition-all shadow-xl shadow-brand-primary/20 active:scale-95">
                  Request Custom Report
                </button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black rounded-full transition-all backdrop-blur-md">
                  Browse Categories
                </button>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 hidden lg:block">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="relative"
             >
                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex gap-2">
                         <div className="w-3 h-3 rounded-full bg-red-500/50" />
                         <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                         <div className="w-3 h-3 rounded-full bg-green-500/50" />
                      </div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Research Feed</div>
                   </div>
                   <div className="space-y-4">
                      {[1,2,3].map((i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                           <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                           </div>
                           <div className="flex-1">
                              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                              <div className="h-3 bg-white/5 rounded w-1/2" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
                {/* Floating Glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/30 rounded-full blur-[80px]" />
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CaseStudyCard({ study, index }: { study: CaseStudy, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link 
        href={`/research/${study.slug}`}
        className="group relative block bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-brand-primary/20 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-brand-primary/5"
      >
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={study.image} 
            alt={study.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-[10px] font-black uppercase tracking-widest text-brand-primary">
              {study.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-center gap-6 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Building2 size={12} /> {study.client}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={12} /> {study.duration}
            </div>
          </div>

          <h3 className="text-xl font-black text-gray-900 mb-4 leading-tight group-hover:text-brand-primary transition-colors">
            {study.title}
          </h3>
          
          <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2">
            {study.excerpt}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-gray-50">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <img key={i} src={`https://i.pravatar.cc/100?img=${i+30}`} className="w-7 h-7 rounded-full border-2 border-white" alt="Team" />
               ))}
               <div className="w-7 h-7 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[8px] font-black text-gray-400">+4</div>
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-black text-gray-900 group-hover:text-brand-primary transition-all">
              View Study <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
