"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Trophy, Users, Wallet, Zap, ShieldCheck,
  UserCheck, Leaf, ArrowRight, Bell, ExternalLink,
  TrendingUp, Calendar,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { formatDateTime, cn } from "@/lib/utils";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { InsightItem } from "@/components/dashboard/InsightItem";

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

/* ── Fade-up helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [userData, setUserData]   = useState<any>(null);
  const [loading,  setLoading]    = useState(true);

  const trainingStatus = useMemo(() => {
    const now     = new Date();
    const isSunday = now.getDay() === 0;
    const hours    = now.getHours();
    return {
      isSunday,
      isLive:      isSunday && hours >= 19 && hours <= 21,
      meetingLink: "https://meet.google.com/your-meeting-id",
    };
  }, []);

  useEffect(() => {
    async function fetchUser() {
      if (!session?.user?.username) return;
      try {
        const res = await fetch(`/api/user/${session.user.username}`);
        if (res.ok) setUserData(await res.json());
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [session?.user?.username]);

  /* ── Loading state ── */
  if (status === "loading" || loading || !userData) {
    return (
      <div
        className="h-screen w-full flex flex-col items-center justify-center gap-5 bg-[#f5f0e8]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-[#1c3320] flex items-center justify-center">
            <Leaf className="w-6 h-6 text-[#e8a020] fill-[#e8a020] animate-pulse" />
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-[#e8a020]/30 animate-ping" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#1c3320]/35">
          Syncing Swadeshi Portal…
        </p>
      </div>
    );
  }

  const firstName = userData.name?.split(" ")[0] ?? "Associate";

  const stats = [
    { label: "Total Team",   value: userData.totalTeam  || "0",             icon: Users,     accent: "#1c6634" },
    { label: "Active Team",  value: userData.activeTeam || "0",             icon: UserCheck, accent: "#e8a020" },
    { label: "Total Payout", value: `₹${userData.totalPayout || "0"}`,      icon: Wallet,    accent: "#c8860a" },
    { label: "Rank",         value: userData.rank        || "Associate",     icon: Trophy,    accent: "#1c3320" },
  ];

  const insights = [
    { label: "Sponsor",        value: userData.sponsor ? `${userData.sponsor.name} (${userData.sponsor.username})` : "Direct", icon: Zap       },
    { label: "PAN Card",       value: userData.panNumber  || "Not Provided",  icon: ShieldCheck },
    { label: "Weekly Payout",  value: "₹0.00",                                icon: Wallet      },
    { label: "Monthly Self BV",value: userData.totalBv    || "0",             icon: TrendingUp  },
  ];

  return (
    <main
      className="min-h-screen bg-[#f5f0e8] pb-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Subtle page-level texture ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4  w-[600px] h-[600px] rounded-full bg-[#e8a020]/5  blur-[140px]" />
        <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full bg-[#1c3320]/4  blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #1c3320 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-8 space-y-6 max-w-7xl">

        {/* ══════════════════════════════════════════
            1. HERO BANNER
        ══════════════════════════════════════════ */}
        <motion.section {...fadeUp(0)} className="relative bg-[#1c3320] rounded-[2rem] overflow-hidden shadow-[0_16px_60px_rgba(28,50,32,0.22)]">

          {/* Decor */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full bg-[#c8860a]/10 blur-[90px]" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-emerald-400/8 blur-[80px]" />
            <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
            <LeafDecor className="absolute top-4 right-10 w-28 text-emerald-300 opacity-30" />
            <LeafDecor className="absolute -bottom-4 left-6 w-20 text-[#c8860a] opacity-20 rotate-[18deg]" />
          </div>

          <div className="relative z-10 p-7 md:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

            {/* ── Left: identity ── */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative flex-shrink-0">
                <Avatar className="h-20 w-20 border-[3px] border-[#e8a020]/30 shadow-[0_0_0_6px_rgba(232,160,32,0.08)]">
                  <AvatarImage src={userData.photoUrl} className="object-cover" />
                  <AvatarFallback className="text-xl font-black bg-[#1c6634] text-[#e8a020]">
                    {userData.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-[#1c3320]" />
              </div>

              <div className="text-center sm:text-left">
                {/* Greeting */}
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#e8a020]/70 mb-0.5">
                  Welcome back
                </p>
                <h1
                  className="text-2xl md:text-3xl font-black text-white leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {firstName}
                  <span className="text-[#e8a020] italic">.</span>
                </h1>
                {/* Meta chips */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2.5">
                  <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">
                      {userData.username}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                    <Calendar className="w-2.5 h-2.5 text-white/30" />
                    <span className="text-[9px] font-medium text-white/30">
                      Joined {formatDateTime(userData.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: rank progress card ── */}
            <div className="w-full lg:w-auto bg-white/5 border border-white/10 rounded-2xl p-6 min-w-[220px] space-y-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/30 mb-1">
                  Upcoming Rank
                </p>
                <h3
                  className="text-xl font-black text-[#e8a020] italic"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Star Partner
                </h3>
              </div>
              {/* Progress track */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[9px] font-bold text-white/25 uppercase tracking-wide">Progress</span>
                  <span className="text-[9px] font-black text-[#e8a020]/70">40%</span>
                </div>
                <div className="w-full bg-white/8 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#e8a020] rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "40%" }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as const, delay: 0.4 }}
                  />
                </div>
              </div>
              <p className="text-[9px] text-white/20 font-medium leading-snug">
                Keep building your network to unlock the next level.
              </p>
            </div>
          </div>

          {/* Gold bottom hairline */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#e8a020]/40 to-transparent" />
        </motion.section>

        {/* ══════════════════════════════════════════
            2. STATS GRID
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              {...fadeUp(0.06 + i * 0.07)}
              className="group bg-white border border-[#1c3320]/6 rounded-2xl p-5 hover:border-[#1c3320]/12 hover:shadow-[0_8px_32px_rgba(28,50,32,0.1)] transition-all duration-300 relative overflow-hidden"
            >
              <LeafDecor className="absolute -bottom-3 -right-2 w-12 text-[#1c3320] opacity-[0.04] pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${s.accent}15` }}
                >
                  <s.icon className="w-4 h-4" style={{ color: s.accent }} />
                </div>
                <div>
                  <p
                    className="text-xl md:text-2xl font-black text-[#1c3320] tracking-tight leading-none"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#1c3320]/35 mt-1">
                    {s.label}
                  </p>
                </div>
                {/* Accent bottom bar */}
                <div
                  className="h-[2px] w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: s.accent }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            3. INSIGHTS + TRAINING  /  SIDEBAR
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Distributor Insights */}
            <motion.div {...fadeUp(0.3)} className="bg-white border border-[#1c3320]/6 rounded-2xl p-7 shadow-[0_2px_16px_rgba(28,50,32,0.05)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#e8a020] mb-0.5">Real-time</p>
                  <h3
                    className="text-lg font-black text-[#1c3320] tracking-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Distributor Insights
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 bg-[#1c3320]/4 border border-[#1c3320]/8 px-3 py-1.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#1c3320]/40">Live</span>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-[#1c3320]/6" />
                <div className="flex gap-1">
                  <div className="h-1 w-1 rounded-full bg-[#e8a020]/30" />
                  <div className="h-1 w-3 rounded-full bg-[#e8a020]/50" />
                  <div className="h-1 w-1 rounded-full bg-[#e8a020]/30" />
                </div>
                <div className="h-px flex-1 bg-[#1c3320]/6" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {insights.map((item, i) => (
                  <div key={item.label} className="flex items-start gap-3 p-4 bg-[#f5f0e8] border border-[#1c3320]/6 rounded-xl hover:border-[#1c3320]/12 transition-all group">
                    <div className="h-8 w-8 rounded-lg bg-[#1c3320]/6 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1c3320]/10 transition-colors">
                      <item.icon className="w-3.5 h-3.5 text-[#e8a020]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#1c3320]/30 mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm font-bold text-[#1c3320] truncate">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Live Training Banner */}
            <motion.div
              {...fadeUp(0.38)}
              className="relative bg-[#1c3320] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(28,50,32,0.18)]"
            >
              {/* Decor */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#e8a020]/10 blur-[70px]" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
                <LeafDecor className="absolute bottom-3 right-5 w-20 text-emerald-300 opacity-20 rotate-6" />
              </div>

              <div className="relative z-10 p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3">
                  {/* Live / scheduled pill */}
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                    {trainingStatus.isLive ? (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                    ) : (
                      <Calendar className="w-2.5 h-2.5 text-white/30" />
                    )}
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-[0.25em]",
                      trainingStatus.isLive ? "text-emerald-400" : "text-white/30"
                    )}>
                      {trainingStatus.isLive ? "Session is Live" : "Every Sunday · 7–9 PM"}
                    </span>
                  </div>

                  <h2
                    className="text-xl md:text-2xl font-black text-white leading-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Master the{" "}
                    <span className="text-[#e8a020] italic">Marketing Strategy</span>
                  </h2>
                  <p className="text-white/40 text-sm font-medium max-w-md">
                    Join our expert-led webinar to learn the official Swadeshi business plan.
                  </p>
                </div>

                <button
                  onClick={() =>
                    trainingStatus.isLive
                      ? window.open(trainingStatus.meetingLink)
                      : toast.info("Reminder set for Sunday!")
                  }
                  className={cn(
                    "flex-shrink-0 inline-flex items-center gap-2 h-12 px-7 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-[0.97] shadow-lg",
                    trainingStatus.isLive
                      ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30"
                      : "bg-[#e8a020] hover:bg-[#d4911a] text-[#1c3320] shadow-[#e8a020]/30"
                  )}
                >
                  {trainingStatus.isLive ? (
                    <><ExternalLink className="w-3.5 h-3.5" /> Join Now</>
                  ) : (
                    <><Bell className="w-3.5 h-3.5" /> Set Reminder</>
                  )}
                </button>
              </div>

              {/* Gold bottom hairline */}
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#e8a020]/30 to-transparent" />
            </motion.div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">

            {/* Growth Tracker */}
            <motion.div {...fadeUp(0.32)} className="bg-white border border-[#1c3320]/6 rounded-2xl p-6 shadow-[0_2px_16px_rgba(28,50,32,0.05)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px flex-1 bg-[#1c3320]/6" />
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#1c3320]/30">Growth Tracker</p>
                <div className="h-px flex-1 bg-[#1c3320]/6" />
              </div>

              <div className="space-y-5">
                {[
                  { label: "Weekly Group BV",  value: "0",                       progress: 5,  accent: "#1c6634" },
                  { label: "Rank Progress",     value: userData.rank || "Associate", progress: 20, accent: "#e8a020" },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#1c3320]/40">{item.label}</span>
                      <span
                        className="text-sm font-black"
                        style={{ color: item.accent }}
                      >
                        {item.value}
                      </span>
                    </div>
                    <div className="w-full bg-[#1c3320]/6 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.accent }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-[9px] text-[#1c3320]/25 font-medium">{item.progress}% to next milestone</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Business Tools card */}
            <motion.div
              {...fadeUp(0.4)}
              className="relative bg-[#1c3320] rounded-2xl p-6 overflow-hidden shadow-[0_8px_32px_rgba(28,50,32,0.18)]"
            >
              {/* Decor */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#e8a020]/10 blur-[60px]" />
                <LeafDecor className="absolute bottom-2 right-3 w-16 text-emerald-400 opacity-15 rotate-6" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#e8a020]/15 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#e8a020]" />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#e8a020]/60 mb-0.5">Tools</p>
                  <h3
                    className="text-lg font-black text-white"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Business Tools
                  </h3>
                  <p className="text-white/35 text-xs mt-1.5 leading-relaxed">
                    Calculate your potential earnings with our official income calculator.
                  </p>
                </div>

                <Link href="/dashboard/businessPlanCalculator" className="block">
                  <button className="w-full h-11 rounded-xl bg-[#e8a020] hover:bg-[#d4911a] text-[#1c3320] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(232,160,32,0.3)] hover:shadow-[0_6px_24px_rgba(232,160,32,0.4)] active:scale-[0.97] transition-all">
                    Plan Calculator
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>

              {/* Gold bottom hairline */}
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#e8a020]/30 to-transparent" />
            </motion.div>

          </div>
        </div>

      </div>
    </main>
  );
}