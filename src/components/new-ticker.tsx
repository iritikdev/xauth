'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Zap, TrendingUp } from 'lucide-react'

const newsItems = [
  "🎉 New Achievement: Ritik Kumar just reached 'Star Partner' rank!",
  "🌿 Product Launch: SlimExpert is now available in your store.",
  "🚀 Growth Alert: 500+ new associates joined the Swadeshi movement this week.",
  "💡 Tip: Complete your KYC to unlock 15-level commissions.",
  "🔥 Trending: Josh Vital is the highest selling product this month."
]

export function NewsTicker() {
  return (
    <div className="w-full bg-[#0f172a] overflow-hidden py-2 border-b border-slate-800 flex items-center shadow-inner">
      {/* Label/Icon Fixed on the left */}
      <div className="z-10 bg-[#0f172a] px-4 flex items-center gap-2 border-r border-slate-700 h-full">
        <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 animate-pulse" />
        <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">
          Live Updates
        </span>
      </div>

      {/* Scrolling Content */}
      <div className="flex-1 relative flex items-center">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex whitespace-nowrap gap-12 items-center"
        >
          {newsItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300">
                {item}
              </span>
              <div className="h-1 w-1 rounded-full bg-slate-600" />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {newsItems.map((item, index) => (
            <div key={`dup-${index}`} className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300">
                {item}
              </span>
              <div className="h-1 w-1 rounded-full bg-slate-600" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right Side: Trending Badge */}
      <div className="hidden md:flex z-10 bg-[#0f172a] px-4 items-center gap-2 border-l border-slate-700">
        <TrendingUp className="w-3 h-3 text-orange-400" />
        <span className="text-[9px] font-black text-orange-400 uppercase tracking-tighter">
          #VocalForLocal
        </span>
      </div>
    </div>
  )
}