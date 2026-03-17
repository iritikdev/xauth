"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Replace with your accordion import
import { HelpCircle, MessageCircle, Phone, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    q: "How do I start my business with Amaze Ayurveda?",
    a: "Starting is simple! Just register as an associate, complete your KYC, and activate your ID by purchasing products worth ₹499 or more. You can then start sharing and earning.",
  },
  {
    q: "What is the 15-level income plan?",
    a: "Our unique 15-level plan allows you to earn commissions not just from your direct referrals, but up to 15 levels deep in your network, ensuring true passive income growth.",
  },
  {
    q: "Are the products AYUSH certified?",
    a: "Yes, all our Ayurvedic products are manufactured in GMP-certified facilities and carry necessary certifications to ensure 100% purity and safety.",
  },
  {
    q: "When do I get my payouts?",
    a: "We follow a transparent and timely payout system. Your earnings are calculated and credited to your registered bank account as per the weekly/monthly cycle.",
  },
];

const FaqSection = () => {
  return (
    <section className="py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Side: Header & Support Card */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                <HelpCircle size={14} /> Knowledge Base
              </div>
              <h2 className="text-5xl md:text-6xl font-[1000] text-slate-900 tracking-tighter leading-none">
                Got <span className="text-emerald-600 italic">Questions?</span><br/>
                We have Answers.
              </h2>
              <p className="text-lg text-slate-500 font-medium">
                Everything you need to know about the Swadeshi movement and your business growth.
              </p>
            </div>

            {/* Support Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-200"
            >
              <div className="relative z-10 space-y-6">
                <h3 className="text-2xl font-bold italic">Still confused?</h3>
                <p className="text-slate-400 text-sm font-medium">
                  Hamari support team aapki help ke liye hamesha ready hai. Direct connect karein:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 group/item cursor-pointer">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center group-hover/item:bg-emerald-500 transition-colors">
                      <MessageCircle size={18} />
                    </div>
                    <span className="font-bold text-sm">WhatsApp Support</span>
                  </div>
                  <div className="flex items-center gap-4 group/item cursor-pointer">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center group-hover/item:bg-blue-500 transition-colors">
                      <Phone size={18} />
                    </div>
                    <span className="font-bold text-sm">+91 98765 43210</span>
                  </div>
                </div>
                <Button className="w-full h-14 rounded-2xl bg-white text-slate-900 font-black uppercase tracking-widest text-[10px] hover:bg-emerald-400 transition-all">
                  Contact Us Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/40 transition-all" />
            </motion.div>
          </div>

          {/* Right Side: Accordion */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <details className="bg-slate-50 rounded-[2rem] border border-slate-100 open:bg-white open:shadow-xl open:shadow-slate-200/50 transition-all duration-300 overflow-hidden">
                    <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                      <span className="text-lg font-black text-slate-800 tracking-tight uppercase">
                        {faq.q}
                      </span>
                      <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-open:rotate-180 transition-transform">
                        <ChevronDown size={18} className="text-slate-400" />
                      </div>
                    </summary>
                    <div className="px-8 pb-8 pt-0 text-slate-500 font-medium leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// Helper for Arrow (If you don't use Shadcn Accordion)
const ChevronDown = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} height={size || 24} 
    viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="3" 
    strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export default FaqSection;