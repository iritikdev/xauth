'use client';

import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Trophy, Coins, Zap, Target, ShieldCheck, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Botanical leaf SVG ── */
const LeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15"/>
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    <path d="M60 60 C40 50 25 55 15 70" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    <path d="M60 90 C80 78 95 82 105 95" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
  </svg>
);

/* ── Data ── */
const rankRewards = [
  { rank: "Star",             target: 50_000,    level: "L7",  bonus: 2, extraCash: 5_000,    activeRole: 700  },
  { rank: "Super Star",       target: 150_000,   level: "L8",  bonus: 1, extraCash: 15_000,   activeRole: 800  },
  { rank: "Diamond",          target: 250_000,   level: "L9",  bonus: 1, extraCash: 25_000,   activeRole: 900  },
  { rank: "Star Diamond",     target: 500_000,   level: "L10", bonus: 1, extraCash: 50_000,   activeRole: 1000 },
  { rank: "Diplomat",         target: 1_000_000, level: "L11", bonus: 1, extraCash: 100_000,  activeRole: 1100 },
  { rank: "Star Diplomat",    target: 2_000_000, level: "L12", bonus: 1, extraCash: 200_000,  activeRole: 1200 },
  { rank: "Diamond Diplomat", target: 4_000_000, level: "L13", bonus: 1, extraCash: 400_000,  activeRole: 1300 },
  { rank: "Crown Ambassador", target: 7_000_000, level: "L14", bonus: 1, extraCash: 700_000,  activeRole: 1400 },
  { rank: "Chairman",         target: 10_000_000,level: "L15", bonus: 1, extraCash: 1_000_000,activeRole: 1500 },
];

const baseLevels = [
  { label: "L1 / Direct", bonus: 20, selfPurchase: 100 },
  { label: "L2",           bonus: 10, selfPurchase: 200 },
  { label: "L3",           bonus: 8,  selfPurchase: 300 },
  { label: "L4",           bonus: 6,  selfPurchase: 400 },
  { label: "L5",           bonus: 4,  selfPurchase: 500 },
  { label: "L6",           bonus: 2,  selfPurchase: 600 },
];

const fmt = (n: number, decimals = 0) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/* ── Stat tile ── */
const StatTile = ({ label, value, icon: Icon, accent = "emerald" }: {
  label: string; value: string; icon: React.ElementType; accent?: string;
}) => (
  <div className="flex items-center justify-between gap-3 bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm">
    <div className="min-w-0">
      <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-zinc-400 truncate">{label}</p>
      <p
        className="text-lg font-black text-zinc-900 mt-0.5"
        style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
      >
        {value}
      </p>
    </div>
    <div className={cn(
      "h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0",
      accent === "emerald" ? "bg-emerald-50 border border-emerald-100" : "bg-zinc-100"
    )}>
      <Icon className={cn("w-4 h-4", accent === "emerald" ? "text-emerald-600" : "text-zinc-500")} />
    </div>
  </div>
);

/* ── Section divider ── */
const SectionDivider = ({ label }: { label: string }) => (
  <tr>
    <td colSpan={4} className="px-4 sm:px-5 py-2 bg-zinc-50/80">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400 whitespace-nowrap">{label}</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>
    </td>
  </tr>
);

