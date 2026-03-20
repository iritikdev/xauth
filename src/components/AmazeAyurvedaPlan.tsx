'use client';

import React, { useState, useMemo } from 'react';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Calculator, Trophy, Coins, Zap,
  ShieldCheck, ArrowRight, Leaf, TrendingUp,
  Target,
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
  { rank: "Star",             target: 50_000,     level: "L7",  bonus: 2, extraCash: 5_000,     activeRole: 700  },
  { rank: "Super Star",       target: 150_000,    level: "L8",  bonus: 1, extraCash: 15_000,    activeRole: 800  },
  { rank: "Diamond",          target: 250_000,    level: "L9",  bonus: 1, extraCash: 25_000,    activeRole: 900  },
  { rank: "Star Diamond",     target: 500_000,    level: "L10", bonus: 1, extraCash: 50_000,    activeRole: 1000 },
  { rank: "Diplomat",         target: 1_000_000,  level: "L11", bonus: 1, extraCash: 100_000,   activeRole: 1100 },
  { rank: "Star Diplomat",    target: 2_000_000,  level: "L12", bonus: 1, extraCash: 200_000,   activeRole: 1200 },
  { rank: "Diamond Diplomat", target: 4_000_000,  level: "L13", bonus: 1, extraCash: 400_000,   activeRole: 1300 },
  { rank: "Crown Ambassador", target: 7_000_000,  level: "L14", bonus: 1, extraCash: 700_000,   activeRole: 1400 },
  { rank: "Chairman",         target: 10_000_000, level: "L15", bonus: 1, extraCash: 1_000_000, activeRole: 1500 },
];

const baseLevels = [
  { label: "L1 / Direct", bonus: 20, selfPurchase: 100 },
  { label: "L2",          bonus: 10, selfPurchase: 200 },
  { label: "L3",          bonus: 8,  selfPurchase: 300 },
  { label: "L4",          bonus: 6,  selfPurchase: 400 },
  { label: "L5",          bonus: 4,  selfPurchase: 500 },
  { label: "L6",          bonus: 2,  selfPurchase: 600 },
];

const fmt = (n: number) => n.toLocaleString("en-IN");

/* ── Section heading ── */
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1c3320]/35">{children}</span>
    <div className="h-px flex-1 bg-[#1c3320]/8" />
  </div>
);

