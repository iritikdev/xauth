"use client";

import { motion } from "framer-motion";
import { Check, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function KycSuccessPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        
        {/* Animated Checkmark Circle */}
        <div className="relative flex justify-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="h-32 w-32 rounded-full bg-emerald-500 flex items-center justify-center z-10 shadow-2xl shadow-emerald-200"
          >
            <motion.div
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Check className="h-16 w-16 text-white stroke-[4px]" />
            </motion.div>
          </motion.div>

          {/* Background Pulse Rings */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 h-32 w-32 rounded-full bg-emerald-100 -z-0 mx-auto"
          />
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
            KYC Submitted!
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            Aapke documents successfully upload ho gaye hain. Hamari team <span className="text-emerald-600 font-bold">24-48 hours</span> mein inhe verify karke aapka status update kar degi.
          </p>

          {/* Info Status Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 mb-10 flex items-start gap-4 text-left">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Status</p>
              <p className="text-sm font-bold text-slate-900 italic underline underline-offset-4 decoration-amber-500">
                Verification in Progress
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <Button 
            onClick={() => router.push("/dashboard")}
            className="w-full h-16 rounded-2xl bg-black hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Amaze Ayurveda Secured</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}