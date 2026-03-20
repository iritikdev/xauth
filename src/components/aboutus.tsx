"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users, Globe, Leaf, Award,
  ShieldCheck, Target, Zap, ArrowRight,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────── Shared decorative SVGs ─────────────────────── */
const LeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15" />
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
  </svg>
);

const QuoteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-3c0-1.105.895-2 2-2h3c.552 0 1-.448 1-1V9a1 1 0 00-1-1h-4a1 1 0 00-1 1v3a1 1 0 01-1 1h-2v8h3zM5.017 21v-3c0-1.105.895-2 2-2h3c.552 0 1-.448 1-1V9a1 1 0 00-1-1h-4a1 1 0 00-1 1v3a1 1 0 01-1 1h-2v8h3z" />
  </svg>
);

/* ─────────────────────── Animation helpers ─────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, delay },
});

/* ─────────────────────── Data ─────────────────────── */
const stats = [
  { label: "Community Members", value: "1M+",  icon: Users  },
  { label: "States Reached",    value: "28+",  icon: Globe  },
  { label: "Ayush Products",    value: "150+", icon: Leaf   },
  { label: "Years of Trust",    value: "5+",   icon: Award  },
];

const pillars = ["Financial Freedom", "Confidence", "Personal Growth", "Wellness First"];

const products = [
  {
    title: "SlimExpert",
    icon: Target,
    accent: "#1c6634",
    desc: "Smart, sustainable health and fitness. Making wellness simple and achievable for every body.",
    points: ["Natural Detox", "Weight Management", "Pure Herbs"],
  },
  {
    title: "Josh Vital",
    icon: Zap,
    accent: "#c8860a",
    desc: "Timeless Ayurvedic power for modern stamina, boosting energy and overall vitality daily.",
    points: ["Instant Energy", "Stress Relief", "Immunity Boost"],
  },
];

const AboutUsPage = () => (
  <div className="bg-[#f5f0e8] min-h-screen selection:bg-[#e8a020]/20 selection:text-[#1c3320] font-sans">

    {/* HERO SECTION */}
    <section className="relative pt-36 pb-52 overflow-hidden bg-[#1c3320]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#c8860a]/10 blur-[130px]" />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-emerald-400/8 blur-[110px]" />
        <LeafDecor className="absolute top-10 right-14 w-36 text-emerald-300 opacity-50" />
        <LeafDecor className="absolute bottom-12 left-8 w-24 text-[#c8860a] opacity-40 rotate-[18deg]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <motion.div className="max-w-4xl space-y-7">
          <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <Leaf className="w-3.5 h-3.5 text-[#e8a020] fill-[#e8a020]" />
            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#e8a020]">The Swadeshi Legacy</span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter text-white italic uppercase">
            Growing with<br />
            <span className="text-[#e8a020]">Purpose & Passion.</span>
          </h1>

          <p className="text-lg text-white/60 leading-relaxed max-w-2xl font-medium">
            Amaze Ayurveda is not just a business — it's a movement to bring{" "}
            <span className="text-white font-black italic">Aatmanirbhar Bharat</span> to life through ancient wisdom and modern innovation.
          </p>
        </motion.div>
      </div>
    </section>

    {/* FLOATING STATS */}
    <section className="relative -mt-20 z-20 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            {...fadeUp(i * 0.08)}
            className="group bg-white rounded-[2.5rem] p-8 border border-[#1c3320]/5 shadow-xl hover:bg-[#1c3320] transition-all duration-500 text-center"
          >
            <s.icon className="mx-auto w-5 h-5 text-[#e8a020] mb-3" />
            <h3 className="text-4xl font-black text-[#1c3320] group-hover:text-white transition-colors tracking-tighter italic">
              {s.value}
            </h3>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white/40">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* PHILOSOPHY SECTION */}
    <section className="py-36 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div {...fadeUp(0)} className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[#e8a020]" />
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#e8a020]">Our Philosophy</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-[#1c3320] leading-[0.9] tracking-tighter uppercase italic">
              More Than A Company.<br />
              <span className="text-emerald-600">A Community.</span>
            </h2>
          </div>

          <p className="text-base text-[#1c3320]/60 leading-relaxed font-bold max-w-md">
            We are a team of leaders who believe that everyone deserves a chance to succeed. We empower every Indian to build their own destiny.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {pillars.map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-4 hover:border-emerald-500/20 hover:bg-emerald-50/30 transition-all">
                <ShieldCheck className="text-emerald-600 w-4 h-4 flex-shrink-0" />
                <span className="text-[#1c3320] font-black text-[10px] uppercase tracking-widest">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quote Card */}
        <motion.div {...fadeUp(0.2)} className="relative bg-[#1c3320] rounded-[3rem] p-12 md:p-16 overflow-hidden shadow-2xl">
          <QuoteIcon className="absolute top-8 right-10 w-24 h-24 text-white/5" />
          <div className="relative z-10 space-y-8">
            <p className="text-2xl md:text-4xl font-black text-white leading-tight italic tracking-tight">
              "It's not just about money. It's about rediscovering who you really are and what you can achieve for your nation."
            </p>
            <div className="flex items-center gap-4">
              <div className="h-px w-10 bg-[#e8a020]" />
              <span className="text-[#e8a020] font-black uppercase text-[10px] tracking-widest">Our Core Mission</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* PRODUCTS SECTION */}
    <section className="relative py-32 bg-white rounded-t-[4rem] shadow-2xl -mt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div {...fadeUp(0)} className="text-center mb-20 space-y-4">
          <h2 className="text-5xl md:text-7xl font-black text-[#1c3320] tracking-tighter uppercase italic">
            Innovation for <span className="text-emerald-600">Wellness</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((item, idx) => (
            <motion.div
              key={item.title}
              {...fadeUp(idx * 0.1)}
              className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 md:p-14 hover:bg-white hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-lg" style={{ backgroundColor: item.accent }}>
                <item.icon className="text-white w-7 h-7" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">{item.title}</h3>
              <p className="text-slate-500 font-bold leading-relaxed mb-8">{item.desc}</p>
              <div className="flex flex-wrap gap-2">
                {item.points.map((p) => (
                  <span key={p} className="px-4 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    
  </div>
);

export default AboutUsPage;