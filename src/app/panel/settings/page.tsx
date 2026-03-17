"use client";

import React from "react";
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Smartphone, 
  Lock,
  ChevronRight,
  Camera
} from "lucide-react";
import { motion } from "framer-motion";

export default function PanelSettings() {
  return (
    <div className="space-y-10">
      <div>
         <h1 className="text-3xl font-black text-gray-900 tracking-tight">Profile Settings</h1>
         <p className="text-gray-500 font-medium">Customize your experience and security preferences.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
         {/* Profile Card */}
         <div className="lg:col-span-4">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 flex flex-col items-center text-center shadow-sm">
               <div className="relative mb-6">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2.2rem] md:rounded-[2.5rem] bg-brand-subtle flex items-center justify-center text-brand-primary border-4 border-white shadow-xl">
                     <User size={48} className="md:w-16 md:h-16" />
                  </div>
                  <button className="absolute bottom-1 right-1 w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-brand-primary transition-colors active:scale-95">
                     <Camera size={18} />
                  </button>
               </div>
               <h3 className="text-xl md:text-2xl font-black text-gray-900">Adnan Admin</h3>
               <p className="text-[10px] md:text-xs font-black text-brand-primary uppercase tracking-widest mt-1">Platinum Member</p>
               
               <div className="w-full mt-8 md:mt-10 pt-8 md:pt-10 border-t border-gray-50 space-y-4">
                  <div className="flex justify-between items-center text-xs md:text-sm">
                     <span className="font-bold text-gray-400">Total Missions</span>
                     <span className="font-black text-gray-900">142</span>
                  </div>
                  <div className="flex justify-between items-center text-xs md:text-sm">
                     <span className="font-bold text-gray-400">Member Since</span>
                     <span className="font-black text-gray-900">Oct 2023</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Settings Sections */}
         <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 overflow-hidden divide-y divide-gray-50">
               {[
                 { name: "Account Information", desc: "Update your name, email, and location", icon: User },
                 { name: "Notification Settings", desc: "Choose what updates you want to receive", icon: Bell },
                 { name: "Security & Privacy", desc: "Manage passwords and two-factor auth", icon: Shield },
                 { name: "Connected Devices", desc: "View and manage active sessions", icon: Smartphone },
                 { name: "Data Usage", desc: "Manage your research data preferences", icon: Lock },
               ].map((item, i) => (
                 <div key={i} className="p-6 md:p-8 flex items-center justify-between group cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4 md:gap-6 min-w-0">
                       <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all shrink-0">
                          <item.icon size={20} className="md:w-6 md:h-6" />
                       </div>
                       <div className="min-w-0">
                          <h4 className="font-black text-gray-900 leading-tight mb-1 text-sm md:text-base truncate">{item.name}</h4>
                          <p className="text-[10px] md:text-xs font-medium text-gray-500 truncate">{item.desc}</p>
                       </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-primary transition-all shrink-0" />
                 </div>
               ))}
            </div>

            <div className="p-6 md:p-8 bg-rose-50 rounded-[2rem] md:rounded-[2.5rem] border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div className="min-w-0">
                  <h4 className="font-black text-rose-600 mb-1 text-sm md:text-base">Delete Account</h4>
                  <p className="text-[10px] md:text-xs font-medium text-rose-400">Permanently remove your data and earnings.</p>
               </div>
               <button className="w-full sm:w-auto px-6 py-3 bg-white text-rose-600 font-black text-[10px] md:text-xs rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95">
                  Deactivate
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
