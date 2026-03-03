"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flag, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

const HeroPosterIndian = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50">
      {/* Background Patriotic Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Side */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="flex flex-col space-y-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 bg-white border border-orange-100 px-5 py-2 rounded-2xl shadow-sm w-fit"
              >
                <Flag className="w-5 h-5 text-orange-600" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">
                  Vocal for Local
                </span>
              </motion.div>
              
              <h1 className="text-7xl md:text-9xl font-black leading-none tracking-tighter text-slate-900">
                BE <span className="text-orange-600">INDIAN</span><br />
                BUY <span className="text-emerald-600">INDIAN</span>
              </h1>
            </div>

            <p className="text-xl text-slate-600 leading-relaxed max-w-lg font-medium">
              Amaze Ayurveda is more than a brand; it is a movement for a 
              <span className="text-slate-900 font-bold"> Aatmanirbhar Bharat</span>. 
              We bring the ancient purity of India to the modern world.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Button size="lg" className="bg-slate-900 hover:bg-emerald-700 h-16 px-10 rounded-2xl text-lg font-bold shadow-2xl transition-all hover:scale-105">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Swadeshi
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-bold border-2 bg-white hover:bg-slate-50 transition-all">
                Our Mission <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* Poster Side with Lion Logo Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-5 rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.1)] border border-white">
              <div className="aspect-[4/5] overflow-hidden rounded-[2rem] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=800" 
                  alt="Indian Heritage"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                
                {/* Make in India Animated Overlay */}
                <motion.div 
                  initial={{ opacity: 0, rotate: -10 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute top-6 right-6 bg-white/95 backdrop-blur shadow-xl rounded-full p-4 border border-slate-100 flex flex-col items-center justify-center text-center"
                >
                  {/* Lion Icon Placeholder / Make In India Symbol */}
                  <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-1">
                     <ShieldCheck className="text-white w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter leading-tight">
                    Make in<br/>India
                  </span>
                </motion.div>

                {/* Bottom Branding */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent text-white">
                  <div className="flex items-center gap-2 mb-2 text-orange-400">
                    <Flag className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold uppercase tracking-widest">Amaze Ayurveda</span>
                  </div>
                  <p className="text-3xl font-bold tracking-tight">Support Indian Artisans & Entrepreneurs.</p>
                </div>
              </div>
            </div>

            {/* Glowing Orbs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-400/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-[80px]" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroPosterIndian;