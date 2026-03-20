"use client";

import React from "react";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, Phone, ArrowRight, Leaf, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/* ── Shared botanical leaf SVG ── */
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
const FAQS = [
  {
    q: "How do I start my business with Amaze Ayurveda?",
    a: "Starting is simple! Register as an associate, complete your KYC, and activate your ID by purchasing products worth ₹499 or more. You can then start sharing and earning right away.",
  },
  {
    q: "What is the 15-level income plan?",
    a: "Our unique 15-level plan allows you to earn commissions not just from your direct referrals, but up to 15 levels deep in your network — ensuring true, compounding passive income growth.",
  },
  {
    q: "Are the products AYUSH certified?",
    a: "Yes, all our Ayurvedic products are manufactured in GMP-certified facilities and carry the necessary certifications to ensure 100% purity and safety for every family.",
  },
  {
    q: "When do I receive my payouts?",
    a: "We follow a transparent and timely payout system. Your earnings are calculated and credited to your registered bank account as per the weekly/monthly cycle without delay.",
  },
];

/* ── Accordion item ── */
const FaqItem = ({ faq, index }: { faq: typeof FAQS[0]; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full text-left group transition-all duration-300 rounded-2xl border overflow-hidden",
          open
            ? "bg-[#1c3320] border-[#1c3320] shadow-[0_12px_40px_rgba(28,50,32,0.18)]"
            : "bg-white border-[#1c3320]/8 hover:border-[#1c3320]/16 shadow-[0_2px_12px_rgba(28,50,32,0.05)] hover:shadow-[0_6px_24px_rgba(28,50,32,0.1)]"
        )}
      >
        {/* Trigger row */}
        <div className="flex items-center justify-between px-7 py-5 gap-4">
          <div className="flex items-center gap-4">
            {/* Step number */}
            <span
              className={cn(
                "text-[10px] font-black tabular-nums flex-shrink-0 transition-colors",
                open ? "text-[#e8a020]/60" : "text-[#1c3320]/20"
              )}
            >
              0{index + 1}
            </span>
            <span
              className={cn(
                "text-base font-bold tracking-tight leading-snug transition-colors text-left",
                open ? "text-white" : "text-[#1c3320]"
              )}
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {faq.q}
            </span>
          </div>

          {/* Toggle icon */}
          <div
            className={cn(
              "flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-300",
              open
                ? "bg-[#e8a020] text-[#1c3320] shadow-[0_4px_12px_rgba(232,160,32,0.4)]"
                : "bg-[#1c3320]/6 text-[#1c3320]/40 group-hover:bg-[#1c3320]/10"
            )}
          >
            {open ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </div>
        </div>

        {/* Answer panel */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            open ? "max-h-48" : "max-h-0"
          )}
        >
          <div className="px-7 pb-6 pt-0">
            {/* Gold rule */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-6 bg-[#e8a020]/50" />
              <div className="h-px w-2 bg-[#e8a020]/20" />
            </div>
            <p className="text-white/55 text-sm font-medium leading-relaxed">
              {faq.a}
            </p>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

/* ── Main component ── */
const FaqSection = () => (
  <section
    className="relative py-32 bg-[#f5f0e8] overflow-hidden"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >

    {/* ── Background layer ── */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-28  -left-28  w-[440px] h-[440px] rounded-full bg-[#e8a020]/6  blur-[110px]" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-[#1c3320]/5  blur-[100px]" />
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage: "radial-gradient(circle, #1c3320 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, #000 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, #000 40%, transparent 100%)",
        }}
      />
      <LeafDecor className="absolute top-10  right-10 w-32 text-[#1c3320] opacity-[0.05]" />
      <LeafDecor className="absolute bottom-14 left-6  w-20 text-[#c8860a]  opacity-[0.06] rotate-[18deg]" />
    </div>

    <div className="relative z-10 container mx-auto px-6 lg:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

        {/* ══════════════════════════
            LEFT — header + support
        ══════════════════════════ */}
        <div className="lg:col-span-5 space-y-10">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 bg-[#1c3320]/6 border border-[#1c3320]/10 px-4 py-2 rounded-full">
              <Leaf className="w-3.5 h-3.5 text-[#e8a020] fill-[#e8a020]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#1c3320]/55">
                Knowledge Base
              </span>
            </div>

            {/* Headline */}
            <h2
              className="text-5xl md:text-6xl font-black text-[#1c3320] tracking-tight leading-[0.92]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Got{" "}
              <span className="text-[#e8a020] italic">Questions?</span>
              <br />We have Answers.
            </h2>

            {/* Gold rule */}
            <div className="flex items-center gap-3">
              <div className="h-px w-10 bg-[#e8a020]" />
              <div className="h-px w-4  bg-[#e8a020]/30" />
            </div>

            <p className="text-[#1c3320]/50 text-base font-medium leading-relaxed max-w-sm">
              Everything you need to know about the Swadeshi movement and growing your business.
            </p>
          </motion.div>

          {/* Support card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative bg-[#1c3320] rounded-[2rem] p-8 overflow-hidden shadow-[0_20px_60px_rgba(28,50,32,0.22)]"
          >
            {/* Decor */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#e8a020]/10 blur-[70px]" />
              <LeafDecor className="absolute bottom-4 right-4 w-20 text-emerald-400 opacity-15 rotate-6" />
              <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                  backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <div className="relative z-10 space-y-6">
              {/* Card heading */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#e8a020]/70 mb-1">
                  Need more help?
                </p>
                <h3
                  className="text-2xl font-black text-white"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Still confused?
                </h3>
                <p className="text-white/40 text-sm font-medium mt-1.5 leading-relaxed">
                  Our support team is always ready to assist you directly.
                </p>
              </div>

              {/* Gold rule */}
              <div className="flex items-center gap-2">
                <div className="h-px w-6 bg-[#e8a020]/40" />
                <div className="h-px w-2 bg-[#e8a020]/15" />
              </div>

              {/* Contact options */}
              <div className="space-y-2.5">
                {[
                  { icon: MessageCircle, label: "WhatsApp Support",  accent: "#1c6634" },
                  { icon: Phone,         label: "+91 92042 60719",   accent: "#c8860a" },
                ].map(({ icon: Icon, label, accent }) => (
                  <div
                    key={label}
                    className="group/item flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/8 hover:border-white/15 hover:bg-white/8 cursor-pointer transition-all"
                  >
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ backgroundColor: `${accent}25` }}
                    >
                      <Icon
                        className="w-4 h-4 transition-colors"
                        style={{ color: accent === "#c8860a" ? "#e8a020" : "#4ade80" }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white/60 group-hover/item:text-white transition-colors">
                      {label}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover/item:text-[#e8a020] group-hover/item:translate-x-1 transition-all ml-auto" />
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <button className="w-full h-12 rounded-xl bg-[#e8a020] hover:bg-[#d4911a] text-[#1c3320] font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(232,160,32,0.3)] hover:shadow-[0_6px_28px_rgba(232,160,32,0.45)] active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2">
                Contact Us Now
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* ══════════════════════════
            RIGHT — accordion
        ══════════════════════════ */}
        <div className="lg:col-span-7 space-y-3">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} faq={faq} index={i} />
          ))}

          {/* Bottom nudge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 pt-4 pl-2"
          >
            <div className="h-[3px] w-16 bg-[#1c3320]/8 rounded-full overflow-hidden">
              <div className="h-full w-8 bg-[#e8a020] rounded-full" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#1c3320]/25">
              {FAQS.length} common questions answered
            </span>
          </motion.div>
        </div>

      </div>
    </div>
  </section>
);

export default FaqSection;