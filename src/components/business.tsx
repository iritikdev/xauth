"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, UserPlus, ArrowRight, Sparkles } from "lucide-react";
import Link from 'next/link';

const BusinessOpportunity = () => {
  const steps = [
    "Fill out the registration form",
    "Purchase products worth ₹499 or more",
    "Share company benefits with others",
    "Grow your network → Earn unlimited income"
  ];

  // Animation variants for staggered list
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-slate-50">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      </div>

      <div className="relative max-w-4xl mx-auto z-10">
        {/* Header with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            Join the Journey
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Business <span className="text-emerald-600 italic">Opportunity</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            Start your journey toward financial freedom and wellness with <span className="text-slate-800 font-medium">Ayurveda</span>.
          </p>
        </motion.div>

        {/* Main Card with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="backdrop-blur-sm bg-white/80 border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
            <CardContent className="p-8 md:p-16 space-y-12">
              <h3 className="text-3xl font-bold text-slate-900 border-l-4 border-emerald-500 pl-6">
                How to Start?
              </h3>

              <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid gap-6"
              >
                {steps.map((text, index) => (
                  <motion.div 
                    key={index} 
                    // variants={item}
                    className="flex items-center gap-5 p-4 rounded-2xl transition-colors hover:bg-emerald-50/50 group"
                  >
                    <div className="flex-shrink-0">
                      <div className="bg-white p-2 rounded-xl shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500 group-hover:text-white" />
                      </div>
                    </div>
                    <p className="text-lg md:text-xl text-slate-700 font-medium tracking-wide">
                      {text}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-col items-center md:items-start gap-4 pt-4"
              >
                <Link href="/sign-up">
                <Button 
                  size="lg" 
                  className="group w-full md:w-auto bg-slate-900 hover:bg-emerald-600 text-white text-lg h-16 px-10 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Become a Member
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                </Link>
                <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">
                  Instant Activation • Start Earning Today
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessOpportunity;