"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, UserPlus, ArrowRight, Sparkles, 
  UserCheck, ShoppingBag, Share2, TrendingUp 
} from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';

const BusinessOpportunity = () => {
  const steps = [
    {
      title: "Register",
      desc: "Fill out the quick associate registration form.",
      icon: UserCheck,
      color: "bg-blue-500",
    },
    {
      title: "Activate",
      desc: "Purchase any products worth ₹499 or more.",
      icon: ShoppingBag,
      color: "bg-orange-500",
      highlight: "Min. ₹499"
    },
    {
      title: "Promote",
      desc: "Share Swadeshi benefits with your community.",
      icon: Share2,
      color: "bg-purple-500",
    },
    {
      title: "Prosper",
      desc: "Grow your network & earn unlimited income.",
      icon: TrendingUp,
      color: "bg-emerald-500",
    }
  ];

  return (
    <section className="relative py-28 px-6 overflow-hidden bg-[#fdfdfd]">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <Sparkles size={14} /> Be Your Own Boss
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-[1000] text-slate-900 tracking-tight leading-none">
            Financial <span className="text-emerald-600 italic">Freedom</span> <br/> Starts Here
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Start your journey toward wellness and wealth with India's fastest growing <span className="text-slate-900 font-bold underline decoration-emerald-500/30">Ayurveda Network</span>.
          </p>
        </div>

        {/* Steps Grid / Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-slate-100 -z-0" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-2 group-hover:border-emerald-100 h-full flex flex-col items-center md:items-start text-center md:text-left">
                
                {/* Icon Circle */}
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:rotate-6",
                  step.color
                )}>
                  <step.icon size={28} />
                </div>

                {/* Step Number Badge */}
                <div className="absolute top-6 right-8 text-4xl font-black text-slate-50 group-hover:text-emerald-50 transition-colors">
                  0{index + 1}
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">
                  {step.desc}
                </p>

                {step.highlight && (
                  <Badge className="bg-orange-50 text-orange-600 border-orange-100 font-black text-[9px] uppercase px-3 py-1">
                    {step.highlight}
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center space-y-8"
        >
          <div className="flex flex-col items-center gap-6">
            <Link href="/sign-up">
              <Button size="lg" className="h-20 px-12 rounded-[2rem] bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-105 active:scale-95 group">
                <UserPlus className="mr-3 h-5 w-5" />
                Join the Swadeshi Movement
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            
            <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Instant Payout</span>
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">No Registration Fee</span>
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Vocal for Local</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
    {children}
  </span>
);

export default BusinessOpportunity;