"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Linkedin,
  Twitter,
  Edit2,
  Trash2,
  X,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for the team members
const initialTeam = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Head of Research",
    department: "Research & Insights",
    email: "sarah.j@insightmatrix.com",
    avatar: "https://i.pravatar.cc/150?img=47",
    status: "Active",
  },
  {
    id: 2,
    name: "David Chen",
    role: "Lead Data Scientist",
    department: "Data Engine",
    email: "david.c@insightmatrix.com",
    avatar: "https://i.pravatar.cc/150?img=11",
    status: "Active",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Panel Operations Director",
    department: "Operations",
    email: "elena.r@insightmatrix.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "On Leave",
  },
  {
    id: 4,
    name: "Marcus Thorne",
    role: "VP of Engineering",
    department: "Product",
    email: "marcus.t@insightmatrix.com",
    avatar: "https://i.pravatar.cc/150?img=33",
    status: "Active",
  },
  {
    id: 5,
    name: "Aisha Patel",
    role: "Client Success Lead",
    department: "Sales & Success",
    email: "aisha.p@insightmatrix.com",
    avatar: "https://i.pravatar.cc/150?img=20",
    status: "Active",
  },
  {
    id: 6,
    name: "Thomas Wright",
    role: "Compliance Officer",
    department: "Legal",
    email: "thomas.w@insightmatrix.com",
    avatar: "https://i.pravatar.cc/150?img=60",
    status: "Active",
  },
];

type TeamMember = (typeof initialTeam)[number];

export default function AdminTeam() {
  const [team, setTeam] = useState(initialTeam);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Filter based on search query
  const filteredTeam = team.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (member: TeamMember | null = null) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-brand-primary" size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
              Organization
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Team Management</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
            />
          </div>
          <button className="px-5 py-3 bg-white border border-gray-100 text-gray-700 font-bold text-sm rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
            <Filter size={16} /> Filter
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-gray-900 text-white font-black text-sm rounded-2xl hover:bg-brand-primary transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-xl shadow-gray-200/50"
          >
            <Plus size={18} /> Add Member
          </button>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeam.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 p-8 hover:shadow-2xl hover:shadow-gray-200/40 transition-all group relative overflow-hidden flex flex-col h-full"
          >
            {/* Header: Avatar and Status */}
            <div className="flex justify-between items-start mb-6">
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-20 h-20 rounded-3xl object-cover border-4 border-gray-50 shadow-sm"
                />
                <div
                  className={`absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-white ${
                    member.status === "Active"
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-400 text-white"
                  }`}
                >
                  {member.status}
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenModal(member)}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-xl font-black text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm font-bold text-brand-primary mb-4">{member.role}</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">
                {member.department}
              </div>
            </div>

            {/* Footer: Contacts */}
            <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 max-w-full overflow-hidden">
                <Mail size={14} className="text-gray-400 shrink-0" />
                <span className="text-xs font-medium text-gray-600 truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-colors"
                >
                  <Linkedin size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {editingMember ? "Edit Team Member" : "Add New Member"}
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Manage platform access and roles
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-8 flex-1">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 group cursor-pointer hover:border-brand-primary hover:text-brand-primary transition-colors relative overflow-hidden">
                    {editingMember ? (
                      <img
                        src={editingMember.avatar}
                        className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                      />
                    ) : (
                      <Upload size={24} />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white pointer-events-none">
                      <Upload size={24} />
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-3">
                    Upload Photo
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={editingMember?.name}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={editingMember?.email}
                      placeholder="sarah@company.com"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                      Job Role
                    </label>
                    <input
                      type="text"
                      defaultValue={editingMember?.role}
                      placeholder="e.g. Head of Research"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                      Department
                    </label>
                    <select
                      defaultValue={editingMember?.department || "Research & Insights"}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary appearance-none bg-white"
                    >
                      <option>Research & Insights</option>
                      <option>Data Engine</option>
                      <option>Operations</option>
                      <option>Product</option>
                      <option>Sales & Success</option>
                      <option>Legal</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-50 flex justify-end gap-3 shrink-0 bg-gray-50/50">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3.5 rounded-2xl font-bold text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-8 py-3.5 rounded-2xl font-black text-sm text-white bg-brand-primary hover:bg-brand-hover shadow-xl shadow-brand-primary/20 transition-all active:scale-95">
                  {editingMember ? "Save Changes" : "Invite Member"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