/* ── Dark card wrapper ── */
const DarkCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "relative bg-zinc-950 rounded-[1.75rem] overflow-hidden shadow-xl",
    className
  )}>
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-400/8 blur-[60px]" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }}
      />
      <LeafDecor className="absolute bottom-2 right-3 w-14 text-emerald-400 opacity-10 rotate-6" />
    </div>
    {/* corner marks */}
    {(["tl","tr","bl","br"] as const).map((p) => (
      <span key={p} className={cn(
        "absolute h-5 w-5 border-emerald-400/25",
        p==="tl" && "top-4 left-4 border-t border-l rounded-tl",
        p==="tr" && "top-4 right-4 border-t border-r rounded-tr",
        p==="bl" && "bottom-4 left-4 border-b border-l rounded-bl",
        p==="br" && "bottom-4 right-4 border-b border-r rounded-br",
      )} />
    ))}
    <div className="relative z-10">{children}</div>
    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
  </div>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const PlanCalculator = () => {
  const [purchase, setPurchase] = useState(1000);
  const [business, setBusiness] = useState(0);

  const currentRank = useMemo(() =>
    [...rankRewards].reverse().find(r => business >= r.target) ?? { rank: "Associate", extraCash: 0 },
    [business]
  );
  const nextRank = rankRewards.find(r => business < r.target);
  const progress = nextRank ? Math.min((business / nextRank.target) * 100, 100) : 100;

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* bg texture */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-400/5 blur-[140px]" />
        <div className="absolute -bottom-40 right-0 w-[450px] h-[450px] rounded-full bg-zinc-900/4 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle,#09090b 1px,transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <LeafDecor className="absolute top-10 right-8 w-32 text-emerald-800 opacity-[0.04]" />
        <LeafDecor className="absolute bottom-16 left-4 w-20 text-emerald-600 opacity-[0.05] rotate-[18deg]" />
      </div>

      <div className="relative z-10  space-y-6">

        {/* ══ HEADER ══ */}
        <DarkCard>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-6 sm:p-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <Leaf size={11} className="text-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400/80">
                  Business Plan
                </span>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-black text-white leading-none"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                Amaze <span className="text-emerald-400">Ayurveda</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                Growth & Reward Engine
              </p>
            </div>

            <div className="flex-shrink-0 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center min-w-[150px] w-full sm:w-auto">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-emerald-400/60 mb-1">
                Current Rank
              </p>
              <p
                className="text-xl font-black text-emerald-400"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                {currentRank.rank}
              </p>
              <div className="flex items-center justify-center gap-1 mt-1.5">
                <Trophy size={11} className="text-white/20" />
                <span className="text-[8px] text-white/20 uppercase tracking-wide">
                  {currentRank.rank === "Associate" ? "Start earning" : "Achieved"}
                </span>
              </div>
            </div>
          </div>
        </DarkCard>

        {/* ══ MAIN GRID ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── LEFT ── */}
          <div className="lg:col-span-1 space-y-5">

            {/* Estimator */}
            <DarkCard>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400/65 mb-0.5">
                    Estimator
                  </p>
                  <h3
                    className="text-base font-black text-white"
                    style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                  >
                    Earnings Calculator
                  </h3>
                </div>
                <div className="h-px bg-white/8" />

                <div className="space-y-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                    Order Amount (₹)
                  </p>
                  <div className="relative">
                    <Input
                      type="number"
                      value={purchase}
                      onChange={e => setPurchase(Number(e.target.value))}
                      className="h-11 rounded-xl bg-white/8 border border-white/10 text-white font-bold text-base placeholder:text-white/20 focus-visible:border-emerald-400/40 focus-visible:ring-0 pr-10"
                    />
                    <Coins size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400/45" />
                  </div>
                  <Slider
                    value={[purchase]} max={10000} step={100}
                    onValueChange={v => setPurchase(v[0])}
                    className="[&>span:first-child]:bg-white/12 [&>span:first-child>span]:bg-emerald-400"
                  />
                  <div className="flex justify-between text-[9px] font-medium text-zinc-600">
                    <span>₹0</span><span>₹10,000</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/8 rounded-xl p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-400/60 mb-1">
                    L1 · Direct · 20%
                  </p>
                  <p
                    className="text-3xl font-black text-white"
                    style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                  >
                    ₹{fmt(purchase * 0.2)}
                  </p>
                </div>
              </div>
            </DarkCard>

            {/* Rank tracker */}
            <div className="bg-white border border-zinc-100 rounded-[1.75rem] p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Target size={15} className="text-emerald-600" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-emerald-600">
                    Tracker
                  </p>
                  <h3
                    className="text-sm font-black text-zinc-900"
                    style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                  >
                    Rank Progress
                  </h3>
                </div>
              </div>

              <div className="h-px bg-zinc-100" />

              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Cumulative Team Business (₹)
                </p>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  onChange={e => setBusiness(Number(e.target.value))}
                  className="h-10 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 font-bold focus-visible:border-emerald-400/50 focus-visible:ring-2 focus-visible:ring-emerald-400/20 placeholder:text-zinc-300"
                />
              </div>

              {nextRank ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold text-zinc-400">→ {nextRank.rank}</span>
                    <span className="text-[10px] font-black text-emerald-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-medium text-zinc-400">
                    <span>₹{fmt(business)}</span>
                    <span>₹{fmt(nextRank.target)}</span>
                  </div>
                  <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                    <Zap size={13} className="text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <p className="text-[10px] font-bold text-zinc-500 leading-relaxed">
                      Unlock{" "}
                      <span className="font-black text-zinc-900">₹{fmt(nextRank.extraCash)}</span>
                      {" "}Extra Cash at{" "}
                      <span className="font-black text-zinc-900">{nextRank.rank}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 space-y-1">
                  <Trophy size={26} className="text-emerald-500 mx-auto" />
                  <p className="text-sm font-black text-zinc-900">Max Rank Achieved!</p>
                </div>
              )}
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-2 gap-3">
              <StatTile
                label="Extra Cash"
                value={`₹${fmt(currentRank.extraCash ?? 0)}`}
                icon={Coins}
                accent="emerald"
              />
              <StatTile
                label="Self Reqmt."
                value="₹100"
                icon={ShieldCheck}
                accent="zinc"
              />
            </div>
          </div>

          {/* ── RIGHT — Table ── */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-zinc-100 rounded-[1.75rem] overflow-hidden shadow-sm flex flex-col">

              {/* Table header */}
              <div className="relative bg-zinc-950 px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-hidden flex-shrink-0">
                <div
                  className="absolute inset-0 opacity-[0.025]"
                  style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }}
                />
                <div className="relative z-10 flex items-center gap-2">
                  <ShieldCheck size={13} className="text-emerald-400" strokeWidth={2} />
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white">
                    Full Payout Structure
                  </span>
                </div>
                <div className="relative z-10 inline-flex items-center gap-1.5 bg-emerald-400 px-3 py-1 rounded-full self-start sm:self-auto">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-950">
                    15 Levels Active
                  </span>
                </div>
              </div>

              {/* Scrollable table */}
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm" style={{ minWidth: "440px" }}>
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50/80">
                      {[
                        { label: "Level / Rank",              align: "left"  },
                        { label: "Bonus",                     align: "left"  },
                        { label: "Self Purch.",               align: "left"  },
                        { label: `Payout @ ₹${fmt(purchase)}`, align: "right" },
                      ].map(h => (
                        <th
                          key={h.label}
                          className={cn(
                            "px-4 sm:px-5 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 whitespace-nowrap",
                            h.align === "right" ? "text-right" : "text-left"
                          )}
                        >
                          {h.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">

                    <SectionDivider label="Base Levels" />

                    {baseLevels.map(l => (
                      <tr key={l.label} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="px-4 sm:px-5 py-3 font-bold text-zinc-900 text-sm whitespace-nowrap">
                          {l.label}
                        </td>
                        <td className="px-4 sm:px-5 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-700">
                            {l.bonus}%
                          </span>
                        </td>
                        <td className="px-4 sm:px-5 py-3 text-[11px] font-mono font-bold text-zinc-400">
                          ₹{l.selfPurchase}
                        </td>
                        <td className="px-4 sm:px-5 py-3 text-right font-black text-zinc-900">
                          ₹{fmt(purchase * l.bonus / 100, 2)}
                        </td>
                      </tr>
                    ))}

                    <SectionDivider label="Rank Bonus Levels" />

                    {rankRewards.map(r => {
                      const unlocked = business >= r.target;
                      return (
                        <tr
                          key={r.rank}
                          className={cn(
                            "transition-colors",
                            unlocked
                              ? "bg-emerald-50/50 hover:bg-emerald-50"
                              : "opacity-40 hover:opacity-60"
                          )}
                        >
                          <td className="px-4 sm:px-5 py-3">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5">
                                {unlocked && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                )}
                                <span className="text-sm font-bold text-zinc-900 whitespace-nowrap">
                                  {r.level} → {r.rank}
                                </span>
                              </div>
                              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">
                                ₹{fmt(r.target / 1000)}K target
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-5 py-3">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black border",
                              unlocked
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-zinc-50 border-zinc-200 text-zinc-400"
                            )}>
                              {r.bonus}%
                            </span>
                          </td>
                          <td className="px-4 sm:px-5 py-3 text-[11px] font-mono font-bold text-zinc-400">
                            ₹{r.activeRole}
                          </td>
                          <td className="px-4 sm:px-5 py-3 text-right font-black text-zinc-900">
                            ₹{fmt(purchase * r.bonus / 100, 2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div className="px-5 sm:px-6 py-3 border-t border-zinc-100 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Leaf size={11} className="text-emerald-500" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    15-Level Generation Plan
                  </span>
                </div>
                <span className="text-[9px] text-zinc-400 font-medium">
                  Based on ₹{fmt(purchase)} order
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCalculator;