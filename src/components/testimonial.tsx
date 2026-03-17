"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Rajesh Kumar",
    rank: "Diamond Member",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    text: "Joining Amaze Ayurveda changed my life. Within 6 months, I grew a team of 200+ and achieved financial independence while promoting wellness.",
    rating: 5,
    location: "Patna, Bihar"
  },
  {
    name: "Priya Sharma",
    rank: "Star Diamond",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    text: "The 15-level plan is truly revolutionary. The transparency in payouts and the quality of Ayurvedic products make it so easy to share with others.",
    rating: 5,
    location: "Lucknow, UP"
  },
  {
    name: "Amit Patel",
    rank: "Super Star",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    text: "I started with just a ₹499 purchase. Today, my passive income covers all my monthly expenses. The support system here is incredible.",
    rating: 5,
    location: "Surat, Gujarat"
  }
];

const SuccessStories = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-play feature (Optional but recommended)
  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-32 bg-[#fafafa] overflow-hidden">
      {/* Decorative Background Text */}
      <div className="absolute top-10 left-10 text-[15rem] font-black text-slate-200/20 select-none pointer-events-none tracking-tighter">
        GROWTH
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles size={14} className="animate-pulse" /> Community Voices
            </div>
            <h2 className="text-5xl md:text-7xl font-[1000] text-slate-900 tracking-tighter leading-none">
              Real <span className="text-emerald-600 italic">Stories,</span><br/> 
              Real Success.
            </h2>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <div className="flex gap-1 mr-4">
                {testimonials.map((_, i) => (
                    <div 
                        key={i} 
                        className={cn(
                            "h-1.5 transition-all duration-500 rounded-full",
                            index === i ? "w-8 bg-emerald-500" : "w-2 bg-slate-200"
                        )} 
                    />
                ))}
            </div>
            <button 
                onClick={prev} 
                className="h-14 w-14 flex items-center justify-center rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-90"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <button 
                onClick={next} 
                className="h-14 w-14 flex items-center justify-center rounded-2xl bg-slate-950 hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 active:scale-90"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="relative min-h-[500px] md:min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Card className="h-full border border-white/40 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] bg-white/60 backdrop-blur-md rounded-[3rem] overflow-hidden">
                <CardContent className="p-10 md:p-20 flex flex-col md:flex-row gap-12 items-center h-full">
                  
                  {/* Avatar Side */}
                  <div className="relative shrink-0">
                    <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
                    <Avatar className="h-44 w-44 md:h-56 md:w-56 border-[12px] border-white shadow-2xl relative z-10">
                      <AvatarImage src={testimonials[index].image} className="object-cover" />
                      <AvatarFallback className="bg-emerald-600 text-white text-5xl font-black">
                        {testimonials[index].name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute top-4 -right-4 bg-orange-500 text-white p-3 rounded-2xl shadow-xl z-20 rotate-12">
                      <Quote className="w-6 h-6 fill-current" />
                    </div>
                  </div>

                  {/* Text Side */}
                  <div className="flex-1 space-y-8 text-center md:text-left">
                    <div className="flex justify-center md:justify-start gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                      ))}
                    </div>

                    <p className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight leading-snug">
                      "{testimonials[index].text}"
                    </p>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                            {testimonials[index].name}
                        </h4>
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                           <span className="text-emerald-600">{testimonials[index].rank}</span>
                           <span className="h-1 w-1 bg-slate-300 rounded-full" />
                           <span>{testimonials[index].location}</span>
                        </div>
                      </div>
                      
                      {/* Sub-badge for extra trust */}
                      <div className="hidden lg:flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                         <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                         <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Verified Associate</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;