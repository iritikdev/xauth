"use client";

import React, { useRef, useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, ShieldCheck, MapPin, Phone, Globe, User } from "lucide-react";
import html2canvas from "html2canvas-pro"; 
import jsPDF from "jspdf";
import Image from "next/image";

interface IDCardProps {
  userData: {
    name: string;
    username: string;
    mobile: string;
    joiningDate: string;
    photoUrl?: string;
  };
}

export const PartnerIdentityCard = ({ userData }: IDCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadID = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 4, // Ultra-high resolution for physical printing
        useCORS: true,
        backgroundColor: null,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", [85, 54]); // Standard ID Card Size (85mm x 54mm)
      pdf.addImage(imgData, "PNG", 0, 0, 85, 54);
      pdf.save(`ID_Card_${userData.username}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 py-16 bg-[#f8fafc]">
      <Button 
        onClick={downloadID} 
        disabled={isDownloading}
        className="bg-[#0f172a] hover:bg-[#059669] text-white font-bold px-8 h-12 rounded-2xl shadow-lg transition-all"
      >
        {isDownloading ? "Printing..." : "Download Digital ID Card"}
      </Button>

      {/* --- ID Card Canvas (Standard CR80 Size) --- */}
      <div 
        ref={cardRef}
        style={{ width: '85.6mm', height: '54mm', backgroundColor: '#ffffff' }}
        className="relative overflow-hidden rounded-[20px] shadow-2xl flex border border-slate-100"
      >
        {/* Left Branding Strip */}
        <div className="w-[35%] bg-[#0f172a] relative flex flex-col items-center justify-center p-4">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <img src="/amaze-logo.png" alt="pattern" className="w-full h-full object-cover scale-150 rotate-12" />
          </div>
          
          <div className="relative z-10 w-16 h-16 bg-white rounded-2xl p-2 mb-3 shadow-xl">
             <Image src="/amaze-logo.png" alt="Logo" fill className="object-contain p-1" />
          </div>
          <div className="text-center z-10">
            <h4 className="text-[10px] font-black text-white leading-none uppercase tracking-tighter">Amaze</h4>
            <p className="text-[8px] font-bold text-[#10b981] tracking-widest uppercase">Ayurveda</p>
          </div>

          <div className="absolute bottom-4 z-10">
             <div className="flex items-center gap-1 bg-[#10b98120] px-2 py-0.5 rounded-full border border-[#10b98140]">
                <ShieldCheck className="w-2 h-2 text-[#10b981]" />
                <span className="text-[5px] text-white font-black uppercase tracking-[0.2em]">Verified</span>
             </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-5 relative flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[6px] font-black text-[#94a3b8] uppercase tracking-[0.3em] mb-1">Independent Associate</p>
              <h2 className="text-sm font-black text-[#0f172a] uppercase leading-tight">{userData.name}</h2>
              <p className="text-[8px] font-bold text-[#059669] tracking-widest uppercase">ID: {userData.username}</p>
            </div>
            {/* Profile Placeholder */}
            <div className="w-14 h-14 rounded-xl bg-slate-100 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
              {userData.photoUrl ? (
                <img src={userData.photoUrl} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-slate-300" />
              )}
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="space-y-1.5 border-t border-slate-100 pt-3">
             <div className="flex items-center gap-2 text-[#64748b]">
                <Phone className="w-2.5 h-2.5 text-[#059669]" />
                <span className="text-[7px] font-bold">+91 {userData.mobile}</span>
             </div>
             <div className="flex items-center gap-2 text-[#64748b]">
                <MapPin className="w-2.5 h-2.5 text-[#059669]" />
                <span className="text-[7px] font-bold">New Delhi, India</span>
             </div>
             <div className="flex items-center gap-2 text-[#64748b]">
                <Globe className="w-2.5 h-2.5 text-[#059669]" />
                <span className="text-[7px] font-bold">www.amazeayurveda.in</span>
             </div>
          </div>

          {/* Bottom Bar: National Identity */}
          <div className="flex justify-between items-center pt-2">
             <div className="flex items-center gap-1">
                <div className="w-2 h-0.5 bg-orange-500 rounded-full" />
                <div className="w-2 h-0.5 bg-white rounded-full border border-slate-200" />
                <div className="w-2 h-0.5 bg-emerald-500 rounded-full" />
             </div>
             <p className="text-[5px] font-black text-[#94a3b8] uppercase tracking-widest italic">Aatmanirbhar Bharat Initiative</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 font-medium max-w-sm text-center">
        * Standard CR80 Size (85.6mm x 53.98mm). Perfect for high-quality PVC printing.
      </p>
    </div>
  );
};

export default PartnerIdentityCard;