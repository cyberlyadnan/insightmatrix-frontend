"use client";

import React from "react";
import { 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  History, 
  Award, 
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Gift,
  Plus,
  Star
} from "lucide-react";
import { motion } from "framer-motion";

const transactions = [
  { id: 1, type: "Survey Reward", target: "EV Mobility Alpha", amount: "+$12.50", date: "Today, 2:40 PM", status: "Success" },
  { id: 2, type: "Withdrawal", target: "PayPal Account", amount: "-$50.00", date: "Yesterday", status: "Processing" },
  { id: 3, type: "Bonus", target: "Platinum Tier Reach", amount: "+$5.00", date: "2 days ago", status: "Success" },
  { id: 4, type: "Survey Reward", target: "Fashion Audit", amount: "+$15.00", date: "3 days ago", status: "Success" },
];

export default function PanelWallet() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Wallet</h1>
           <p className="text-gray-500 font-medium">Manage your earnings and redemption milestones.</p>
        </div>
        <div className="flex flex-wrap gap-3">
           <button className="flex-1 sm:flex-none px-6 py-3.5 bg-gray-900 text-white font-black text-xs rounded-xl shadow-xl shadow-gray-200 transition-all hover:bg-black active:scale-95 text-center">
              Withdraw Funds
           </button>
           <button className="flex-1 sm:flex-none px-6 py-3.5 bg-white border border-gray-100 text-gray-900 font-black text-xs rounded-xl transition-all hover:bg-gray-50 text-center">
              Payment Methods
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Balance Card */}
          <div className="lg:col-span-2 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-br from-brand-primary to-violet-600 text-white relative overflow-hidden shadow-2xl shadow-brand-primary/20">
            <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full blur-[60px] md:blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col h-full">
               <div className="flex justify-between items-start mb-12 md:mb-16">
                  <div className="min-w-0">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Available Balance</p>
                     <p className="text-4xl sm:text-5xl md:text-6xl font-black truncate leading-tight">$124.50</p>
                  </div>
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/20 shrink-0">
                     <Wallet size={24} className="md:w-8 md:h-8" />
                  </div>
               </div>
               
               <div className="mt-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  <div className="min-w-0">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Lifetime</p>
                     <p className="text-lg md:text-xl font-black truncate">$1,420.00</p>
                  </div>
                  <div className="min-w-0">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">This Month</p>
                     <p className="text-lg md:text-xl font-black truncate">$286.10</p>
                  </div>
                  <div className="hidden sm:flex col-span-2 justify-end items-end">
                     <div className="flex -space-x-3">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-primary bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px] font-black shrink-0">
                             {i === 3 ? "+12" : <Star size={14} fill="currentColor" />}
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>

         {/* Tier/Status */}
         <div className="p-10 rounded-[3rem] bg-white border border-gray-100 flex flex-col justify-between group cursor-pointer hover:border-brand-primary/20 transition-all">
            <div>
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                     <Award size={24} />
                  </div>
                  <p className="text-sm font-black text-gray-900">Platinum Member</p>
               </div>
               <h3 className="text-3xl font-black text-gray-900 mb-2">4,250 XP</h3>
               <p className="text-xs font-bold text-gray-400 leading-relaxed">
                  Earn 750 more XP to unlock the <span className="text-brand-primary">Black Tier</span> with instant payouts.
               </p>
            </div>
            <div className="mt-8 space-y-3">
               <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-brand-primary rounded-full transition-all" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-right text-gray-400">85% towards next tier</p>
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
         {/* History */}
         <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-black text-gray-900">Recent Activity</h2>
               <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-primary flex items-center gap-1">
                  Download JSON Statement <History size={14} />
               </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-gray-50/50 transition-colors">
                     <div className="flex items-center gap-4 md:gap-5 w-full sm:w-auto">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                           tx.amount.startsWith('+') ? "bg-emerald-50 text-emerald-500" : "bg-gray-100 text-gray-400"
                        }`}>
                           {tx.amount.startsWith('+') ? <ArrowUpRight size={18} className="md:w-5 md:h-5" /> : <CreditCard size={18} className="md:w-5 md:h-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                           <p className="text-sm font-black text-gray-900 truncate">{tx.target}</p>
                           <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{tx.type} • {tx.date}</p>
                        </div>
                     </div>
                     <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                        <p className={`text-sm font-black ${tx.amount.startsWith('+') ? "text-emerald-500" : "text-gray-900"}`}>{tx.amount}</p>
                        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{tx.status}</p>
                     </div>
                  </div>
                ))}
               <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-primary transition-colors">View All Transactions</button>
            </div>
         </div>

         {/* Redemption Sidebar */}
         <div className="lg:col-span-4 space-y-8">
            <h2 className="text-xl font-black text-gray-900 px-4">Instant Rewards</h2>
            <div className="space-y-4">
               {[
                 { name: "Amazon Gift Card", pts: "1,000 pts", color: "bg-gray-900" },
                 { name: "Visa Prepaid", pts: "2,500 pts", color: "bg-brand-primary" },
                 { name: "PayPal Transfer", pts: "5,000 pts", color: "bg-blue-600" },
               ].map((item, i) => (
                 <div key={i} className="p-6 rounded-[2rem] bg-white border border-gray-100 flex items-center justify-between hover:shadow-xl hover:shadow-gray-200/40 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white`}>
                          <Gift size={20} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-gray-900">{item.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">{item.pts}</p>
                       </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-primary transition-colors" />
                 </div>
               ))}
            </div>
            
            <div className="p-6 rounded-[2rem] bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center py-10">
               <ShieldCheck className="text-gray-300 mb-3" size={32} />
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Secured Payments</p>
               <p className="text-xs font-medium text-gray-500 max-w-[150px]">Withdrawals are processed within 24 hours.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
