"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  UserCheck, ShoppingBag, Share2, TrendingUp,
  UserPlus, ArrowRight, Leaf,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ── Shared botanical leaf SVG ── */
const LeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15" />
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <path d="M60 60 C40 50 25 55 15 70" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <path d="M60 90 C80 78 95 82 105 95" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <path d="M60 120 C42 110 30 115 22 128" stroke="currentColor" strokeWidth="1" opacity="0.15" />
  </svg>
);

/* ── Animation helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

/* ── Steps data ── */
const steps = [
  {
    title: "Register",
    desc: "Fill out the quick associate registration form.",
    icon: UserCheck,
    accent: "#1c3320",
    highlight: null,
  },
  {
    title: "Activate",
    desc: "Purchase any products worth ₹499 or more.",
    icon: ShoppingBag,
    accent: "#c8860a",
    highlight: "Min. ₹499",
  },
  {
    title: "Promote",
    desc: "Share Swadeshi benefits with your community.",
    icon: Share2,
    accent: "#1c6634",
    highlight: null,
  },
  {
    title: "Prosper",
    desc: "Grow your network & earn unlimited income.",
    icon: TrendingUp,
    accent: "#e8a020",
    highlight: null,
  },
];

const perks = ["Instant Payout", "No Registration Fee", "Vocal for Local"];

/* ── Component ── */
const BusinessOpportunity = () => (
  <section
    className="relative py-32 px-6 overflow-hidden bg-[#f5f0e8]"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >

    {/* ── Background layer ── */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32  left-1/4  w-[500px] h-[500px] rounded-full bg-[#e8a020]/6  blur-[110px]" />
      <div className="absolute -bottom-24 right-1/4 w-[500px] h-[500px] rounded-full bg-[#1c3320]/5  blur-[100px]" />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage: "radial-gradient(circle, #1c3320 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 50%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 50%, transparent 100%)",
        }}
      />
      <LeafDecor className="absolute top-10 right-10 w-32 text-[#1c3320] opacity-[0.05]" />
      <LeafDecor className="absolute bottom-14 left-6  w-20 text-[#c8860a]  opacity-[0.06] rotate-[18deg]" />
    </div>

    <div className="relative z-10 max-w-6xl mx-auto">

      {/* ══════════════════════════════
          HEADER
      ══════════════════════════════ */}
      <motion.div {...fadeUp(0)} className="text-center max-w-3xl mx-auto mb-24 space-y-5">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2.5 bg-[#1c3320]/6 border border-[#1c3320]/10 px-4 py-2 rounded-full">
          <Leaf className="w-3.5 h-3.5 text-[#e8a020] fill-[#e8a020]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#1c3320]/55">
            Be Your Own Boss
          </span>
        </div>

        {/* Headline */}
        <h2
          className="text-5xl md:text-7xl font-black text-[#1c3320] tracking-tight leading-[0.92]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Financial{" "}
          <span className="text-[#e8a020] italic">Freedom</span>
          <br />Starts Here
        </h2>

        {/* Gold rule */}
        <div className="flex items-center justify-center gap-3 py-1">
          <div className="h-px w-10 bg-[#e8a020]" />
          <div className="h-px w-4  bg-[#e8a020]/30" />
        </div>

        <p className="text-base text-[#1c3320]/50 leading-relaxed font-medium max-w-xl mx-auto">
          Start your journey toward wellness and wealth with India's fastest growing{" "}
          <span className="text-[#1c3320] font-bold">Ayurveda Network</span>.
        </p>
      </motion.div>

      {/* ══════════════════════════════
          STEPS
      ══════════════════════════════ */}
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Connector line (desktop) */}
        <div className="hidden md:block absolute top-[3.25rem] left-[12.5%] right-[12.5%] h-px bg-[#1c3320]/8 z-0" />

        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            {...fadeUp(i * 0.08)}
            className="relative group"
          >
            <div className="relative bg-white border border-[#1c3320]/6 rounded-[2rem] p-7 h-full flex flex-col items-center md:items-start text-center md:text-left shadow-[0_4px_24px_rgba(28,50,32,0.06)] hover:shadow-[0_16px_48px_rgba(28,50,32,0.12)] hover:-translate-y-2 hover:border-[#1c3320]/12 transition-all duration-300 overflow-hidden">

              {/* Watermark step number */}
              <span
                className="absolute -top-1 right-4 text-6xl font-black leading-none select-none transition-colors duration-300 group-hover:opacity-100"
                style={{ color: step.accent, opacity: 0.05 }}
              >
                0{i + 1}
              </span>

              {/* Icon badge */}
              <div
                className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:rotate-6"
                style={{ backgroundColor: step.accent }}
              >
                <step.icon className="text-white w-6 h-6" />
              </div>

              {/* Step label */}
              <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                <span
                  className="text-[9px] font-black uppercase tracking-[0.25em]"
                  style={{ color: step.accent }}
                >
                  Step 0{i + 1}
                </span>
              </div>

              <h3
                className="text-lg font-black text-[#1c3320] tracking-tight mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {step.title}
              </h3>

              <p className="text-sm text-[#1c3320]/45 font-medium leading-relaxed flex-1">
                {step.desc}
              </p>

              {/* Highlight pill */}
              {step.highlight && (
                <div
                  className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest"
                  style={{
                    backgroundColor: `${step.accent}10`,
                    borderColor: `${step.accent}25`,
                    color: step.accent,
                  }}
                >
                  <span
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: step.accent }}
                  />
                  {step.highlight}
                </div>
              )}

              {/* Bottom accent line on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: step.accent }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ══════════════════════════════
          CTA
      ══════════════════════════════ */}
      <motion.div
        {...fadeUp(0.45)}
        className="mt-24 flex flex-col items-center gap-8"
      >
        {/* Dark CTA card */}
        <div className="relative w-full bg-[#1c3320] rounded-[2.5rem] px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden shadow-[0_32px_80px_rgba(28,50,32,0.22)]">

          {/* Glows + decor */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#e8a020]/10 blur-[80px]" />
            <LeafDecor className="absolute bottom-4 right-8 w-20 text-emerald-400 opacity-20 rotate-6" />
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          </div>

          {/* Left copy */}
          <div className="relative z-10 text-center md:text-left space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#e8a020]/70">
              Ready to begin?
            </p>
            <h3
              className="text-3xl md:text-4xl font-black text-white leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Join the Swadeshi<br />
              <span className="text-[#e8a020] italic">Movement</span>
            </h3>
          </div>

          {/* Right — perks + button */}
          <div className="relative z-10 flex flex-col items-center md:items-end gap-5">
            {/* Perk pills */}
            <div className="flex flex-wrap justify-center md:justify-end gap-2">
              {perks.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/40"
                >
                  <span className="h-1 w-1 rounded-full bg-[#e8a020]" />
                  {p}
                </span>
              ))}
            </div>

            {/* Button */}
            <Link href="/sign-up">
              <button className="inline-flex items-center gap-3 h-14 px-9 rounded-xl bg-[#e8a020] hover:bg-[#d4911a] text-[#1c3320] font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_8px_32px_rgba(232,160,32,0.3)] hover:shadow-[0_12px_40px_rgba(232,160,32,0.45)] active:scale-[0.97] transition-all duration-200 whitespace-nowrap">
                <UserPlus className="w-4 h-4" />
                Register Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>

    </div>
  </section>
);

export default BusinessOpportunity;