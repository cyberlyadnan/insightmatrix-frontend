"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Settings, 
  Layout, 
  Eye,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Zap,
  Tag
} from "lucide-react";
import { motion } from "framer-motion";

const initialServices = [
  { id: 1, name: "Consumer Habit Research", icon: "TrendingUp", status: "Active", priceRange: "$5k - $20k", items: 4 },
  { id: 2, name: "B2B Market Penetration", icon: "Target", status: "Active", priceRange: "$10k - $50k", items: 6 },
  { id: 3, name: "Brand Voice Discovery", icon: "MessageSquare", status: "Paused", priceRange: "$2k - $8k", items: 3 },
  { id: 4, name: "Rapid Audience Profiling", icon: "Zap", status: "Active", priceRange: "$1k - $5k", items: 2 },
  { id: 5, name: "Competitor Intelligence", icon: "Shield", status: "Active", priceRange: "$15k+", items: 5 },
  { id: 6, name: "Product UX Feedback", icon: "Smile", status: "Active", priceRange: "$3k - $12k", items: 4 },
];

export default function AdminServices() {
  const [services, setServices] = useState(initialServices);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Service Catalog</h1>
          <p className="text-gray-500 font-medium text-sm">Define and manage the professional services offered on InsightMatrix.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-gray-200 transition-all active:scale-95">
          <Plus size={20} />
          New Service Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/40 transition-all relative overflow-hidden"
          >
            {/* Status Badge */}
            <div className="absolute top-6 right-6">
               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                 service.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
               }`}>
                  {service.status}
               </span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-8 group-hover:scale-110 transition-transform">
               <Zap size={28} />
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-brand-primary transition-colors">{service.name}</h3>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-8">{service.items} Key Feature Points Included</p>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-8">
               <div className="flex items-center gap-2 text-gray-400">
                  <Tag size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Base Rate</span>
               </div>
               <span className="text-sm font-black text-gray-900">{service.priceRange}</span>
            </div>

            <div className="flex gap-2">
               <button className="flex-1 py-3 bg-gray-900 text-white font-black text-xs rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 group/btn">
                  Edit Details <Edit size={14} className="group-hover/btn:rotate-12 transition-transform" />
               </button>
               <button className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:border-rose-500 transition-all">
                  <Trash2 size={18} />
               </button>
            </div>
          </motion.div>
        ))}
        
        {/* Add Shortcut */}
        <button className="h-full min-h-[300px] border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-300 hover:border-brand-primary/20 hover:text-brand-primary transition-all group">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-brand-primary/10 transition-colors">
               <Plus size={32} />
            </div>
            <span className="text-sm font-black uppercase tracking-widest">Quick Service Add</span>
        </button>
      </div>
    </div>
  );
}
