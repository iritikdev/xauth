"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ChevronLeft, ChevronRight, Leaf, MapPin } from "lucide-react";
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

const QuoteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-3c0-1.105.895-2 2-2h3c.552 0 1-.448 1-1V9a1 1 0 00-1-1h-4a1 1 0 00-1 1v3a1 1 0 01-1 1h-2v8h3zM5.017 21v-3c0-1.105.895-2 2-2h3c.552 0 1-.448 1-1V9a1 1 0 00-1-1h-4a1 1 0 00-1 1v3a1 1 0 01-1 1h-2v8h3z" />
  </svg>
);

/* ── Data ── */
const testimonials = [
  {
    name: "Rajesh Kumar",
    rank: "Diamond Member",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    text: "Joining Amaze Ayurveda changed my life. Within 6 months, I grew a team of 200+ and achieved financial independence while promoting wellness.",
    rating: 5,
    location: "Patna, Bihar",
  },
  {
    name: "Priya Sharma",
    rank: "Star Diamond",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    text: "The 15-level plan is truly revolutionary. The transparency in payouts and the quality of Ayurvedic products make it so easy to share with others.",
    rating: 5,
    location: "Lucknow, UP",
  },
  {
    name: "Amit Patel",
    rank: "Super Star",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    text: "I started with just a ₹499 purchase. Today, my passive income covers all my monthly expenses. The support system here is incredible.",
    rating: 5,
    location: "Surat, Gujarat",
  },
];

/* ── Component ── */
const SuccessStories = () => {
  const [index,     setIndex]     = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => { setDirection(1);  setIndex((p) => (p + 1) % testimonials.length); };
  const prev = () => { setDirection(-1); setIndex((p) => (p - 1 + testimonials.length) % testimonials.length); };

  useEffect(() => {
    const t = setInterval(next, 8000);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[index];

  return (
    <section
      className="relative py-32 bg-[#1c3320] overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >

      {/* ── Background decor ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40  -left-40  w-[500px] h-[500px] rounded-full bg-[#c8860a]/8  blur-[120px]" />
        <div className="absolute -bottom-32 -right-20 w-[450px] h-[450px] rounded-full bg-emerald-400/6 blur-[110px]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Botanical leaves */}
        <LeafDecor className="absolute top-10  right-14 w-36 text-emerald-300 opacity-40" />
        <LeafDecor className="absolute bottom-12 left-8  w-24 text-[#c8860a]  opacity-30 rotate-[18deg]" />

        {/* Giant watermark text */}
        <p
          className="absolute top-6 left-6 text-[10rem] md:text-[16rem] font-black leading-none select-none opacity-[0.025] tracking-tighter text-white"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          GROWTH
        </p>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8"
        >
          <div className="space-y-4 max-w-xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <Leaf className="w-3.5 h-3.5 text-[#e8a020] fill-[#e8a020]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#e8a020]/80">
                Community Voices
              </span>
            </div>

            {/* Headline */}
            <h2
              className="text-5xl md:text-6xl font-black text-white leading-[0.92] tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Real{" "}
              <span className="text-[#e8a020] italic">Stories,</span>
              <br />Real Success.
            </h2>
          </div>

          {/* Nav controls */}
          <div className="flex items-center gap-4">
            {/* Dot indicators */}
            <div className="flex gap-1.5 mr-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    index === i ? "w-8 bg-[#e8a020]" : "w-2 bg-white/15 hover:bg-white/30"
                  )}
                />
              ))}
            </div>

            <button
              onClick={prev}
              className="h-12 w-12 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="h-12 w-12 flex items-center justify-center rounded-xl bg-[#e8a020] hover:bg-[#d4911a] text-[#1c3320] shadow-[0_4px_20px_rgba(232,160,32,0.3)] hover:shadow-[0_6px_28px_rgba(232,160,32,0.45)] transition-all active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* ── Carousel ── */}
        <div className="relative min-h-[420px] md:min-h-[340px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {/* Card */}
              <div className="h-full bg-white/5 border border-white/8 rounded-[2.5rem] backdrop-blur-sm overflow-hidden hover:border-white/12 transition-colors">
                <div className="p-8 md:p-14 flex flex-col md:flex-row gap-10 md:gap-16 items-center h-full">

                  {/* ── Avatar side ── */}
                  <div className="relative shrink-0 flex flex-col items-center gap-4">

                    {/* Glow ring */}
                    <div className="relative">
                      <div className="absolute -inset-3 rounded-full bg-[#e8a020]/15 blur-xl" />
                      <Avatar className="relative z-10 h-36 w-36 md:h-44 md:w-44 border-[6px] border-[#e8a020]/20 shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                        <AvatarImage src={t.image} className="object-cover" />
                        <AvatarFallback
                          className="text-4xl font-black"
                          style={{ backgroundColor: "#1c6634", color: "#e8a020" }}
                        >
                          {t.name[0]}
                        </AvatarFallback>
                      </Avatar>

                      {/* Quote badge */}
                      <div className="absolute -top-2 -right-3 z-20 bg-[#e8a020] p-2.5 rounded-xl shadow-[0_4px_16px_rgba(232,160,32,0.4)] rotate-12">
                        <QuoteIcon className="w-4 h-4 text-[#1c3320]" />
                      </div>
                    </div>

                    {/* Rank pill */}
                    <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#e8a020]" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#e8a020]">
                        {t.rank}
                      </span>
                    </div>
                  </div>

                  {/* ── Text side ── */}
                  <div className="flex-1 space-y-6 text-center md:text-left">

                    {/* Stars */}
                    <div className="flex justify-center md:justify-start gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#e8a020] text-[#e8a020]" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p
                      className="text-xl md:text-2xl font-bold text-white/80 leading-snug italic"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      "{t.text}"
                    </p>

                    {/* Gold rule */}
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                      <div className="h-px w-8 bg-[#e8a020]" />
                      <div className="h-px w-3 bg-[#e8a020]/30" />
                    </div>

                    {/* Name + meta */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4
                          className="text-xl font-black text-white tracking-tight"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {t.name}
                        </h4>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-white/25" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                            {t.location}
                          </span>
                        </div>
                      </div>

                      {/* Verified badge */}
                      <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/8 px-4 py-2.5 rounded-xl">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                          Verified Associate
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Progress bar ── */}
        <div className="mt-8 flex items-center gap-4">
          <div className="h-[2px] flex-1 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              key={index}
              className="h-full bg-[#e8a020] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 8, ease: "linear" }}
            />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/25 whitespace-nowrap">
            {index + 1} / {testimonials.length}
          </span>
        </div>

      </div>
    </section>
  );
};

export default SuccessStories;