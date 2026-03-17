"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  Quote, 
  Star,
  CheckCircle,
  X,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialTestimonials = [
  { 
    id: 1, 
    author: "Sarah Johnson", 
    role: "VP of Marketing", 
    company: "Global Brand Co.", 
    content: "InsightMatrix solutions help the world's most recognized brands, media owners and agencies research reality, using the biggest, most connected proprietary panel.",
    rating: 5,
    status: "Active",
    avatar: "S"
  },
  { 
    id: 2, 
    author: "Michael Chen", 
    role: "Director of UX", 
    company: "TechFlow Systems", 
    content: "The level of granularity InsightMatrix provides is industry-shifting. We didn't just see the data; we saw the future of our market.",
    rating: 5,
    status: "Active",
    avatar: "M"
  }
];

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Testimonials</h1>
          <p className="text-gray-500 font-medium">Manage client stories and social proof.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-hover transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by author, company or content..." 
          className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm text-gray-900 placeholder:text-gray-500 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <motion.div 
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white p-8 rounded-[2.5rem] border border-gray-100/50 shadow-sm hover:shadow-xl hover:border-brand-primary/20 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="flex gap-2">
                  <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-brand-primary transition-colors">
                     <Edit2 size={16} />
                  </button>
                  <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 transition-colors">
                     <Trash2 size={16} />
                  </button>
               </div>
            </div>

            <div className="flex items-center gap-1 text-amber-400 mb-6">
               {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>

            <div className="relative mb-8">
               <Quote className="absolute -left-2 -top-4 text-brand-primary/10 w-12 h-12" />
               <p className="text-gray-700 font-medium leading-relaxed italic relative z-10">
                  "{t.content}"
               </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-lg">
                     {t.avatar}
                  </div>
                  <div>
                     <h4 className="font-black text-gray-900">{t.author}</h4>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.role}, {t.company}</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle size={12} />
                  {t.status}
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modern Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
            >
               <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                  <div>
                     <h3 className="text-xl font-black text-gray-900">New Testimonial</h3>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Client Social Proof</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"><X size={20} /></button>
               </div>

               <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                  <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Author Name</label>
                         <input type="text" placeholder="e.g. Sarah Johnson" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all" />
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company</label>
                         <input type="text" placeholder="e.g. Global Brand Co." className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all" />
                      </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Client Role</label>
                     <input type="text" placeholder="e.g. VP of Marketing" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all" />
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Testimonial Content</label>
                     <textarea rows={4} placeholder="InsightMatrix solutions help..." className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all resize-none" />
                  </div>

                  <div className="flex items-center gap-6">
                     <div className="flex-1 space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Star Rating</label>
                        <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all appearance-none cursor-pointer">
                           <option>5 Stars</option>
                           <option>4 Stars</option>
                           <option>3 Stars</option>
                        </select>
                     </div>
                     <div className="flex-1 space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Profile Avatar</label>
                        <button className="w-full px-6 py-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
                           <ImageIcon size={18} /> Upload Image
                        </button>
                     </div>
                  </div>
               </div>

               <div className="p-8 border-t border-gray-50 flex gap-4">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 px-6 rounded-2xl border border-gray-100 text-gray-500 font-black text-sm hover:bg-gray-50 transition-all">Discard</button>
                  <button className="flex-2 py-4 px-10 rounded-2xl bg-brand-primary text-white font-black text-sm shadow-xl shadow-brand-primary/20 hover:bg-brand-hover transition-all">Publish Testimonial</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
