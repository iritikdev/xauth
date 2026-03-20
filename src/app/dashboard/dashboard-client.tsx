"use client";
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import React from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Users, 
  UserCheck, 
  Wallet, 
  Zap, 
  ShieldCheck, 
  Leaf, 
  ArrowRight, 
  TrendingUp, 
  Calendar,
  LucideIcon 
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDateTime, cn } from "@/lib/utils";
import Link from "next/link";

// 1. Icon Mapping to prevent "Functions cannot be passed to Client Components" error
const IconMap: Record<string, LucideIcon> = {
  Users: Users,
  UserCheck: UserCheck,
  Wallet: Wallet,
  Trophy: Trophy,
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay },
});

interface DashboardClientProps {
  userData: any;
  stats: {
    label: string;
    value: string | number;
    accent: string;
    iconName: string;
  }[];
  firstName: string;
}

export function DashboardClient({ userData, stats, firstName }: DashboardClientProps) {
  return (
    <main className="min-h-screen bg-[#f5f0e8] pb-16 font-sans selection:bg-emerald-200">
      <div className="relative z-10 container mx-auto px-4 md:px-8 py-8 space-y-6 max-w-7xl">
        
        {/* ── Hero Banner ── */}
        <motion.section 
          {...fadeUp(0)} 
          className="relative bg-[#1c3320] rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          <div className="relative z-10 p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-[#e8a020]/20 shadow-xl">
                <AvatarImage src={userData.photoUrl} className="object-cover" />
                <AvatarFallback className="bg-emerald-800 text-[#e8a020] font-black text-2xl">
                  {firstName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/60">Official Associate</p>
                <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">
                  Hello, {firstName}<span className="text-[#e8a020]">.</span>
                </h1>
                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                   <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                     <ShieldCheck size={12} className="text-emerald-500" /> {userData.username}
                   </div>
                   <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                     <Calendar size={12} /> Joined {formatDateTime(userData.createdAt)}
                   </div>
                </div>
              </div>
            </div>

            {/* Rank Status Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] min-w-[280px] w-full lg:w-auto">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Next Milestone</span>
                  <Trophy size={16} className="text-[#e8a020]" />
               </div>
               <h3 className="text-2xl font-black text-[#e8a020] italic tracking-tight mb-2">Star Partner</h3>
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "45%" }} 
                    className="h-full bg-emerald-500 rounded-full" 
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
               </div>
               <p className="text-[10px] font-bold text-white/20 mt-2 uppercase tracking-widest text-right">45% Complete</p>
            </div>
          </div>
          
          {/* Decorative Leaf Background */}
          <Leaf size={200} className="absolute -bottom-20 -left-10 text-white/5 rotate-12 pointer-events-none" />
        </motion.section>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = IconMap[s.iconName] || Zap;
            return (
              <motion.div
                key={s.label}
                {...fadeUp(0.1 + i * 0.1)}
                className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500/20 transition-all group relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-50 transition-all duration-300">
                    <Icon size={20} style={{ color: s.accent }} strokeWidth={2.5} />
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">{s.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mt-2">{s.label}</p>
                </div>
                <div className="absolute bottom-0 right-0 p-2 opacity-5">
                   <Icon size={60} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Insights & Tools ── */}
        <div className="grid lg:grid-cols-3 gap-6">
           {/* Insights Card */}
           <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black italic text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                  <Zap size={18} className="text-[#e8a020] fill-[#e8a020]" /> Distributor Insights
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-full tracking-widest border border-emerald-100">
                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   LIVE SYNC
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                 {[
                   { label: "Sponsor", value: userData.sponsor?.name || "Direct Company", icon: Users, sub: userData.sponsor?.username },
                   { label: "Self Business", value: `${userData.personalBv || 0} BV`, icon: TrendingUp, sub: "Monthly Points" },
                   { label: "Wallet Balance", value: `₹${userData.Wallet?.balance || '0.00'}`, icon: Wallet, sub: "Available to Withdraw" },
                   { label: "Account ID", value: userData.username, icon: ShieldCheck, sub: "Verified Associate" },
                 ].map((item) => (
                   <div key={item.label} className="p-5 bg-slate-50 rounded-[1.5rem] flex items-center gap-4 hover:bg-emerald-50/50 hover:border-emerald-100 border border-transparent transition-all group">
                      <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center text-[#e8a020] shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                        <item.icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                        <p className="text-sm font-black text-slate-800 truncate">{item.value}</p>
                        {item.sub && <p className="text-[8px] font-bold text-slate-400 mt-0.5">{item.sub}</p>}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Business Tools CTA */}
           <motion.div {...fadeUp(0.4)} className="bg-[#1c3320] rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10 space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-2">
                   <TrendingUp size={24} className="text-[#e8a020]" />
                </div>
                <h3 className="text-2xl font-black italic tracking-tight uppercase leading-none">Business<br />Tools</h3>
                <p className="text-white/40 text-[11px] font-medium leading-relaxed">
                  Project your earnings using our Interactive Growth Plan calculator based on the official 15-level payout structure.
                </p>
              </div>

              <div className="relative z-10 mt-8">
                <Link href="/dashboard/businessPlanCalculator" className="flex items-center justify-between p-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl transition-all group shadow-lg shadow-emerald-950/20">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Open Calculator</span>
                   <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
              
              {/* Background Decoration */}
              <Leaf size={160} className="absolute -bottom-10 -right-10 text-white/5 rotate-12 pointer-events-none" />
           </motion.div>
        </div>
      </div>
    </main>
  );
}