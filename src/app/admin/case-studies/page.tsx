"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data
const initialCaseStudies = [
  { id: 1, title: "Fintech UX Optimization", client: "PayStream Ltd.", status: "Published", date: "Oct 12, 2023", category: "UX Research" },
  { id: 2, title: "Global Retail audit", client: "NexGen Retail", status: "Published", date: "Sep 28, 2023", category: "Market Analysis" },
  { id: 3, title: "HealthTech Market Entry", client: "BioPulse", status: "Draft", date: "Oct 15, 2023", category: "Strategic Strategy" },
  { id: 4, title: "Automotive SaaS Study", client: "DriveCore", status: "Review", date: "Oct 01, 2023", category: "B2B Insights" },
  { id: 5, title: "E-commerce Behavior", client: "ShopLift", status: "Published", date: "Nov 02, 2023", category: "Consumer Psychology" },
];

export default function AdminCaseStudies() {
  const [studies, setStudies] = useState(initialCaseStudies);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Manage Case Studies</h1>
          <p className="text-gray-500 font-medium text-sm">Create, edit, and publish your research success stories.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-brand-primary hover:bg-brand-hover text-white font-black rounded-2xl shadow-xl shadow-brand-primary/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          Create New Study
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, client, or category..." 
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <button className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <Filter size={18} /> Filters
           </button>
           <select className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 outline-none hover:bg-gray-50 transition-colors cursor-pointer">
              <option>Recently Added</option>
              <option>Most Viewed</option>
              <option>Published Only</option>
              <option>Drafts</option>
           </select>
        </div>
      </div>

      {/* Table Module */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="px-8 py-6">Case Study</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {studies.map((study) => (
                <tr key={study.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
                          <ImageIcon size={20} />
                       </div>
                       <div>
                          <div className="font-black text-gray-900 leading-tight mb-1">{study.title}</div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{study.client}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className="px-3 py-1 rounded-lg bg-gray-100 text-[10px] font-black uppercase text-gray-600 tracking-widest">
                        {study.category}
                     </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-gray-500 whitespace-nowrap">{study.date}</td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2">
                        {study.status === 'Published' ? (
                          <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                             <CheckCircle2 size={14} /> Published
                          </div>
                        ) : study.status === 'Draft' ? (
                           <div className="flex items-center gap-1.5 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                             <Clock size={14} /> Draft
                          </div>
                        ) : (
                           <div className="flex items-center gap-1.5 text-brand-primary font-black text-[10px] uppercase tracking-widest">
                             <Edit2 size={14} /> In Review
                          </div>
                        )}
                     </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all">
                        <Eye size={18} />
                      </button>
                      <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:border-emerald-500 transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:border-rose-500 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
           <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing 5 of {studies.length} studies</div>
           <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30" disabled>
                 <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1 mx-2">
                 {[1, 2, 3].map(i => (
                   <button key={i} className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center transition-all ${i === 1 ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}>
                      {i}
                   </button>
                 ))}
              </div>
              <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50">
                 <ChevronRight size={20} />
              </button>
           </div>
        </div>
      </div>

      {/* Create/Edit Modal UI Mockup */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
             >
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                   <div>
                      <h3 className="text-xl font-black text-gray-900">Create New Case Study</h3>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Populate details and visual media</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                      <X size={20} />
                   </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Study Title</label>
                         <input type="text" placeholder="e.g. Fintech UX Audit" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all" />
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Client Name</label>
                         <input type="text" placeholder="e.g. PayStream" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all" />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Introduction Excerpt</label>
                      <textarea rows={3} placeholder="Write a brief overview..." className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all resize-none" />
                   </div>

                   <div className="grid md:grid-cols-3 gap-8">
                      <div className="md:col-span-2 space-y-4">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Featured Image</label>
                         <div className="h-48 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 group cursor-pointer hover:border-brand-primary/40 transition-all">
                            <ImageIcon size={40} className="mb-3 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold">Drag and drop or <span className="text-brand-primary">browse files</span></span>
                            <span className="text-[10px] font-medium mt-1">Recommended: 1200x800px</span>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Publishing</label>
                         <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 space-y-4">
                            <div className="flex items-center justify-between">
                               <span className="text-xs font-black text-gray-600">Public visibility</span>
                               <div className="w-10 h-6 bg-brand-primary rounded-full relative p-1 cursor-pointer">
                                  <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                               </div>
                            </div>
                            <div className="flex items-center justify-between">
                               <span className="text-xs font-black text-gray-600">Featured Study</span>
                               <div className="w-10 h-6 bg-gray-200 rounded-full relative p-1 cursor-pointer">
                                  <div className="w-4 h-4 bg-white rounded-full absolute left-1" />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-8 border-t border-gray-100 flex items-center justify-end gap-4 bg-gray-50/50">
                   <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-white border border-gray-100 text-gray-600 font-black text-sm rounded-2xl hover:bg-gray-100 transition-colors">Cancel</button>
                   <button className="px-8 py-4 bg-brand-primary text-white font-black text-sm rounded-2xl shadow-xl shadow-brand-primary/20 hover:bg-brand-hover transition-all">Save Changes</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { X } from "lucide-react";
