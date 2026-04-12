"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulating API call delay
    setTimeout(() => {
      setStatus("success");
    }, 2000);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence mode="wait">
          {status !== "success" ? (
            <motion.div
              key="form-fields"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Inputs */}
              <div className="space-y-1.5">
                <input 
                  required
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full h-14 px-6 rounded-2xl bg-white border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                />
              </div>

              {/* Submit Button with Loading State */}
              <Button 
                disabled={status === "loading"}
                className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] relative overflow-hidden group"
              >
                {status === "loading" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <span className="flex items-center gap-2">
                    Add me to the list 
                    <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                )}
              </Button>
            </motion.div>
          ) : (
            /* --- SUCCESS STATE ANIMATION --- */
            <motion.div
              key="success-message"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                className="h-16 w-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 size={32} className="text-white" />
              </motion.div>
              
              <h3 className="text-xl font-[1000] italic text-slate-900 tracking-tighter uppercase mb-2">
                You're <span className="text-emerald-600">In!</span>
              </h3>
              <p className="text-[10px] font-black text-emerald-700/60 uppercase tracking-widest leading-relaxed">
                We'll ping you the second <br /> a desk opens up.
              </p>

              <Button 
                variant="ghost" 
                onClick={() => setStatus("idle")}
                className="mt-6 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
              >
                Reset Form
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}