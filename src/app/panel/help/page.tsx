"use client";

import React from "react";
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  FileText, 
  Zap, 
  ArrowRight,
  PlayCircle,
  Mail,
  LifeBuoy
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { name: "Getting Started", icon: Zap, count: 12, color: "text-brand-primary" },
  { name: "Payment & Rewards", icon: LifeBuoy, count: 8, color: "text-emerald-500" },
  { name: "Account Safety", icon: FileText, count: 5, color: "text-blue-500" },
];

export default function PanelHelp() {
  return (
    <div className="space-y-12">
      {/* Help Hero */}
      <div className="relative p-12 lg:p-20 rounded-[4rem] bg-gray-950 text-white overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[100px]" />
         
         <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-black mb-8 leading-tight">How can we <br />help you today?</h1>
            <div className="relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
               <input 
                 type="text" 
                 placeholder="Search for articles, guides, subjects..." 
                 className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl text-lg text-white placeholder:text-gray-500 outline-none focus:ring-4 focus:ring-brand-primary/20 focus:bg-white/10 transition-all"
               />
            </div>
         </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
         {categories.map((cat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="p-8 rounded-[3rem] bg-white border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/40 transition-all group cursor-pointer"
           >
              <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center ${cat.color} mb-6 group-hover:scale-110 transition-transform`}>
                 <cat.icon size={28} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{cat.name}</h3>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{cat.count} Articles</p>
           </motion.div>
         ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
         <div className="p-10 rounded-[3rem] bg-brand-subtle/30 border border-brand-primary/5 flex flex-col justify-between">
            <div>
               <h2 className="text-2xl font-black text-gray-900 mb-6">Frequently Asked</h2>
               <div className="space-y-4">
                  {[
                    "How do I withdraw my earnings?",
                    "What is the Platinum Tier?",
                    "Why was my mission rejected?",
                    "Can I use multiple devices?"
                  ].map((q, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white/50 border border-white/50 flex items-center justify-between hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                       <span className="text-sm font-bold text-gray-700">{q}</span>
                       <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-primary transition-colors" />
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="p-10 rounded-[3rem] bg-white border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-xl transition-all group cursor-pointer">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-500">
                     <PlayCircle size={32} />
                  </div>
                  <div>
                     <h3 className="font-black text-gray-900 mb-1">Video Tutorials</h3>
                     <p className="text-xs font-medium text-gray-500">Master the platform in 5 minutes.</p>
                  </div>
               </div>
               <ArrowRight size={20} className="text-gray-300 group-hover:text-brand-primary transition-all" />
            </div>

            <div className="p-10 rounded-[3rem] bg-gray-900 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-[60px]" />
               <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4">Still need help?</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-[250px]">
                     Our expert support team is available 24/7 for our verified members.
                  </p>
                  <div className="flex gap-4">
                     <button className="flex-1 py-4 bg-brand-primary text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-hover transition-colors">
                        <MessageCircle size={16} /> Live Chat
                     </button>
                     <button className="flex-1 py-4 bg-white/10 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-white/20 border border-white/10 transition-colors">
                        <Mail size={16} /> Email Us
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
