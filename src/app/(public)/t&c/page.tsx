"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, Scale, AlertCircle, RefreshCcw, 
  Lock, Ban, ShoppingBag, Landmark, ArrowRight 
} from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
  const [lastUpdated] = useState("April 2026");

  const sections = [
    { id: "intro", icon: <ShieldCheck size={20}/>, title: "1. Introduction" },
    { id: "eligibility", icon: <Scale size={20}/>, title: "2. Eligibility" },
    { id: "sales", icon: <ShoppingBag size={20}/>, title: "3. Product Sales" },
    { id: "income", icon: <Landmark size={20}/>, title: "4. Compensation" },
    { id: "prohibited", icon: <Ban size={20}/>, title: "5. Prohibited Activities" },
    { id: "refund", icon: <RefreshCcw size={20}/>, title: "7. Refund & Returns" },
    { id: "privacy", icon: <Lock size={20}/>, title: "8. Privacy Policy" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20">
      
      {/* --- HEADER --- */}
      <header className="pt-24 pb-12 px-6 text-center bg-white border-b border-slate-100">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-[9px] font-black uppercase tracking-[0.2em] text-white mb-6"
        >
          <ShieldCheck size={12} className="text-emerald-400" />
          Legal Document
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-[1000] tracking-tighter uppercase italic text-slate-900 leading-none mb-4">
          Terms & <span className="text-emerald-500">Conditions</span>
        </h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Last Updated: {lastUpdated} • Amaze Ayurveda Pvt. Ltd.
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
        
        {/* --- LEFT: STICKY NAVIGATION (Desktop Only) --- */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24 h-fit space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 mb-4">Table of Contents</p>
          {sections.map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all text-slate-500 hover:text-emerald-600 font-bold text-sm border border-transparent hover:border-slate-100 group"
            >
              <span className="text-slate-300 group-hover:text-emerald-500 transition-colors">{item.icon}</span>
              {item.title}
            </a>
          ))}
        </aside>

        {/* --- RIGHT: CONTENT AREA --- */}
        <main className="lg:col-span-8 space-y-16">
          
          {/* Section 1 */}
          <section id="intro" className="scroll-mt-24">
            <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter text-slate-900 mb-6 flex items-center gap-3">
              <span className="h-8 w-1 bg-emerald-500 rounded-full" /> 1. Introduction
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
              These Terms & Conditions govern the use of services, products, and the direct selling business opportunity offered by 
              <span className="text-slate-900 font-bold"> Amaze Ayurveda Pvt. Ltd.</span> By registering as a distributor or purchasing products, 
              you agree to comply with these terms.
            </div>
          </section>

          {/* Section 2 */}
          <section id="eligibility" className="scroll-mt-24">
            <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter text-slate-900 mb-6 flex items-center gap-3">
              <span className="h-8 w-1 bg-emerald-500 rounded-full" /> 2. Eligibility
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["18 years or older", "Valid ID proof & details", "Agree to Indian Laws"].map((text, i) => (
                <li key={i} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-3 text-sm font-bold text-slate-700 shadow-sm">
                   <div className="h-2 w-2 rounded-full bg-emerald-500" /> {text}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 & 4: Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-emerald-900 rounded-[2.5rem] text-white">
              <ShoppingBag className="mb-4 text-emerald-400" />
              <h3 className="text-xl font-black italic uppercase mb-3">3. Product Policy</h3>
              <p className="text-sm opacity-80 leading-relaxed font-medium">
                Income is generated only through sale of products. No incentives for recruitment alone. Approved pricing only.
              </p>
            </div>
            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
              <Landmark className="mb-4 text-amber-500" />
              <h3 className="text-xl font-black italic uppercase mb-3">4. Compensation</h3>
              <p className="text-sm opacity-80 leading-relaxed font-medium">
                Earnings depend on performance. No guaranteed income promised. Commission as per plan levels.
              </p>
            </div>
          </div>

          {/* Section 5: Prohibited (Important) */}
          <section id="prohibited" className="p-8 bg-rose-50 border border-rose-100 rounded-[2.5rem] scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <Ban className="text-rose-500" />
              <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter text-rose-900">5. Prohibited Activities</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                "Make false or exaggerated income claims",
                "Provide misleading product claims",
                "Engage in illegal or unethical practices",
                "Represent themselves as company employees"
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3 text-rose-800/80 text-sm font-bold">
                  <ArrowRight size={14} className="mt-1 shrink-0" /> {text}
                </div>
              ))}
            </div>
          </section>

          {/* Remaining Sections: Simplified list */}
          <div className="space-y-12">
            <SectionBlock title="6. Order & Payment" text="Official channels only. Suspicious transactions may be cancelled." />
            <SectionBlock id="refund" title="7. Refund & Return" text="7–10 days return (unused). Verification required for refunds." />
            <SectionBlock id="privacy" title="8. Privacy Policy" text="Confidential data. No third-party sharing without consent." />
            <SectionBlock title="9. Compliance & Law" text="Under Direct Selling Rules, 2021 (India). Violations lead to termination." />
          </div>

          {/* --- TERMINATION & JURISDICTION --- */}
          <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
             <h3 className="text-xl font-black italic uppercase text-slate-900 mb-4">12. Jurisdiction</h3>
             <p className="text-sm text-slate-500 font-medium mb-8">All disputes are subject to jurisdiction of Muzaffarpur, Bihar courts.</p>
             
             <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                <AlertCircle className="text-amber-600 shrink-0" />
                <p className="text-[11px] font-black uppercase leading-relaxed text-amber-900 tracking-wider">
                  ⚠️ IMPORTANT: By registering, you confirm that you have read, understood, and agreed to all terms mentioned above.
                </p>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
}

function SectionBlock({ title, text, id }: any) {
  return (
    <div id={id} className="scroll-mt-24 group">
      <h3 className="text-lg font-black italic uppercase text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors tracking-tight">
        {title}
      </h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{text}</p>
    </div>
  );
}