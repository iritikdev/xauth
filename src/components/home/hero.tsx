"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Leaf, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

/* ── Stagger helpers ── */
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const fadeRight = (delay = 0) => ({
  initial:    { opacity: 0, x: -28 },
  animate:    { opacity: 1, x: 0   },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const fadeLeft = (delay = 0) => ({
  initial:    { opacity: 0, x: 28 },
  animate:    { opacity: 1, x: 0  },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const,  delay },
});

const trust = [
  { value: "100%",   label: "Organic"   },
  { value: "AYUSH",  label: "Certified" },
  { value: "1M+",    label: "Artisans"  },
];

const pillars = [
  "Authentic Ayurvedic Formulations",
  "15-Level Income Opportunity",
  "Proudly Made in Bharat",
];

const Hero = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f5f0e8]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >

      {/* ── Background layer ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Warm orbs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#e8a020]/8 blur-[130px]" />
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-[#1c3320]/6 blur-[120px]" />

        {/* Dot grid — masked to center */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #1c3320 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)",
          }}
        />

        {/* Botanical leaf accents */}
        <LeafDecor className="absolute top-16 right-[5%]  w-36 text-[#1c3320] opacity-[0.06]" />
        <LeafDecor className="absolute bottom-20 left-[3%] w-24 text-[#c8860a] opacity-[0.07] rotate-[15deg]" />
        <LeafDecor className="absolute top-1/2  left-[8%] w-16 text-[#1c6634] opacity-[0.05] -rotate-12" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* ════════════════════════════════
              LEFT  —  Copy
          ════════════════════════════════ */}
          <div className="space-y-8 text-center lg:text-left">

            {/* Badge */}
            <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2.5 bg-[#1c3320]/6 border border-[#1c3320]/10 px-4 py-2 rounded-full">
              <Leaf className="w-3.5 h-3.5 text-[#e8a020] fill-[#e8a020]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#1c3320]/60">
                Swadeshi Movement 2026
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.12)}
              className="text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] font-black leading-[0.92] tracking-[-0.03em] text-[#1c3320]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              BE{" "}
              <span className="text-[#e8a020] italic">INDIAN</span>
              <br />
              BUY{" "}
              <span
                className="relative inline-block"
                style={{
                  WebkitTextStroke: "2px #1c3320",
                  color: "transparent",
                }}
              >
                INDIAN
              </span>
            </motion.h1>

            {/* Body copy */}
            <motion.p
              {...fadeUp(0.2)}
              className="text-base md:text-lg text-[#1c3320]/55 leading-relaxed max-w-md mx-auto lg:mx-0 font-medium"
            >
              Empowering{" "}
              <span className="text-[#1c3320] font-bold">1 Million+ Artisans</span>.
              Amaze Ayurveda brings the purity of ancient wisdom to your modern lifestyle.
            </motion.p>

            {/* Pillar checklist */}
            <motion.ul {...fadeUp(0.27)} className="space-y-2.5 text-left max-w-xs mx-auto lg:mx-0">
              {pillars.map((p) => (
                <li key={p} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#e8a020] flex-shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#1c3320]/55">
                    {p}
                  </span>
                </li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.33)}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2"
            >
              <Link href="/shop" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-xl bg-[#1c3320] hover:bg-[#1c6634] text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_8px_32px_rgba(28,50,32,0.25)] hover:shadow-[0_12px_40px_rgba(28,50,32,0.35)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200">
                  <ShoppingBag className="w-4 h-4" />
                  Shop Now
                </button>
              </Link>
              <Link href="/about-us" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl border-2 border-[#1c3320]/15 bg-transparent hover:bg-[#1c3320]/5 hover:border-[#1c3320]/25 text-[#1c3320]/65 hover:text-[#1c3320] font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-200">
                  Our Story
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>

            {/* Trust stats */}
            <motion.div
              {...fadeUp(0.4)}
              className="flex items-center gap-6 justify-center lg:justify-start pt-2"
            >
              {trust.map((t, i) => (
                <React.Fragment key={t.label}>
                  {i > 0 && <div className="h-8 w-px bg-[#1c3320]/12" />}
                  <div>
                    <p className="text-xl font-black text-[#1c3320] leading-none">{t.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#1c3320]/40 mt-0.5">
                      {t.label}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          {/* ════════════════════════════════
              RIGHT  —  Image composition
          ════════════════════════════════ */}
          <motion.div
            {...fadeLeft(0.15)}
            className="relative flex items-center justify-center"
          >
            {/* Outer ring — forest green border */}
            <div className="absolute inset-[-18px] rounded-[3.5rem] border border-[#1c3320]/8 rotate-2" />
            <div className="absolute inset-[-18px] rounded-[3.5rem] border border-[#1c3320]/5 -rotate-2" />

            {/* Image card */}
            <div className="relative z-10 w-full rounded-[3rem] bg-[#1c3320] p-3 shadow-[0_40px_80px_-16px_rgba(28,50,32,0.3)] overflow-hidden">

              {/* Dark forest header strip */}
              <div className="relative overflow-hidden">
                <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] relative group">
                  <Image
                    src="https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=800"
                    alt="Indian Ayurvedic Heritage"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c3320]/80 via-[#1c3320]/10 to-transparent" />

                  {/* Floating trust badge — top right */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-6 right-6 bg-[#e8a020] rounded-2xl p-4 shadow-[0_8px_32px_rgba(232,160,32,0.4)] flex flex-col items-center gap-1.5"
                  >
                    <Leaf className="w-5 h-5 text-[#1c3320] fill-[#1c3320]" />
                    <span className="text-[8px] font-black uppercase tracking-tight text-[#1c3320] leading-tight text-center">
                      Trusted<br />Bharat
                    </span>
                  </motion.div>

                  {/* Bottom info card */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Avatar stack */}
                      <div className="flex -space-x-2">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full border-2 border-white/30 bg-gradient-to-br from-[#e8a020]/60 to-[#1c6634]/60"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#e8a020]">
                        Join 50k+ Indians
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white leading-snug">
                      Reviving our roots, one product at a time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Brand strip below image (inside dark card) */}
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-2">
                  <LeafDecor className="w-5 text-[#e8a020]" />
                  <span
                    className="text-sm font-black text-white"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Amaze <span className="text-[#e8a020] italic">Ayurveda</span>
                  </span>
                </div>
                <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.25em]">
                  🌿 Vocal for Local
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;