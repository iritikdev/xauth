"use client";

import React from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flag, ShoppingBag, ArrowRight, ShieldCheck, Heart, Star } from "lucide-react";
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafafa]">
      
      {/* 1. Enhanced Background Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-200/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-200/30 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Content Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-200/50 px-4 py-2 rounded-full shadow-sm"
              >
                <Flag className="w-4 h-4 text-orange-600 animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                  Swadeshi Movement 2026
                </span>
              </motion.div>
              
              <h1 className="text-5xl md:text-8xl font-[1000] leading-[0.9] tracking-[-0.04em] text-slate-900">
                BE <span className="text-orange-600 italic">INDIAN</span><br />
                BUY <span className="text-emerald-600 italic">INDIAN</span>
              </h1>
            </div>

            <p className="text-md md:text-xl text-slate-500 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              Empowering <span className="text-slate-900 font-bold underline decoration-orange-500/30 decoration-4">1 Million+ Artisans</span>. 
              Amaze Ayurveda brings the purity of ancient wisdom to your modern lifestyle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-slate-900 hover:bg-emerald-600 h-16 px-10 rounded-[1.25rem] text-base font-black uppercase tracking-widest shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-1 active:scale-95">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-[1.25rem] text-base font-black uppercase tracking-widest border-2 border-slate-200 bg-transparent hover:bg-white transition-all active:scale-95">
                Our Story <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 opacity-60">
                <div className="flex flex-col items-center lg:items-start">
                    <span className="text-2xl font-black text-slate-900">100%</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest">Organic</span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex flex-col items-center lg:items-start">
                    <span className="text-2xl font-black text-slate-900">AYUSH</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest">Certified</span>
                </div>
            </div>
          </motion.div>

          {/* Image Side with Parallax Effect */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 p-4 bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100">
              <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=800" 
                  alt="Indian Heritage"
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                />
                
                {/* Floating Make in India Badge */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 right-8 bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-5 border border-white flex flex-col items-center text-center w-24"
                >
                  <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center mb-2 rotate-12 group-hover:rotate-0 transition-transform">
                     <ShieldCheck className="text-white w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tighter leading-tight text-slate-800">
                    Trusted<br/>Bharat
                  </span>
                </motion.div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 text-white shadow-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-300" />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Join 50k+ Indians</span>
                  </div>
                  <p className="text-xl font-bold leading-tight">Reviving our roots, one product at a time.</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-slate-200 rounded-[4rem] rotate-3" />
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-slate-100 rounded-[4rem] -rotate-3" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;