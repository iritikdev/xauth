"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Gift,
  Zap,
  ShoppingBag,
  Sparkles,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Clock,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/layout/app-header";

export default function DealsPage() {
  return (
    <>
      <AppHeader />
    
    <div className="min-h-screen bg-[#fafbfc] text-zinc-900 pb-20 selection:bg-emerald-500/30">
      
      {/* ══════════════ HERO BANNER SECTION ══════════════ */}
      <section className="relative overflow-hidden bg-[#1c3320] text-white pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Soft Background Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,160,32,0.18),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />

        <div className="container mx-auto px-5 md:px-8 relative z-10 max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <Badge variant="outline" className="border-[#e8a020] text-[#e8a020] bg-[#e8a020]/10 px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 fill-[#e8a020]" />
              Exclusive Partner Rewards
            </Badge>

            <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-tight max-w-3xl font-serif italic">
              Maximize Your Earnings & <span className="text-[#e8a020] not-italic">Distributor Perks</span>
            </h1>

            <p className="text-zinc-300 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
              Unlock consistency shopping vouchers and Buy 1 Get 1 free promotional items designed exclusively to empower your Amaze Ayurveda business.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════ DEALS BENTO GRID CONTAINER ══════════════ */}
      <main className="container mx-auto px-5 md:px-8 -mt-10 relative z-20 max-w-6xl space-y-12">
        
        {/* ───────────────── SCHEME 1: 1/3 CONSISTENCY VOUCHER ───────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="rounded-[32px] border-zinc-200/80 bg-white shadow-xl shadow-zinc-200/50 overflow-hidden">
            
            {/* Top Reward Tag Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-[#1c3320] to-emerald-950 p-6 md:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-[#e8a020] text-[#1c3320] flex items-center justify-center font-black shadow-lg shadow-amber-900/30 shrink-0">
                  <Award size={30} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#e8a020]">
                    Scheme #01 · Monthly Loyalty
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                    1/3 Consistency Purchase Voucher
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs font-bold text-amber-300 self-start md:self-auto">
                <Clock size={16} />
                <span>Cycle: 1st to 15th Every Month</span>
              </div>
            </div>

            <CardContent className="p-6 md:p-10 space-y-8">
              {/* How it Works Rules */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">Purchase Window</h4>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                      Complete your purchase between the <strong className="text-zinc-800">1st and 15th</strong> of the month.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">3 Consecutive Months</h4>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                      Continue for <strong className="text-zinc-800">3 straight months</strong> without skipping any cycle.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shrink-0">
                    <Gift size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950">1/3rd Cashback Voucher</h4>
                    <p className="text-xs text-emerald-800/80 mt-0.5 leading-relaxed">
                      Receive a free product voucher worth <strong>33.3%</strong> of your total 3-month volume!
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Formula & Worked Example Table */}
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50/50 p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                      Calculated Reward Formula
                    </p>
                    <h3 className="text-lg font-black text-zinc-900 mt-0.5">
                      Voucher Value = Total Purchase Amount (3 Months) ÷ 3
                    </h3>
                  </div>

                  <Badge className="bg-[#1c3320] text-emerald-400 border-none px-3 py-1.5 text-xs font-mono font-bold self-start md:self-auto">
                    Redeemable on Eligible Products
                  </Badge>
                </div>

                {/* Example Breakdown Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3 px-2">Month 1 (Jan)</th>
                        <th className="pb-3 px-2">Month 2 (Feb)</th>
                        <th className="pb-3 px-2">Month 3 (Mar)</th>
                        <th className="pb-3 px-2">Total Accumulated</th>
                        <th className="pb-3 px-2 text-right">Free Reward Voucher</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200/60 font-medium">
                      <tr>
                        <td className="py-3 px-2 font-mono font-bold text-zinc-800">₹6,000</td>
                        <td className="py-3 px-2 font-mono font-bold text-zinc-800">₹6,000</td>
                        <td className="py-3 px-2 font-mono font-bold text-zinc-800">₹6,000</td>
                        <td className="py-3 px-2 font-mono font-bold text-zinc-900">₹18,000</td>
                        <td className="py-3 px-2 text-right">
                          <span className="inline-flex items-center gap-1.5 font-mono font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl text-sm">
                            <Sparkles size={12} /> ₹6,000 Voucher
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Link */}
              <div className="flex justify-end">
                <Link href="/shop">
                  <Button className="h-12 px-6 rounded-2xl bg-zinc-900 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-widest gap-2 transition-all">
                    <span>Shop Consistency Products</span>
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ───────────────── SCHEME 2: BUY 1 GET 1 FREE (B1G1) ───────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="rounded-[32px] border-amber-200/80 bg-gradient-to-b from-amber-50/40 to-white shadow-xl shadow-amber-900/5 overflow-hidden">
            
            <div className="p-6 md:p-10 space-y-8">
              
              {/* Header Badges */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-100 pb-6">
                <div>
                  <Badge className="bg-[#e8a020] text-[#1c3320] font-black uppercase tracking-widest text-[9px] mb-2 border-none px-2.5 py-0.5">
                    Distributor Exclusive
                  </Badge>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tight text-zinc-900">
                    Buy 1 Get 1 Free Offer (B1G1)
                  </h2>
                  <p className="text-zinc-500 text-xs md:text-sm font-medium mt-1">
                    Purchase any eligible product at MRP and instantly double your product inventory.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-amber-200 shadow-sm shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                    <Tag size={24} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Offer Ratio</p>
                    <p className="text-lg font-black text-amber-600 font-mono">100% Free Item</p>
                  </div>
                </div>
              </div>

              {/* B1G1 Comparison Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                
                {/* Billing Rules Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-base font-black text-zinc-900 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    How B1G1 Works:
                  </h3>

                  <ul className="space-y-3 text-xs md:text-sm font-medium text-zinc-600">
                    <li className="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border border-zinc-100 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>Distributor buys <strong>1 Product at MRP</strong> (e.g. ₹1,000).</span>
                    </li>
                    <li className="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border border-zinc-100 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>Distributor receives <strong>2 Identical Products</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border border-zinc-100 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>Invoice is generated at Distributor Price (DP) with 2nd product marked as <strong>Promotional Free Item</strong>.</span>
                    </li>
                  </ul>
                </div>

                {/* Billing Visual Card Example */}
                <div className="rounded-3xl bg-zinc-950 text-white p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
                        Sample B1G1 Billing
                      </span>
                      <span className="text-xs font-mono text-zinc-400">Ref: PROMO-B1G1</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Product 1 (At MRP):</span>
                        <span className="font-mono font-bold">₹1,000</span>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span className="font-bold flex items-center gap-1">
                          <Gift size={12} /> Product 2 (Promotional):
                        </span>
                        <span className="font-mono font-bold uppercase">FREE</span>
                      </div>
                      <div className="border-t border-zinc-800 pt-2 flex justify-between text-sm font-black">
                        <span>Total Items Delivered:</span>
                        <span className="text-amber-400 font-mono">2 Units</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={14} className="text-emerald-400" /> GST Billing Included
                    </span>
                    <span className="font-bold text-amber-400">Double Profit Margin</span>
                  </div>
                </div>

              </div>

              {/* CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-100">
                <p className="text-xs text-zinc-500 font-medium text-center sm:text-left">
                  * B1G1 offers are applicable only on selected promotional MRP products.
                </p>

                <Link href="/shop">
                  <Button className="h-12 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase text-xs tracking-widest shadow-lg shadow-amber-500/20 transition-all">
                    Explore B1G1 Items
                  </Button>
                </Link>
              </div>

            </div>
          </Card>
        </motion.div>

      </main>
    </div>
    </>
  );
}