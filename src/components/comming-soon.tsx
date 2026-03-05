"use client"

import React from "react"
import { motion } from "framer-motion"
import { Rocket, Bell, Sparkles, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ComingSoon() {
  return (
    <div className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden rounded-[3rem] bg-[#0f172a] p-8 md:p-20 text-center border border-slate-800 shadow-2xl">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl space-y-8"
      >
        {/* Animated Icon */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]"
        >
          <Rocket className="h-10 w-10 text-emerald-500 fill-emerald-500/10" />
        </motion.div>

        {/* Text Content */}
        <div className="space-y-4">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
            Coming Soon
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
            Something <span className="text-emerald-500">Amaze-ing</span> <br /> is in the works.
          </h2>
          <p className="text-slate-400 text-lg font-medium max-w-lg mx-auto leading-relaxed">
            We're putting the finishing touches on this feature to help you scale your Swadeshi business even faster. Stay tuned!
          </p>
        </div>

        {/* Action Area */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm gap-2 shadow-xl shadow-emerald-500/20">
            <Bell className="h-4 w-4" /> Notify Me on Launch
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Verified Feature</span>
          </div>
        </div>

        {/* Decorative Sparkles */}
        <div className="absolute -top-10 -left-10 opacity-20">
          <Sparkles className="h-20 w-20 text-emerald-500" />
        </div>
      </motion.div>
    </div>
  )
}