import Image from 'next/image'
import React from 'react'

const LeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15"/>
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    <path d="M60 60 C40 50 25 55 15 70" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    <path d="M60 90 C80 78 95 82 105 95" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    <path d="M60 120 C42 110 30 115 22 128" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
  </svg>
);

function MinimalFooter() {
  return (
    <div className="bg-[#1c3320] relative border-t border-white/6 py-7 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <LeafDecor className="absolute right-6 bottom-0 w-14 text-emerald-400 opacity-10 pointer-events-none" />
    
            <div className="flex items-center gap-3">
              <div className="relative w-7 h-7 rounded-lg bg-white/8 border border-white/10 overflow-hidden">
                <Image src="/amaze-logo.png" alt="Logo" fill className="object-contain p-1" />
              </div>
              <span
                className="text-sm font-black text-white/60"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Amaze <span className="text-[#e8a020] italic">Ayurveda</span>
              </span>
            </div>
    
            <p className="text-[9px] font-medium text-white/18 uppercase tracking-widest text-center">
              © 2026 Amaze Ayurveda Pvt. Ltd. · CIN: U82990BR2023PTC066853
            </p>
    
            <div className="flex items-center gap-2">
              <div className="h-px w-5 bg-[#e8a020]/20" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
                Proudly Made in Bharat 🇮🇳
              </span>
              <div className="h-px w-5 bg-[#e8a020]/20" />
            </div>
          </div>
  )
}

export default MinimalFooter