/* ────────────────────────────────────────────────
   COMPONENT
──────────────────────────────────────────────── */
const AmazeAyurvedaPlan = () => {
  const [purchaseAmount,       setPurchaseAmount]       = useState(1000);
  const [accumulatedBusiness,  setAccumulatedBusiness]  = useState(0);

  const currentRank = useMemo(() =>
    [...rankRewards].reverse().find(r => accumulatedBusiness >= r.target)
    ?? { rank: "Associate", extraCash: 0, target: 0 },
    [accumulatedBusiness]
  );
  const nextRank = rankRewards.find(r => accumulatedBusiness < r.target);
  const progress = nextRank ? Math.min((accumulatedBusiness / nextRank.target) * 100, 100) : 100;

  const directCommission = purchaseAmount * 0.2;

  return (
    <div
      className="min-h-screen bg-[#f5f0e8] pb-20"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Page texture ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-[#e8a020]/5 blur-[140px]" />
        <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full bg-[#1c3320]/4 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #1c3320 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-8">

        {/* ══════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════ */}
        <div className="relative bg-[#1c3320] rounded-[2rem] overflow-hidden shadow-[0_16px_60px_rgba(28,50,32,0.22)]">
          {/* Decor */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#c8860a]/10 blur-[80px]" />
            <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
            <LeafDecor className="absolute top-4 right-10 w-28 text-emerald-300 opacity-30" />
            <LeafDecor className="absolute -bottom-2 left-8 w-20 text-[#c8860a] opacity-20 rotate-[18deg]" />
          </div>

          <div className="relative z-10 px-8 py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full mb-3">
                <Leaf className="w-3 h-3 text-[#e8a020] fill-[#e8a020]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#e8a020]/75">Business Calculator</span>
              </div>
              <h1
                className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Amaze <span className="text-[#e8a020] italic">Ayurveda</span>
              </h1>
              <p className="text-white/35 text-xs font-medium uppercase tracking-widest mt-1">
                Business Growth & Reward Engine
              </p>
            </div>

            {/* Current rank badge */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 min-w-[200px]">
              <div className="w-10 h-10 rounded-xl bg-[#e8a020]/15 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-[#e8a020]" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30 mb-0.5">Current Rank</p>
                <p
                  className="text-lg font-black text-[#e8a020] leading-none"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {currentRank.rank}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#e8a020]/40 to-transparent" />
        </div>

        {/* ══════════════════════════════════════════
            MAIN GRID
        ══════════════════════════════════════════ */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ────────────────────────────────
              LEFT  — inputs
          ──────────────────────────────── */}
          <div className="lg:col-span-1 space-y-5">

            {/* Estimator card */}
            <div className="relative bg-[#1c3320] rounded-[1.75rem] overflow-hidden shadow-[0_8px_32px_rgba(28,50,32,0.2)]">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#e8a020]/10 blur-[60px]" />
                <LeafDecor className="absolute bottom-4 right-4 w-16 text-emerald-400 opacity-15 rotate-6" />
              </div>

              <div className="relative z-10 p-6 space-y-6">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#e8a020]/70 mb-0.5">Earnings Estimator</p>
                  <h2
                    className="text-lg font-black text-white"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Order Amount
                  </h2>
                </div>

                {/* Amount input */}
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm font-black">₹</div>
                  <input
                    type="number"
                    value={purchaseAmount}
                    onChange={e => setPurchaseAmount(Number(e.target.value))}
                    className="w-full h-12 pl-8 pr-12 rounded-xl bg-white/8 border border-white/12 text-white font-black text-lg focus:outline-none focus:border-[#e8a020]/40 focus:ring-2 focus:ring-[#e8a020]/10 transition-all"
                  />
                  <Coins className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                </div>

                {/* Slider */}
                <Slider
                  value={[purchaseAmount]}
                  max={10000}
                  step={100}
                  onValueChange={v => setPurchaseAmount(v[0])}
                  className="[&_[role=slider]]:bg-[#e8a020] [&_[role=slider]]:border-[#e8a020] [&_.bg-primary]:bg-[#e8a020]"
                />

                {/* Commission result */}
                <div className="border-t border-white/8 pt-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#e8a020]/60 mb-1">
                    Direct Commission (L1 · 20%)
                  </p>
                  <p
                    className="text-4xl font-black text-white leading-none"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    ₹{fmt(directCommission)}
                  </p>
                  <p className="text-[10px] text-white/25 font-medium mt-1">on ₹{fmt(purchaseAmount)} order</p>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#e8a020]/30 to-transparent" />
            </div>

            {/* Rank progress card */}
            <div className="bg-white border border-[#1c3320]/6 rounded-[1.75rem] p-6 shadow-[0_4px_24px_rgba(28,50,32,0.07)] space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1c3320]/6 flex items-center justify-center">
                  <Target className="w-4 h-4 text-[#e8a020]" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#e8a020] mb-0">Rank Progress</p>
                  <h3
                    className="text-base font-black text-[#1c3320] leading-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Team Business BV
                  </h3>
                </div>
              </div>

              {/* Input */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1c3320]/30 text-sm font-black">₹</div>
                <input
                  type="number"
                  placeholder="Enter team business total…"
                  onChange={e => setAccumulatedBusiness(Number(e.target.value))}
                  className="w-full h-11 pl-8 pr-4 rounded-xl bg-[#f5f0e8] border border-[#1c3320]/10 text-[#1c3320] font-bold text-sm focus:outline-none focus:border-[#e8a020]/40 focus:ring-2 focus:ring-[#e8a020]/10 transition-all placeholder:text-[#1c3320]/25"
                />
              </div>

              {/* Progress bar */}
              {nextRank && (
                <div className="space-y-2.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#1c3320]/40">
                      Next: {nextRank.rank}
                    </span>
                    <span className="text-[10px] font-black text-[#1c3320]/55">
                      ₹{fmt(nextRank.target)}
                    </span>
                  </div>
                  <div className="w-full bg-[#1c3320]/6 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#e8a020] rounded-full transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-[#1c3320]/30 font-medium">{progress.toFixed(1)}% to next milestone</p>

                  {/* Reward hint */}
                  <div className="flex items-center gap-3 bg-[#e8a020]/8 border border-[#e8a020]/20 rounded-xl px-3.5 py-3">
                    <Zap className="w-4 h-4 text-[#e8a020] flex-shrink-0 fill-[#e8a020]" />
                    <p className="text-[10px] font-bold text-[#1c3320]/65 leading-snug">
                      Unlock <span className="font-black text-[#c8860a]">₹{fmt(nextRank.extraCash)}</span> Extra Cash at {nextRank.rank}!
                    </p>
                  </div>
                </div>
              )}

              {/* Summary chips */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-[#f5f0e8] border border-[#1c3320]/6 rounded-xl p-3">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-[#1c3320]/30 mb-0.5">Extra Cash</p>
                  <p className="text-base font-black text-[#c8860a]">₹{fmt(currentRank.extraCash ?? 0)}</p>
                </div>
                <div className="bg-[#f5f0e8] border border-[#1c3320]/6 rounded-xl p-3">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-[#1c3320]/30 mb-0.5">Self Req.</p>
                  <p className="text-base font-black text-[#1c3320]">₹100</p>
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────
              RIGHT  — payout table
          ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Table card */}
            <div className="bg-white border border-[#1c3320]/6 rounded-[1.75rem] overflow-hidden shadow-[0_4px_24px_rgba(28,50,32,0.07)]">

              {/* Table header strip */}
              <div className="relative bg-[#1c3320] px-6 py-4 flex items-center justify-between overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#e8a020]/10 blur-[50px]" />
                  <LeafDecor className="absolute top-0 right-16 w-10 text-emerald-300 opacity-20" />
                </div>
                <div className="relative z-10 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#e8a020]" />
                  <span
                    className="text-sm font-black text-white"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Full Payout Structure
                  </span>
                </div>
                <div className="relative z-10 inline-flex items-center gap-1.5 bg-[#e8a020]/15 border border-[#e8a020]/25 px-2.5 py-1 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e8a020]" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#e8a020]">15 Levels Active</span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f5f0e8] border-b border-[#1c3320]/6">
                      {["Level / Rank", "Bonus %", "Self Purchase", "Your Payout"].map(h => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-[0.22em] text-[#1c3320]/35 last:text-right"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>

                    {/* ── Base levels ── */}
                    {baseLevels.map((l, i) => (
                      <tr
                        key={l.label}
                        className="group border-b border-[#1c3320]/4 hover:bg-[#f5f0e8]/60 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <span className="text-[11px] font-black text-[#1c3320] uppercase tracking-wide">{l.label}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 bg-[#1c6634]/10 border border-[#1c6634]/15 text-[#1c6634] text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full">
                            {l.bonus}%
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-[11px] font-bold text-[#1c3320]/40 font-mono">₹{fmt(l.selfPurchase)}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="text-sm font-black text-[#1c3320]">
                            ₹{(purchaseAmount * l.bonus / 100).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* ── Separator ── */}
                    <tr>
                      <td colSpan={4} className="px-5 py-2 bg-[#f5f0e8]">
                        <div className="flex items-center gap-2">
                          <div className="h-px flex-1 bg-[#1c3320]/8" />
                          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#e8a020]/70 flex items-center gap-1">
                            <Trophy className="w-2.5 h-2.5" /> Rank Bonuses
                          </span>
                          <div className="h-px flex-1 bg-[#1c3320]/8" />
                        </div>
                      </td>
                    </tr>

                    {/* ── Rank levels ── */}
                    {rankRewards.map((r) => {
                      const unlocked = accumulatedBusiness >= r.target;
                      return (
                        <tr
                          key={r.rank}
                          className={cn(
                            "group border-b border-[#1c3320]/4 transition-colors",
                            unlocked
                              ? "bg-[#e8a020]/4 hover:bg-[#e8a020]/7"
                              : "opacity-45 hover:opacity-60 hover:bg-[#f5f0e8]/40"
                          )}
                        >
                          <td className="px-5 py-3">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5">
                                {unlocked && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#e8a020] flex-shrink-0" />
                                )}
                                <span className="text-[11px] font-black text-[#1c3320] uppercase tracking-wide">
                                  {r.level} → {r.rank}
                                </span>
                              </div>
                              <span className="text-[9px] font-bold text-[#1c3320]/30 uppercase tracking-wider pl-3">
                                Target ₹{r.target >= 1_000_000 ? (r.target / 1_000_000) + "M" : (r.target / 1_000) + "K"}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className="inline-flex items-center bg-[#c8860a]/10 border border-[#c8860a]/20 text-[#c8860a] text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                              {r.bonus}%
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-[11px] font-bold text-[#1c3320]/35 font-mono">₹{fmt(r.activeRole)}</span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <span className={cn("text-sm font-black", unlocked ? "text-[#c8860a]" : "text-[#1c3320]/40")}>
                              ₹{(purchaseAmount * r.bonus / 100).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div className="px-6 py-4 bg-[#f5f0e8] border-t border-[#1c3320]/6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#e8a020]" />
                  <span className="text-[9px] font-bold text-[#1c3320]/35 uppercase tracking-wider">Unlocked ranks glow saffron</span>
                </div>
                <div className="h-3 w-px bg-[#1c3320]/10 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-3 h-3 text-[#1c6634] fill-[#1c6634]/30" />
                  <span className="text-[9px] font-bold text-[#1c3320]/35 uppercase tracking-wider">Payout based on ₹{fmt(purchaseAmount)} order</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AmazeAyurvedaPlan;