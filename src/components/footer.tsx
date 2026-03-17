"use client";

import React from "react";
import {
  Github, Instagram, Twitter, Youtube, Send, 
  MapPin, Phone, Mail, ShieldCheck, Leaf, Award
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="relative bg-[#fcfdfc] border-t border-slate-100 overflow-hidden pt-20 pb-10">
      
      {/* 1. Enhanced Patriotic Background Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.04]">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/12/Red_Fort_New_Delhi_Vector.svg"
          alt="Heritage"
          className="absolute -left-20 -bottom-10 h-[400px] w-auto grayscale brightness-50"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/30/Qutub_Minar_Vector.svg"
          alt="Heritage"
          className="absolute right-0 bottom-0 h-[500px] w-auto grayscale brightness-50"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* 2. Top Section: Newsletter Card */}
        {/* <div className="bg-emerald-600 rounded-[2.5rem] p-8 md:p-12 mb-20 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl shadow-emerald-200">
            <div className="text-white space-y-2 text-center lg:text-left">
                <h3 className="text-2xl md:text-3xl font-black tracking-tight italic">Join the Swadeshi Revolution</h3>
                <p className="text-emerald-100 text-sm font-medium opacity-80 uppercase tracking-widest">Aatmanirbhar Bharat begins with you.</p>
            </div>
            <div className="relative w-full max-w-md group">
                <Input 
                    type="email" 
                    placeholder="Enter your email for updates..." 
                    className="h-16 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-emerald-100/50 px-6 focus:bg-white focus:text-slate-900 transition-all outline-none"
                />
                <Button className="absolute right-2 top-2 bottom-2 bg-white text-emerald-600 hover:bg-slate-900 hover:text-white rounded-xl px-6 transition-all font-black uppercase text-[10px] tracking-widest">
                   Subscribe
                </Button>
            </div>
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* 3. Brand & Socials */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
                <Link href="/" className="flex items-center gap-3">
                  <img src="/amaze-logo.png" alt="Logo" className="w-14 h-14 object-contain" />
                  <div>
                    <h3 className="text-2xl font-[1000] text-slate-900 leading-none tracking-tighter uppercase italic">
                        Amaze <span className="text-emerald-600">Ayurveda</span>
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Pvt. Ltd.</p>
                  </div>
                </Link>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium italic">
                  "Authentic Ayurvedic wisdom, sustainable opportunities, and a vision for a stronger, healthier India."
                </p>
            </div>
            
            <div className="flex gap-3">
              {[Github, Instagram, Twitter, Youtube].map((Icon, i) => (
                <div key={i} className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white hover:-translate-y-1 transition-all cursor-pointer shadow-sm">
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>

          {/* 4. Reach Us Section */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="font-black text-slate-900 uppercase tracking-[0.3em] text-[10px]">Reach Us</h4>
            <div className="space-y-5">
                <ContactItem icon={<MapPin size={18}/>} label="Location" value="Saraiya, Bihar, India 843106" />
                <ContactItem icon={<Phone size={18}/>} label="Call" value="+91 9204260719" href="tel:+919204260719" />
                <ContactItem icon={<Mail size={18}/>} label="Email" value="support@amazeayurveda.in" href="mailto:support@amazeayurveda.in" />
            </div>
          </div>

          {/* 5. Quick Explore Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-black text-slate-900 uppercase tracking-[0.3em] text-[10px]">Explore</h4>
            <ul className="space-y-4">
              {["About Us", "Business Plan", "Products", "Careers", "T&C"].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-500 text-sm font-bold hover:text-emerald-600 hover:translate-x-2 transition-all flex items-center gap-2 group">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-emerald-500 transition-colors" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 6. Certification Badges (Premium UX) */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="font-black text-slate-900 uppercase tracking-[0.3em] text-[10px]">Trust & Safety</h4>
            <div className="grid grid-cols-2 gap-3">
               <TrustBadge icon={<ShieldCheck size={16}/>} label="ISO Certified" />
               <TrustBadge icon={<Leaf size={16}/>} label="100% Organic" />
               <TrustBadge icon={<Award size={16}/>} label="Ayush Dept." />
               <TrustBadge icon={<Award size={16}/>} label="GMP Certified" />
            </div>
          </div>
        </div>

        {/* 7. Bottom Bar */}
        <div className="pt-10 border-t border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                © 2026 Amaze Ayurveda Pvt. Ltd. | CIN: U82990BR2023PTC066853
            </p>
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    Proudly Made in Bharat <span className="animate-pulse">🇮🇳</span>
                </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Sub-components for Cleaner Code ---

const ContactItem = ({ icon, label, value, href }: any) => (
    <div className="flex gap-4 group cursor-pointer">
        <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
            {icon}
        </div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            {href ? (
                <a href={href} className="text-sm font-bold text-slate-700 hover:text-emerald-600 transition-colors">{value}</a>
            ) : (
                <p className="text-sm font-bold text-slate-700">{value}</p>
            )}
        </div>
    </div>
);

const TrustBadge = ({ icon, label }: any) => (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center gap-2 hover:bg-white hover:border-emerald-100 transition-all">
        <div className="text-emerald-600">{icon}</div>
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter leading-none">{label}</p>
    </div>
);