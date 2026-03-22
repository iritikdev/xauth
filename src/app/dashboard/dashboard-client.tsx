"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import { motion } from "framer-motion";
import {
  Trophy, Users, UserCheck, Wallet, Zap, ShieldCheck,
  ArrowRight, TrendingUp, Calendar, Sparkles, Calculator,
  Copy, Check, Share2, Link2, Gift, QrCode,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDateTime, cn } from "@/lib/utils";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

const IconMap: Record<string, LucideIcon> = { Users, UserCheck, Wallet, Trophy };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const, delay },
});

interface DashboardClientProps {
  userData: any;
  stats: { label: string; value: string | number; accent: string; iconName: string }[];
  firstName: string;
}

export function DashboardClient({ userData, stats, firstName }: DashboardClientProps) {
  const [copied, setCopied] = React.useState(false);
  const referralUrl = `https://amazeayurveda.in/sign-up/?ref=${userData.username}`;
  const shareText = `Join me on Amaze Ayurveda and start your wellness journey! Use my referral link to sign up:`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = referralUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Amaze Ayurveda",
          text: shareText,
          url: referralUrl,
        });
      } catch (err) {
        // user cancelled — do nothing
      }
    } else {
      // fallback: copy to clipboard if Web Share not supported
      handleCopy();
    }
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${referralUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(shareText)}`,
    instagram: null, // Instagram has no direct web share URL — use native share
  };
  return (
    <main className="min-h-screen pb-16" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="container mx-auto px-4 md:px-8 py-8 space-y-6 max-w-7xl">

        {/* ── Hero ── */}
        <motion.section {...fadeUp(0)} className="relative overflow-hidden rounded-[2rem] bg-zinc-950">
          {["tl","tr","bl","br"].map((p) => (
            <span key={p} className={cn("absolute h-6 w-6 border-emerald-400/30",
              p==="tl"&&"top-5 left-5 border-t-2 border-l-2 rounded-tl-md",
              p==="tr"&&"top-5 right-5 border-t-2 border-r-2 rounded-tr-md",
              p==="bl"&&"bottom-5 left-5 border-b-2 border-l-2 rounded-bl-md",
              p==="br"&&"bottom-5 right-5 border-b-2 border-r-2 rounded-br-md")} />
          ))}
          <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-emerald-400/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Avatar + name */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-emerald-400/20 shadow-xl">
                  <AvatarImage src={userData.photoUrl} className="object-cover" />
                  <AvatarFallback className="bg-zinc-800 text-emerald-400 font-black text-2xl">{firstName[0]}</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-zinc-950 bg-emerald-400" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-1">Official Associate</p>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                  Hello, {firstName}<span className="text-emerald-400">.</span>
                </h1>
                <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white/50 uppercase tracking-widest">
                    <ShieldCheck size={11} className="text-emerald-400" />{userData.username}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    <Calendar size={11} />Joined {formatDateTime(userData.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Rank card */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 w-full lg:w-72 shrink-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Current Rank</span>
                <Trophy size={14} className="text-emerald-400" />
              </div>
              <p className="text-xl font-black text-emerald-400 mb-4 leading-tight" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                Star Partner
              </p>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                <motion.div initial={{ width: 0 }} animate={{ width: "45%" }} transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
                  className="h-full rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-zinc-600">45% complete</span>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Next: Crown</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = IconMap[s.iconName] || Zap;
            return (
              <motion.div key={s.label} {...fadeUp(0.08 + i * 0.08)}
                className="group relative overflow-hidden rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-200">
                <div className="relative z-10">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-200 group-hover:bg-emerald-50">
                    <Icon size={18} strokeWidth={2} style={{ color: s.accent }} />
                  </div>
                  <p className="text-3xl font-black text-zinc-900 leading-none tracking-tight" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                    {s.value}
                  </p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">{s.label}</p>
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-[0.04] transition-opacity group-hover:opacity-[0.06]">
                  <Icon size={64} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Insights + Tools ── */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Insights */}
          <motion.div {...fadeUp(0.2)} className="lg:col-span-2 rounded-[2rem] border border-zinc-100 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                  <Zap size={13} strokeWidth={2} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">Distributor Insights</h3>
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl bg-emerald-50 border border-emerald-100 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600">Live Sync</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Sponsor", value: userData.sponsor?.name || "Direct Company", icon: Users, sub: userData.sponsor?.username },
                { label: "Self Business", value: `${userData.personalBv || 0} BV`, icon: TrendingUp, sub: "Monthly Points" },
                { label: "Wallet Balance", value: `₹${userData.Wallet?.balance || "0.00"}`, icon: Wallet, sub: "Available to Withdraw" },
                { label: "Account ID", value: userData.username, icon: ShieldCheck, sub: "Verified Associate" },
              ].map((item) => (
                <div key={item.label}
                  className="group flex items-center gap-4 rounded-[1.5rem] border border-zinc-100 bg-zinc-50/50 p-4 hover:bg-white hover:border-emerald-200 hover:shadow-sm transition-all duration-150">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white border border-zinc-200 text-zinc-400 shadow-sm transition-all duration-200 group-hover:border-emerald-200 group-hover:text-emerald-500">
                    <item.icon size={18} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">{item.label}</p>
                    <p className="text-sm font-black text-zinc-900 truncate">{item.value}</p>
                    {item.sub && <p className="text-[9px] font-medium text-zinc-400 mt-0.5">{item.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Business Tools */}
          <motion.div {...fadeUp(0.3)} className="relative overflow-hidden rounded-[2rem] bg-zinc-950 p-7 flex flex-col justify-between">
            {["tl","tr","bl","br"].map((p) => (
              <span key={p} className={cn("absolute h-4 w-4 border-emerald-400/25",
                p==="tl"&&"top-4 left-4 border-t border-l rounded-tl-sm",
                p==="tr"&&"top-4 right-4 border-t border-r rounded-tr-sm",
                p==="bl"&&"bottom-4 left-4 border-b border-l rounded-bl-sm",
                p==="br"&&"bottom-4 right-4 border-b border-r rounded-br-sm")} />
            ))}
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-emerald-400/8 blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                <Calculator size={22} className="text-emerald-400" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Business Tools</p>
                <h3 className="text-2xl font-black text-white leading-tight" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                  Growth Plan<br />Calculator
                </h3>
              </div>
              <p className="text-[11px] font-medium text-zinc-500 leading-relaxed">
                Project your earnings using our interactive 15-level payout structure calculator.
              </p>
            </div>
            <Link href="/dashboard/businessPlanCalculator"
              className="relative z-10 mt-8 flex items-center justify-between rounded-2xl bg-emerald-400 px-5 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950 shadow-lg shadow-emerald-400/20 transition-all hover:bg-emerald-300 group">
              Open Calculator
              <ArrowRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* ── Referral Section ── */}
        <motion.div {...fadeUp(0.32)} className="grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-5">

          {/* Left — link + stats */}
          <div className="rounded-[2rem] border border-zinc-100 bg-white p-7 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                  <Gift size={13} strokeWidth={2} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
                  Refer & Grow
                </h3>
              </div>
              <span className="flex items-center gap-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-emerald-700">
                <Sparkles size={9} strokeWidth={2.5} /> Earn on every join
              </span>
            </div>

            {/* Referral link input */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-2">
                Your Referral Link
              </p>
              <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-1 pl-4">
                <Link2 size={13} className="text-zinc-400 shrink-0" strokeWidth={2} />
                <span className="flex-1 text-[12px] font-medium text-zinc-500 truncate">
                  {referralUrl}
                </span>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-1.5 h-9 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                    copied
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-950 text-white hover:bg-zinc-800"
                  )}
                >
                  {copied ? (
                    <><Check size={12} strokeWidth={2.5} /> Copied</>
                  ) : (
                    <><Copy size={12} strokeWidth={2} /> Copy</>
                  )}
                </button>
              </div>
            </div>

            {/* Share row */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-3">
                Share Via
              </p>
              <div className="flex flex-wrap gap-2">
                {/* WhatsApp */}
                <a
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-[11px] font-bold text-zinc-500 transition-all duration-150 hover:border-green-300 hover:text-green-600 hover:bg-green-50"
                >
                  <Share2 size={11} strokeWidth={2} />
                  WhatsApp
                </a>

                {/* Telegram */}
                <a
                  href={shareLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-[11px] font-bold text-zinc-500 transition-all duration-150 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Share2 size={11} strokeWidth={2} />
                  Telegram
                </a>

                {/* Instagram — native share (no direct URL) */}
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-[11px] font-bold text-zinc-500 transition-all duration-150 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50"
                >
                  <Share2 size={11} strokeWidth={2} />
                  Instagram
                </button>

                {/* More — native share sheet */}
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-[11px] font-bold text-zinc-500 transition-all duration-150 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50"
                >
                  <Share2 size={11} strokeWidth={2} />
                  More
                </button>
              </div>
            </div>

            {/* Referral stats strip */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-zinc-50">
              {[
                { label: "Total Referrals", value: userData.totalReferrals ?? 0 },
                { label: "This Month", value: userData.monthlyReferrals ?? 0 },
                { label: "Referral Earnings", value: `₹${userData.referralEarnings ?? "0.00"}` },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-zinc-50 border border-zinc-100 px-4 py-3 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-1">
                    {item.label}
                  </p>
                  <p
                    className="text-xl font-black text-zinc-900"
                    style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — QR card */}
          <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 p-7 flex flex-col items-center justify-between gap-6">
            {["tl","tr","bl","br"].map((p) => (
              <span key={p} className={cn("absolute h-4 w-4 border-emerald-400/25",
                p==="tl"&&"top-4 left-4 border-t border-l rounded-tl-sm",
                p==="tr"&&"top-4 right-4 border-t border-r rounded-tr-sm",
                p==="bl"&&"bottom-4 left-4 border-b border-l rounded-bl-sm",
                p==="br"&&"bottom-4 right-4 border-b border-r rounded-br-sm")} />
            ))}
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-emerald-400/8 blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center space-y-1">
              <div className="flex items-center justify-center gap-2">
                <QrCode size={13} className="text-emerald-400" strokeWidth={2} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                  Scan to Join
                </p>
              </div>
              <p className="text-[10px] font-medium text-zinc-600">
                Share your QR with prospects
              </p>
            </div>

            {/* QR Code */}
            <div className="relative z-10 rounded-2xl bg-white p-4 shadow-xl">
              <QRCodeSVG
                value={referralUrl}
                size={140}
                bgColor="#ffffff"
                fgColor="#09090b"
                level="M"
              />
            </div>

            <div className="relative z-10 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500 mb-0.5">
                Your Code
              </p>
              <p
                className="text-lg font-black text-emerald-400 tracking-widest"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                {userData.username}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── BV Prestige Banner ── */}
        <motion.div {...fadeUp(0.35)}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-900 p-7">
          <div className="absolute -top-10 right-1/3 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={13} className="text-emerald-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">Personal BV This Month</p>
              </div>
              <p className="text-5xl font-black text-emerald-100 leading-none" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                {userData.personalBv || 0}
                <span className="text-2xl font-black text-emerald-700 ml-2">BV</span>
              </p>
              <p className="text-[11px] font-bold text-emerald-700 mt-2 tracking-wide">Business Value Points accumulated</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              {[
                { label: "Team BV", value: userData.teamBv || "—" },
                { label: "Level", value: userData.rank || "Associate" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-emerald-400/10 border border-emerald-400/20 px-5 py-4 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-600 mb-1">{item.label}</p>
                  <p className="text-xl font-black text-emerald-100">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}