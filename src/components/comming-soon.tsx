"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Rocket, Bell, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export function ComingSoon() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setIsSubmitted(true)
      setEmail("")
    }
  }

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 } as any,
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } as any }
  }

  return (
    <div className="relative w-full min-h-dvh flex items-center justify-center overflow-hidden  bg-slate-950 p-6 md:p-24 text-center border border-slate-800/60 shadow-2xl">
      
      {/* 1. Techy Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

      {/* 2. Enhanced Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[15%] w-[45%] h-[45%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[15%] w-[45%] h-[45%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-xl mx-auto flex flex-col items-center space-y-10"
      >
        {/* Floating Icon Wrapper */}
        <motion.div 
          variants={itemVariants}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-700/80 shadow-xl">
            <Rocket className="h-7 w-7 text-emerald-400 animate-pulse" />
          </div>
        </motion.div>

        {/* Text Headers */}
        <div className="space-y-4">
          <motion.div variants={itemVariants} className="flex justify-center">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 rounded-full text-xs font-medium tracking-wide backdrop-blur-md">
              ✨ Coming Soon
            </Badge>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight text-slate-100 leading-[1.15]">
            Something <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Incredible</span> <br />
            is in the works.
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-slate-400 text-base md:text-lg max-w-md mx-auto leading-relaxed font-normal">
            We're building the ultimate feature toolkit to help scale your Swadeshi business efficiently. Get ready!
          </motion.p>
        </div>

        

        {/* Trust/Verification Footer Badge */}
        <motion.div variants={itemVariants} className="pt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium text-slate-400 tracking-normal">Swadeshi Secured Feature</span>
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}