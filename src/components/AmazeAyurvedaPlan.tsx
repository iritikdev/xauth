'use client';

import React, { useState, useMemo } from 'react';
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import {
  Trophy, Coins, Zap,
  ShieldCheck, Leaf, 
  Target, ChevronRight
} from "lucide-react";

/* ── Botanical leaf SVG ── */
const LeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15"/>
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    <path d="M60 60 C40 50 25 55 15 70" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    <path d="M60 90 C80 78 95 82 105 95" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    <path d="M60 120 C42 110 30 115 22 128" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
  </svg>
);

/* ── Data ── */
const rankRewards = [
  { rank: "Star", target: 50_000, level: "L7", bonus: 2, extraCash: 5_000, activeRole: 700 },
  { rank: "Super Star", target: 150_000, level: "L8", bonus: 1, extraCash: 15_000, activeRole: 800 },
  { rank: "Diamond", target: 250_000, level: "L9", bonus: 1, extraCash: 25_000, activeRole: 900 },
  { rank: "Star Diamond", target: 500_000, level: "L10", bonus: 1, extraCash: 50_000, activeRole: 1000 },
  { rank: "Diplomat", target: 1_000_000, level: "L11", bonus: 1, extraCash: 100_000, activeRole: 1100 },
  { rank: "Star Diplomat", target: 2_000_000, level: "L12", bonus: 1, extraCash: 200_000, activeRole: 1200 },
  { rank: "Diamond Diplomat", target: 4_000_000, level: "L13", bonus: 1, extraCash: 400_000, activeRole: 1300 },
  { rank: "Crown Ambassador", target: 7_000_000, level: "L14", bonus: 1, extraCash: 700_000, activeRole: 1400 },
  { rank: "Chairman", target: 10_000_000, level: "L15", bonus: 1, extraCash: 1_000_000, activeRole: 1500 },
];

const baseLevels = [
  { label: "L1 / Direct", bonus: 20, selfPurchase: 100 },
  { label: "L2", bonus: 10, selfPurchase: 200 },
  { label: "L3", bonus: 8, selfPurchase: 300 },
  { label: "L4", bonus: 6, selfPurchase: 400 },
  { label: "L5", bonus: 4, selfPurchase: 500 },
  { label: "L6", bonus: 2, selfPurchase: 600 },
];

const fmt = (n: number) => n.toLocaleString("en-IN");

