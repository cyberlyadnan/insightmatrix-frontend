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
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 flex flex-col items-center text-center shadow-sm">
               <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-brand-subtle flex items-center justify-center text-brand-primary border-4 border-white shadow-xl">
                     <User size={64} />
                  </div>
                  <button className="absolute bottom-1 right-1 w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-brand-primary transition-colors">
                     <Camera size={18} />
                  </button>
               </div>
               <h3 className="text-2xl font-black text-gray-900">Adnan Admin</h3>
               <p className="text-xs font-black text-brand-primary uppercase tracking-widest mt-1">Platinum Member</p>
               
               <div className="w-full mt-10 pt-10 border-t border-gray-50 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                     <span className="font-bold text-gray-400">Total Missions</span>
                     <span className="font-black text-gray-900">142</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="font-bold text-gray-400">Member Since</span>
                     <span className="font-black text-gray-900">Oct 2023</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Settings Sections */}
         <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden divide-y divide-gray-50">
               {[
                 { name: "Account Information", desc: "Update your name, email, and location", icon: User },
                 { name: "Notification Settings", desc: "Choose what updates you want to receive", icon: Bell },
                 { name: "Security & Privacy", desc: "Manage passwords and two-factor auth", icon: Shield },
                 { name: "Connected Devices", desc: "View and manage active sessions", icon: Smartphone },
                 { name: "Data Usage", desc: "Manage your research data preferences", icon: Lock },
               ].map((item, i) => (
                 <div key={i} className="p-8 flex items-center justify-between group cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
                          <item.icon size={24} />
                       </div>
                       <div>
                          <h4 className="font-black text-gray-900 leading-tight mb-1">{item.name}</h4>
                          <p className="text-xs font-medium text-gray-500">{item.desc}</p>
                       </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-brand-primary transition-all" />
                 </div>
               ))}
            </div>

            <div className="p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100 flex items-center justify-between">
               <div>
                  <h4 className="font-black text-rose-600 mb-1">Delete Account</h4>
                  <p className="text-xs font-medium text-rose-400">Permanently remove your data and earnings.</p>
               </div>
               <button className="px-6 py-3 bg-white text-rose-600 font-black text-xs rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                  Deactivate
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
