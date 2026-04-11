"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  TrendingUp, Users, ArrowUpRight,
  Zap, Calendar, Search, Layers, BadgeIndianRupee
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

// Model ke according types
type Transaction = {
  id: string;
  userId: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  status: "PENDING" | "COMPLETED" | "FAILED";
  description: string;
  createdAt: Date;
  user: {
    name: string;
    username: string;
    photoUrl?: string;
  }
};

export default function CommissionDetailsPage({ initialData = [] }: { initialData: Transaction[] }) {
  const [search, setSearch] = useState("");

  // Filtering only CREDIT transactions (Commissions are usually credits)
  // Aur hum search karenge associate name ya description mein
  const filtered = initialData.filter(t =>
    t.type === "CREDIT" && (
      t.user.name.toLowerCase().includes(search.toLowerCase()) ||
      t.user.username.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalCommission = filtered
    .filter(t => t.status === "COMPLETED")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="min-h-screen">

      {/* --- HEADER --- */}
      <div className="pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <PageHeader
          title="Earnings"
          highlight=" Log"
          subtitle="Finances"
          description={"History of all credit distributions"}
          showBackButton={true}
        />

        

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search Associate or Remark..."
            className="w-full h-14 pl-12 pr-6 rounded-3xl bg-white border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* --- BENTO STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          label="Settled Earnings"
          value={`₹${totalCommission.toLocaleString()}`}
          icon={<BadgeIndianRupee size={20} />}
          color="emerald"
        />
        <StatCard
          label="Total Credits"
          value={filtered.length.toString()}
          icon={<TrendingUp size={20} />}
          color="amber"
        />
        <StatCard
          label="Pending Sync"
          value={filtered.filter(t => t.status === "PENDING").length.toString()}
          icon={<Zap size={20} />}
          color="slate"
        />
      </div>

      {/* --- TRANSACTION LIST --- */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-[3rem] py-24 text-center border border-slate-100 shadow-sm">
            <Layers className="mx-auto h-12 w-12 text-slate-200 mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">No earnings data available</p>
          </div>
        ) : (
          filtered.map((trx, idx) => (
            <motion.div
              key={trx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 hover:border-emerald-200 transition-all duration-500 flex flex-col md:flex-row items-center gap-8"
            >
              {/* Receiver */}
              <div className="flex items-center gap-5 flex-1 w-full">
                <div className="h-16 w-16 rounded-[1.5rem] bg-slate-100 border border-slate-200 overflow-hidden relative shrink-0 shadow-inner">
                  <Image src={trx.user.photoUrl || "/placeholder.png"} alt="User" fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-black text-slate-900 truncate tracking-tighter uppercase italic">{trx.user.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">#{trx.user.username}</p>
                </div>
              </div>

              {/* Description / Remark */}
              <div className="flex-1 w-full text-center md:text-left bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Transaction Remark</p>
                <p className="text-xs font-bold text-slate-700 leading-relaxed uppercase">
                  {trx.description}
                </p>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  trx.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    trx.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"
                )}>
                  {trx.status}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{format(new Date(trx.createdAt), "dd MMM, yy")}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="shrink-0 text-center md:text-right min-w-[120px]">
                <p className={cn(
                  "text-3xl font-[1000] tracking-tighter italic",
                  trx.type === "CREDIT" ? "text-emerald-600" : "text-rose-600"
                )}>
                  {trx.type === "CREDIT" ? "+" : "-"}₹{trx.amount.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-[1000] text-slate-900 tracking-tighter italic">{value}</p>
      </div>
      <div className={cn(
        "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
        color === "emerald" ? "bg-emerald-50 text-emerald-600" :
          color === "amber" ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-600"
      )}>
        {icon}
      </div>
    </div>
  );
}