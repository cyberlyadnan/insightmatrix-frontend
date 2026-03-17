"use client";

import React, { useState } from "react";
import { 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Mail, 
  Phone, 
  Globe,
  ArrowRight,
  User,
  Star,
  ExternalLink,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialQueries = [
  { id: 1, name: "Sarah Jenkins", email: "sarah@retailflow.com", subject: "B2C Consumer Sentiment Analysis", message: "We are looking to launch a new product line in the UK and need urgent sentiment data for the 25-35 demographic...", status: "Unread", priority: "High", date: "10 mins ago" },
  { id: 2, name: "Michael Chen", email: "m.chen@techglobal.net", subject: "Global Distribution Panel", message: "Interested in your proprietary panel for a multi-country distribution study. Can we discuss volume pricing?", status: "Read", priority: "Medium", date: "2 hours ago" },
  { id: 3, name: "Alexander Volkov", email: "alex@fintech.io", subject: "UX Audit for Mobile App", message: "Our KYC drop-off is at 45%. We need a deep dive research into the friction points...", status: "Completed", priority: "High", date: "1 day ago" },
  { id: 4, name: "Elena Martinez", email: "elena@viva-health.es", subject: "Partnership Inquiry", message: "We are a research agency in Spain interested in utilizing your API for our local clients...", status: "Read", priority: "Low", date: "3 days ago" },
];

export default function AdminQueries() {
  const [queries, setQueries] = useState(initialQueries);
  const [selectedId, setSelectedId] = useState<number | null>(queries[0].id);
  const [viewState, setViewState] = useState<'list' | 'detail'>(selectedId ? 'detail' : 'list');

  const selectedQuery = queries.find(q => q.id === selectedId);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    if (window.innerWidth < 1024) {
      setViewState('detail');
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 shrink-0 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">Inbound Queries</h1>
          <p className="text-gray-500 font-medium text-sm">Review and respond to research requests and contact submissions.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 transition-all">Inbox (12)</button>
           <button className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border border-gray-100 transition-all">Archived</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* List View */}
        <div className={`lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin ${viewState === 'detail' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="relative mb-2 shrink-0">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input type="text" placeholder="Filter queries..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all shadow-sm" />
          </div>
          
          <div className="space-y-3 pb-20 lg:pb-0">
            {queries.map((q) => (
              <button 
                key={q.id}
                onClick={() => handleSelect(q.id)}
                className={`w-full p-5 md:p-6 rounded-3xl border text-left transition-all relative group ${
                  selectedId === q.id 
                    ? "bg-white border-brand-primary shadow-xl shadow-brand-primary/5" 
                    : "bg-white border-gray-100 hover:border-gray-200"
                }`}
              >
                {q.status === 'Unread' && (
                  <div className="absolute top-6 right-6 w-2 h-2 bg-brand-primary rounded-full shadow-lg shadow-brand-primary/40" />
                )}
                <div className="flex items-center justify-between mb-4">
                   <span className={`text-[10px] font-black uppercase tracking-widest ${
                     q.priority === 'High' ? 'text-rose-500' : 'text-gray-400'
                   }`}>{q.priority} Priority</span>
                   <span className="text-[10px] font-bold text-gray-400">{q.date}</span>
                </div>
                <h3 className={`text-sm font-black mb-1 truncate ${selectedId === q.id ? "text-brand-primary" : "text-gray-900"}`}>{q.name}</h3>
                <p className="text-xs font-bold text-gray-500 truncate mb-3">{q.subject}</p>
                <p className="text-xs text-gray-400 line-clamp-1 leading-relaxed">{q.message}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Detail View */}
        <div className={`lg:col-span-8 min-h-0 ${viewState === 'list' ? 'hidden lg:block' : 'block'}`}>
           <AnimatePresence mode="wait">
             {selectedQuery ? (
               <motion.div 
                 key={selectedId}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm h-full flex flex-col relative overflow-hidden"
               >
                  <div className="p-5 md:p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-6">
                     <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setViewState('list')}
                          className="lg:hidden w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-brand-primary transition-all active:scale-95"
                        >
                           <X size={20} />
                        </button>
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300">
                           <User size={24} />
                        </div>
                        <div className="min-w-0">
                           <h2 className="text-lg md:text-xl font-black text-gray-900 truncate">{selectedQuery.name}</h2>
                           <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] md:text-xs font-bold text-gray-400 mt-0.5">
                              <span className="flex items-center gap-1.5"><Mail size={12} /> {selectedQuery.email}</span>
                              <span className="flex items-center gap-1.5 whitespace-nowrap"><Clock size={12} /> {selectedQuery.date}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 md:gap-3 lg:self-start">
                        <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-amber-500 transition-colors"><Star size={20} /></button>
                        <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>
                        <button className="flex-1 md:flex-none px-4 md:px-6 h-10 rounded-xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors">
                           <CheckCircle2 size={16} className="hidden sm:block" /> Mark Resolved
                        </button>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
                     <div className="inline-block px-3 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6">Subject: {selectedQuery.subject}</div>
                     <p className="text-gray-700 font-medium leading-[1.8] text-base md:text-lg whitespace-pre-wrap">
                        {selectedQuery.message}
                     </p>
                     
                     <div className="mt-12 md:mt-20 p-6 md:p-8 rounded-[2rem] bg-gray-50 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 mb-10 md:mb-0">
                        <div className="text-center md:text-left">
                           <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Reply via Email</div>
                           <div className="text-sm font-black text-gray-900 truncate max-w-[200px] md:max-w-none">{selectedQuery.email}</div>
                        </div>
                        <button className="w-full md:w-auto px-8 py-4 bg-gray-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200">
                           Compose Reply <ArrowRight size={18} />
                        </button>
                     </div>
                  </div>
               </motion.div>
             ) : (
               <div className="bg-white rounded-[2.5rem] border border-dashed border-gray-200 h-full flex items-center justify-center flex-col text-gray-300 p-10 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-6">
                    <MessageSquare size={40} className="opacity-50" />
                  </div>
                  <h3 className="text-gray-900 font-black text-lg mb-2">No Query Selected</h3>
                  <p className="text-sm font-bold max-w-[200px]">Select a query from the list to view details and respond.</p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
