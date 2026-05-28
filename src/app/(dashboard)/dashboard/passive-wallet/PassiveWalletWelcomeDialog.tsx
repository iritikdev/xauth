"use client";

import React, { useState, useEffect } from "react";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogAction 
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Sparkles, TrendingUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PassiveWalletWelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  // Trigger alert dialog immediately on page load/visit
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 400); // 400ms delay for smooth perception
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent className="max-w-md w-full rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-2xl shadow-emerald-950/10 overflow-hidden outline-none ring-0">
            
            {/* Background Decorative Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-[20%] -right-[20%] w-[50%] h-[50%] bg-emerald-50 blur-[80px] rounded-full" />
              <div className="absolute -bottom-[20%] -left-[20%] w-[50%] h-[50%] bg-amber-50 blur-[80px] rounded-full" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 text-center space-y-6">
              
              {/* Icon Matrix (Ayurveda + Wealth) */}
              <div className="flex justify-center items-center gap-2">
                <motion.div 
                  initial={{ rotate: -15, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm shadow-emerald-100"
                >
                  <Leaf size={22} className="fill-emerald-600/10" />
                </motion.div>
                
                <motion.div 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-amber-500"
                >
                  <Sparkles size={16} className="animate-pulse" />
                </motion.div>

                <motion.div 
                  initial={{ rotate: 15, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="h-12 w-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm shadow-amber-100"
                >
                  <TrendingUp size={22} />
                </motion.div>
              </div>

              {/* Header Texts */}
              <AlertDialogHeader className="space-y-3">
                <AlertDialogTitle className="text-2xl font-[1000] tracking-tighter uppercase italic text-slate-900 leading-tight">
                  Welcome to <br />
                  <span className="text-emerald-700 bg-emerald-50/50 px-3 py-1 rounded-xl border border-emerald-100/30">Amaze Ayurveda</span>
                </AlertDialogTitle>
                
                <div className="h-px w-16 bg-slate-200 mx-auto my-2" />
                
                <AlertDialogDescription className="text-slate-600 font-medium text-sm leading-relaxed px-2">
                  Invest your capital with <strong className="text-slate-900">Amaze Ayurveda Pvt. Ltd.</strong> & unlock guaranteed compounding returns of{" "}
                  <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200/60 rounded-lg px-2 py-0.5 font-black text-xs tracking-wide mx-1 animate-bounce">
                    5% - 20% Monthly Profit
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>

              {/* Tagline / Subtext */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-2"
              >
                <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">
                  Make a Happy & Peaceful Life With Us
                </p>
              </motion.div>

              {/* Action Trigger Footer */}
              <AlertDialogFooter className="pt-2">
                <AlertDialogAction 
                  asChild
                  className="w-full h-14 rounded-2xl bg-[#1c3320] hover:bg-[#112014] text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-950/20 transition-all duration-200 active:scale-[0.98]"
                >
                  <button onClick={() => setIsOpen(false)}>
                    Let's Build Wealth
                  </button>
                </AlertDialogAction>
              </AlertDialogFooter>

            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </AnimatePresence>
  );
}