"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Users, Globe, Sprout, Award } from "lucide-react";
import Image from "next/image";
import { AppHeader } from "@/components/layout/app-header";
import { Footer } from "@/components/layout/footer";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function OurStory() {
  return (
      <>  
    <AppHeader />
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* ── Hero Section ── */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#1c3320]">
        
        <div className="relative z-10 text-center px-6">
          <motion.div {...fadeUp}>
            <span className="text-[#e8a020] text-xs font-black uppercase tracking-[0.4em] mb-4 block">Our Heritage</span>
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
              Rooted in <span className="text-[#e8a020] not-italic">Bharat</span>
            </h1>
            <p className="text-emerald-100/60 mt-6 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">
              Founded on the principles of Swadeshi wellness, Amaze Ayurveda is more than a brand. It's a sanctuary for those seeking the purity of ancient wisdom in a modern world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Mission Cards ── */}
      <section className="container mx-auto px-6 -mt-20 relative z-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Pure Extraction", desc: "Sourcing directly from the fertile lands of India.", icon: Sprout },
            { title: "Swadeshi Soul", desc: "100% Indian owned, operated, and formulated.", icon: ShieldCheck },
            { title: "Global Vision", desc: "Taking the power of Ayurveda to the global stage.", icon: Globe },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-slate-100 group hover:bg-[#1c3320] transition-all duration-500"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10">
                <item.icon className="text-emerald-600 group-hover:text-[#e8a020]" />
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-white mb-2 uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-500 group-hover:text-emerald-100/60 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Narrative Content ── */}
      <section className="container mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div {...fadeUp} className="relative aspect-square md:aspect-video lg:aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
          <Image 
            src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80" 
            alt="Process" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c3320] via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-10 left-10 text-white">
            <p className="text-4xl font-black italic">Crafted with Love</p>
            <p className="text-[#e8a020] uppercase font-bold tracking-widest text-xs">Purity Guaranteed</p>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              From Bihar to <span className="text-emerald-600">Every Home</span>
            </h2>
            <div className="h-1.5 w-20 bg-[#e8a020] rounded-full" />
          </div>
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              Amaze Ayurveda started in the heart of Bihar with a simple realization: the world was moving away from nature, and the authentic secrets of Ayurveda were being lost in mass production.
            </p>
            <p>
              Our founder envisioned a platform where <strong>Swadeshi products</strong> meet modern technology. We don't just sell products; we build a network of associates who believe in the power of Indian roots.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <p className="text-3xl font-black text-emerald-700">50K+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Partners</p>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-700">200+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Formulations</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Founder's Quote ── */}
      <section className="bg-emerald-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div {...fadeUp}>
            <Award className="w-12 h-12 text-[#e8a020] mx-auto mb-6" />
            <p className="text-2xl md:text-3xl font-medium text-[#1c3320] italic leading-snug">
              "We believe that real growth happens when we grow together. Amaze Ayurveda is not just a business; it's a movement to bring prosperity and health to every Indian household."
            </p>
            <div className="mt-8">
              <p className="font-black text-slate-900 uppercase tracking-widest">Team Amaze</p>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Swadeshi Warriors</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}