const AmazeAyurvedaPlan = () => {
  const [purchaseAmount, setPurchaseAmount] = useState(1000);
  const [accumulatedBusiness, setAccumulatedBusiness] = useState(0);

  const currentRank = useMemo(() =>
    [...rankRewards].reverse().find(r => accumulatedBusiness >= r.target)
    ?? { rank: "Associate", extraCash: 0, target: 0 },
    [accumulatedBusiness]
  );

  const nextRank = rankRewards.find(r => accumulatedBusiness < r.target);
  const progress = nextRank ? Math.min((accumulatedBusiness / nextRank.target) * 100, 100) : 100;
  const directCommission = purchaseAmount * 0.2;

  return (
    <div className="min-h-screen bg-[#f5f0e8] pb-10 md:pb-20 font-sans selection:bg-emerald-200">
      
      {/* ── Background Texture ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6 md:space-y-8">

        {/* ── Header ── */}
        <header className="relative bg-[#1c3320] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <LeafDecor className="absolute -top-10 -right-10 w-40 text-emerald-300" />
          </div>
          
          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row gap-6 justify-between items-center text-center md:text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <Leaf className="w-3 h-3 text-[#e8a020]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Business Hub</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic uppercase">
                Amaze <span className="text-[#e8a020]">Ayurveda</span>
              </h1>
              <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Transforming Health & Wealth</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-3xl min-w-[220px] shadow-inner">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#e8a020]/20 flex items-center justify-center">
                  <Trophy className="text-[#e8a020] h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Active Rank</p>
                  <p className="text-xl font-black text-[#e8a020] italic uppercase">{currentRank.rank}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN: Tools */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Amount Calculator */}
            <div className="bg-[#1c3320] p-6 md:p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Commission Estimator</p>
                  <h2 className="text-2xl font-black italic tracking-tight">Set Order Value</h2>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-black">₹</span>
                    <input 
                      type="number"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 h-14 pl-10 pr-4 rounded-2xl font-black text-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                    />
                  </div>
                  <Slider 
                    value={[purchaseAmount]} 
                    max={10000} 
                    step={100} 
                    onValueChange={(v) => setPurchaseAmount(v[0])}
                    className="py-4"
                  />
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Direct Payout (20%)</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tighter text-[#e8a020]">₹{fmt(directCommission)}</span>
                    <span className="text-xs text-white/30 font-bold uppercase tracking-widest">Expected</span>
                  </div>
                </div>
              </div>
              <Coins className="absolute -bottom-10 -right-10 h-32 w-32 text-white/5 rotate-12" />
            </div>

            {/* Target Progress */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-lg space-y-6">
              <div className="flex items-center gap-3">
                <Target className="text-emerald-600 h-5 w-5" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Team Business Target</h3>
              </div>

              <div className="space-y-2">
                 <input 
                    type="number"
                    placeholder="Enter Team BV Business..."
                    onChange={(e) => setAccumulatedBusiness(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 h-12 px-4 rounded-xl font-bold text-sm outline-none focus:border-emerald-500 transition-all"
                 />
              </div>

              {nextRank && (
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>{nextRank.rank} Goal</span>
                    <span className="text-emerald-600">₹{fmt(nextRank.target)}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                    <Zap className="h-5 w-5 text-emerald-600 fill-emerald-600 animate-pulse" />
                    <p className="text-[10px] font-black text-emerald-800 leading-tight uppercase">
                      Bonus: Reach target for <span className="text-emerald-600 italic">₹{fmt(nextRank.extraCash)}</span> Cash Reward!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Payout Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Incentive Roadmap</span>
                </div>
                <Badge className="bg-emerald-600 text-[9px] font-black tracking-widest">15 LEVELS</Badge>
              </div>

              {/* Table wrapper for mobile scroll */}
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Rank/Level</th>
                      <th className="text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Rate</th>
                      <th className="text-center px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Self Req.</th>
                      <th className="text-right px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Payout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {/* Level 1-6 */}
                    {baseLevels.map((l) => (
                      <tr key={l.label} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-xs font-black text-slate-700 uppercase">{l.label}</td>
                        <td className="px-6 py-4"><span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-md">{l.bonus}%</span></td>
                        <td className="px-6 py-4 text-center font-mono text-[10px] text-slate-400 font-bold">₹{l.selfPurchase}</td>
                        <td className="px-6 py-4 text-right font-black text-slate-900">₹{(purchaseAmount * (l.bonus/100)).toFixed(2)}</td>
                      </tr>
                    ))}
                    
                    {/* Rank Levels L7-L15 */}
                    {rankRewards.map((r) => {
                      const isUnlocked = accumulatedBusiness >= r.target;
                      return (
                        <tr key={r.rank} className={cn(
                          "transition-all duration-300",
                          isUnlocked ? "bg-emerald-50/40" : "opacity-40 grayscale-[0.5]"
                        )}>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-800 uppercase italic flex items-center gap-1">
                                {r.level} <ChevronRight size={10} className="text-slate-300" /> {r.rank}
                              </span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Goal: {fmt(r.target)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4"><span className="bg-orange-50 text-orange-600 text-[10px] font-black px-2 py-1 rounded-md">{r.bonus}%</span></td>
                          <td className="px-6 py-4 text-center font-mono text-[10px] text-slate-400 font-bold italic">₹{r.activeRole}</td>
                          <td className="px-6 py-4 text-right font-black text-emerald-700">₹{(purchaseAmount * (r.bonus/100)).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active payouts are highlighted in emerald</span>
                 </div>
                 <p className="text-[9px] font-black text-slate-300 uppercase italic">© Amaze Ayurveda 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("px-2 py-1 rounded-md text-white font-bold", className)}>
        {children}
    </div>
);

export default AmazeAyurvedaPlan;