"use client";

import React from "react";
import { 
  Lock, Eye, Database, Share2, 
  ShieldCheck, BellRing, Trash2, 
  Fingerprint, Mail, Phone, MapPin 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PrivacyPolicy() {
  const lastUpdated = "April 2026";

  const contactInfo = {
    email: "support@amazeayurveda.com",
    phone: "+91 92042 60719",
    address: "Muzaffarpur, Bihar, India"
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24 overflow-x-hidden">
      
      {/* --- PREMIUM HEADER --- */}
      <header className="relative pt-32 pb-20 px-6 text-center bg-white border-b border-slate-100 overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-8"
        >
          <Fingerprint size={14} className="text-emerald-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-800">Privacy First Ecosystem</span>
        </motion.div>

        <h1 className="text-5xl md:text-8xl font-[1000] tracking-tighter uppercase italic text-slate-900 leading-[0.8] mb-6">
          Privacy <span className="text-emerald-500">Policy.</span>
        </h1>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em]">
          Version 2.0 • Amaze Ayurveda Pvt. Ltd.
        </p>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-20 space-y-24">
        
        {/* --- 1. INTRODUCTION --- */}
        <section className="flex flex-col md:flex-row gap-10 items-start">
          <div className="shrink-0 h-16 w-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-xl">
            <Eye size={28} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter text-slate-900 leading-none">
              1. Introduction
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">
              Amaze Ayurveda Pvt. Ltd. respects your privacy and is committed to protecting your personal information. 
              This policy explains how we collect, use, and safeguard your data when you engage with our products and business opportunities.
            </p>
          </div>
        </section>

        {/* --- 2. DATA COLLECTION BENTO --- */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <Database className="text-emerald-500" size={24} />
            <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter text-slate-900">2. Information We Collect</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CollectionCard 
              title="Personal Info" 
              items={["Name & Phone", "Email & Address", "ID Proof"]} 
              color="bg-white"
            />
            <CollectionCard 
              title="Business Data" 
              items={["Purchase History", "Sales Data", "Commissions"]} 
              color="bg-emerald-50/50"
            />
            <CollectionCard 
              title="Technical" 
              items={["IP Address", "Device Type", "Usage Patterns"]} 
              color="bg-white"
            />
          </div>
        </section>

        {/* --- 3. HOW WE USE DATA --- */}
        <section className="p-10 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative group">
          <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12 group-hover:rotate-0 transition-all duration-700" />
          <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter mb-8 relative z-10">3. Purpose of Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            {[
              "Process orders & deliveries",
              "Manage distributor accounts",
              "Calculate commissions & rewards",
              "Provide customer support",
              "Send updates & offers",
              "Improve products & services"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-white/70 font-bold text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {text}
              </div>
            ))}
          </div>
        </section>

        {/* --- 5. DATA SHARING (THE NO-SALE RULE) --- */}
        <section className="text-center py-12 border-y border-slate-100">
           <div className="inline-flex h-20 w-20 bg-rose-50 text-rose-500 rounded-full items-center justify-center mb-6">
              <Share2 size={32} />
           </div>
           <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter text-slate-900 mb-4">5. Sharing of Information</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-8">
             We do <span className="text-rose-600 underline decoration-2">NOT</span> sell your data to third parties.
           </p>
           <div className="flex flex-wrap justify-center gap-4">
              {["Payment Gateways", "Logistics Partners", "Legal Authorities"].map((tag) => (
                <span key={tag} className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black uppercase text-slate-700 shadow-sm italic">
                  {tag}
                </span>
              ))}
           </div>
        </section>

        {/* --- CONTACT & FOOTER --- */}
        <section className="bg-emerald-600 rounded-[3rem] p-10 md:p-16 text-white grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter leading-none">
              Need more <br /> <span className="text-emerald-200">Clarity?</span>
            </h2>
            <p className="text-emerald-100/70 text-sm font-medium leading-relaxed">
              If you have any privacy-related concerns or want to exercise your data rights, our team is ready to help.
            </p>
          </div>
          <div className="space-y-4">
            <ContactLink icon={<Mail size={16}/>} label={contactInfo.email} />
            <ContactLink icon={<Phone size={16}/>} label={contactInfo.phone} />
            <ContactLink icon={<MapPin size={16}/>} label={contactInfo.address} />
          </div>
        </section>

        <div className="text-center">
           <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.5em]">
             Consent confirmed upon use of service
           </p>
        </div>

      </div>
    </div>
  );
}

function CollectionCard({ title, items, color }: any) {
  return (
    <div className={cn("p-8 rounded-[2.5rem] border border-slate-100 shadow-sm", color)}>
      <h3 className="text-lg font-black italic uppercase text-slate-900 mb-4 tracking-tight">{title}</h3>
      <ul className="space-y-3">
        {items.map((item: string) => (
          <li key={item} className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-slate-300" /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactLink({ icon, label }: any) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer group">
      <div className="text-emerald-300 group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-sm font-black italic tracking-tight">{label}</span>
    </div>
  );
}