"use client";

import { motion } from "framer-motion";
import { Leaf, Mail, Bell, Sparkles, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import WaitlistForm from "./waitlist-form";

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20 overflow-x-hidden">
      
      {/* --- HERO SECTION (Waiting Room Vibe) --- */}
      <section className="relative pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-8"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Talent Pool Active</span>
        </motion.div>

        <h1 className="text-5xl md:text-8xl font-[1000] tracking-tighter uppercase italic text-slate-900 leading-[0.9] mb-8">
          Right people. <br />
          <span className="text-emerald-500">Waitlisted.</span>
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto font-medium leading-relaxed">
          We aren't hiring today, but we are always looking for the exceptional. Drop your profile and be the first to know when a desk opens up.
        </p>
      </section>

      {/* --- NOTIFICATION BENTO BOX --- */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto">
        <div className="relative bg-white border border-slate-100 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-emerald-900/5 overflow-hidden">
          {/* Background Decorative Leaf */}
          <Leaf className="absolute -right-10 -bottom-10 w-64 h-64 text-emerald-50/50 -rotate-12 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="h-16 w-16 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600">
                <Bell size={32} className="animate-bounce" />
              </div>
              <h2 className="text-3xl font-[1000] italic text-slate-900 tracking-tighter uppercase leading-none">
                Get Notified <br />
                <span className="text-emerald-500">Instantly.</span>
              </h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed">
                Choose your field, and we'll ping you <br className="hidden md:block" />
                the second we post a role.
              </p>
            </div>

            {/* Micro-Form inside the card */}
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* --- FOOTER QUOTE --- */}
      <section className="py-24 text-center">
        <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Amaze Ayurveda Culture</p>
        <p className="text-slate-400 text-sm italic max-w-sm mx-auto px-6">
          "Patience is the companion of wisdom."
        </p>
      </section>
    </div>
  );
}