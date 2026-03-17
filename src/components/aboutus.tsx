"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Target, Heart, Zap, ArrowRight, 
  CheckCircle, Leaf, Globe, Award, ShieldCheck
} from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';

const AboutUsPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const stats = [
    { label: "Community Members", value: "1M+", icon: Users },
    { label: "States Reached", value: "28+", icon: Globe },
    { label: "Ayush Products", value: "150+", icon: Leaf },
    { label: "Years of Trust", value: "5+", icon: Award },
  ];

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. Hero Section: The Visionary Start */}
      <section className="relative pt-32 pb-44 overflow-hidden bg-[#0f172a] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="max-w-4xl space-y-8">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em]">
              The Swadeshi Legacy
            </Badge>
            <h1 className="text-6xl md:text-8xl font-[1000] leading-[0.9] tracking-[-0.04em]">
              Growing with <br />
              <span className="text-emerald-500 italic">Purpose & Passion.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl font-medium">
              Amaze Ayurveda is not just a business; it's a movement to bring <span className="text-white">Aatmanirbhar Bharat</span> to life through ancient wisdom and modern innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Stats Section: Visual Proof of Growth */}
      <section className="relative -mt-20 z-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100 text-center space-y-2 group hover:bg-emerald-600 transition-all duration-500"
            >
              <stat.icon className="mx-auto w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 group-hover:text-white transition-colors tracking-tighter">{stat.value}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-100 transition-colors">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Narrative Section: The Philosophy */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-[1000] text-slate-900 leading-none tracking-tighter">
                More Than A Company.<br/>
                <span className="text-emerald-600 italic underline decoration-emerald-200 decoration-8 underline-offset-8">A Community.</span>
              </h2>
            </div>
            <div className="space-y-6 text-lg text-slate-500 font-medium leading-relaxed">
              <p>
                We are a team of leaders who believe that everyone deserves a chance to succeed. From homemakers to young professionals, we empower every Indian to build their own destiny.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {['Financial Freedom', 'Confidence', 'Personal Growth', 'Wellness First'].map((item) => (
                  <div key={item} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <ShieldCheck className="text-emerald-600 w-6 h-6 shrink-0" />
                    <span className="text-slate-900 font-bold uppercase text-xs tracking-widest">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Featured Quote with High Visual Impact */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#1e293b] rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)]"
          >
            <QuoteIcon className="absolute top-10 right-10 w-32 h-32 text-emerald-500/10" />
            <div className="relative z-10 space-y-8">
               <p className="text-3xl md:text-4xl font-bold text-white leading-tight italic">
                 "It's not just about money. It's about rediscovering who you really are and what you can achieve for your nation."
               </p>
               <div className="flex items-center gap-4 pt-4">
                  <div className="h-px w-12 bg-emerald-500" />
                  <span className="text-emerald-500 font-black uppercase text-[10px] tracking-[0.4em]">Our Core Mission</span>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Innovation Section: SlimExpert & Josh Vital */}
      <section className="py-32 bg-white rounded-t-[4rem] md:rounded-t-[6rem] shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-[1000] text-slate-900 tracking-tighter">Innovation for <span className="text-emerald-600">Wellness</span></h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mt-4 font-medium italic">Empowering your life with Ayurvedic science and modern sustainability.</p>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {[
            { 
              title: "SlimExpert", 
              icon: Target, 
              color: "emerald", 
              desc: "Smart, sustainable health and fitness. Making wellness simple and achievable for every body.",
              points: ["Natural Detox", "Weight Management", "Pure Herbs"]
            },
            { 
              title: "Josh Vital", 
              icon: Zap, 
              color: "orange", 
              desc: "Timeless Ayurvedic power for modern stamina, boosting energy and overall vitality daily.",
              points: ["Instant Energy", "Stress Relief", "Immunity Boost"]
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-slate-50 rounded-[3rem] p-10 md:p-14 border border-slate-100 group transition-all"
            >
              <div className={cn(
                "w-16 h-16 rounded-3xl flex items-center justify-center mb-8 shadow-lg",
                item.color === "emerald" ? "bg-emerald-600" : "bg-orange-600"
              )}>
                <item.icon className="text-white w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{item.title}</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
                {item.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.points.map(p => (
                    <span key={p} className="px-4 py-1.5 bg-white rounded-full text-[10px] font-black uppercase text-slate-400 border border-slate-100">{p}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto bg-slate-950 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] -mr-32 -mt-32" />
          <motion.div className="relative z-10 space-y-10">
            <h2 className="text-5xl md:text-7xl font-[1000] tracking-tighter leading-none">
              Start Your <br/> <span className="text-emerald-500">Journey Today.</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
              Join 1 Million+ Indians who have chosen health, wealth, and swadeshi pride.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-600/20">
                  Become a Partner
                </button>
              </Link>
              <button className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                Contact Our Team
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const QuoteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017V21H14.017ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.017C5.46472 8 5.017 8.44772 5.017 9V12C5.017 12.5523 4.56929 13 4.017 13H2.017V21H5.017Z" />
  </svg>
);

export default AboutUsPage;