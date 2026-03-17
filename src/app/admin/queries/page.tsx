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
  ExternalLink
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

  const selectedQuery = queries.find(q => q.id === selectedId);

  return (
    <div className="h-[calc(100vh-180px)] overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Inbound Queries</h1>
          <p className="text-gray-500 font-medium text-sm">Review and respond to research requests and contact submissions.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-6 py-3 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">Inbox (12)</button>
           <button className="px-6 py-3 rounded-xl bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border border-gray-100">Archived</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 h-full">
        {/* List View */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin">
          <div className="relative mb-2 shrink-0">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input type="text" placeholder="Filter queries..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all" />
          </div>
          
          {queries.map((q) => (
            <button 
              key={q.id}
              onClick={() => setSelectedId(q.id)}
              className={`p-6 rounded-3xl border text-left transition-all relative ${
                selectedId === q.id 
                  ? "bg-white border-brand-primary shadow-xl shadow-brand-primary/5" 
                  : "bg-white border-gray-100 hover:border-gray-200"
              }`}
            >
              {q.status === 'Unread' && (
                <div className="absolute top-6 right-6 w-2 h-2 bg-brand-primary rounded-full" />
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

        {/* Detail View */}
        <div className="lg:col-span-8 h-full">
           <AnimatePresence mode="wait">
             {selectedQuery ? (
               <motion.div 
                 key={selectedId}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="bg-white rounded-[2.5xl] border border-gray-100 shadow-sm h-full flex flex-col"
               >
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300">
                           <User size={28} />
                        </div>
                        <div>
                           <h2 className="text-xl font-black text-gray-900">{selectedQuery.name}</h2>
                           <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mt-1">
                              <span className="flex items-center gap-1.5"><Mail size={14} /> {selectedQuery.email}</span>
                              <span className="flex items-center gap-1.5"><Clock size={14} /> Received {selectedQuery.date}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-amber-500 transition-colors"><Star size={20} /></button>
                        <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>
                        <button className="px-6 h-10 rounded-xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition-colors">
                           <CheckCircle2 size={16} /> Mark Resolved
                        </button>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 prose prose-lg max-w-none">
                     <div className="inline-block px-3 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6">Subject: {selectedQuery.subject}</div>
                     <p className="text-gray-700 font-medium leading-[1.8] text-lg">
                        {selectedQuery.message}
                     </p>
                     
                     <div className="mt-20 p-8 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Reply via Email</div>
                           <div className="text-sm font-black text-gray-900">{selectedQuery.email}</div>
                        </div>
                        <button className="px-8 py-4 bg-gray-900 text-white font-black rounded-2xl flex items-center gap-2 hover:bg-black transition-all">
                           Compose Reply <ArrowRight size={18} />
                        </button>
                     </div>
                  </div>
               </motion.div>
             ) : (
               <div className="bg-white rounded-3xl border border-dashed border-gray-200 h-full flex items-center justify-center flex-col text-gray-300">
                  <MessageSquare size={64} className="mb-4 opacity-50" />
                  <p className="font-bold">Select a query to read details</p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
