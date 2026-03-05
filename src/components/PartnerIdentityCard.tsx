"use client";

import React, { useRef, useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, ShieldCheck, MapPin, Phone, Globe, User, Loader2 } from "lucide-react";
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
      // Scale 4 ensures the 85.6mm card is ultra-sharp for PVC printing
      const canvas = await html2canvas(cardRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", [85.6, 54]); 
      pdf.addImage(imgData, "PNG", 0, 0, 85.6, 54);
      pdf.save(`Amaze_ID_${userData.username}.pdf`);
    } catch (err) {
      console.error("ID Print Error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10 bg-[#f8fafc] w-full px-4">
      {/* Action Header */}
      <div className="text-center space-y-2 mb-4">
        <h3 className="text-xl font-black text-slate-900">Partner Identity Card</h3>
        <p className="text-xs text-slate-500 font-medium">Standard CR80 Size for PVC Printing</p>
      </div>

      {/* --- Responsive Wrapper --- */}
      {/* This container handles the visual scaling for mobile phones */}
      <div className="w-full flex justify-center items-center overflow-hidden h-[250px] sm:h-[300px]">
        <div className="scale-[0.65] sm:scale-100 origin-center transition-transform duration-500">
          <div 
            ref={cardRef}
            style={{ 
              width: '85.6mm', 
              height: '54mm', 
              backgroundColor: '#ffffff',
              minWidth: '85.6mm' // Forces the width to remain fixed for capture
            }}
            className="relative overflow-hidden rounded-[18px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex border border-slate-100 select-none"
          >
            {/* Left Branding Strip */}
            <div className="w-[35%] bg-[#0f172a] relative flex flex-col items-center justify-center p-4">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <img src="/amaze-logo.png" alt="pattern" className="w-full h-full object-cover scale-150 rotate-12" />
              </div>
              
              <div className="relative z-10 w-14 h-14 bg-white rounded-xl p-2 mb-2 shadow-lg">
                 <Image src="/amaze-logo.png" alt="Logo" fill className="object-contain p-1" />
              </div>
              <div className="text-center z-10">
                <h4 className="text-[10px] font-black text-white leading-none uppercase tracking-tighter">Amaze</h4>
                <p className="text-[8px] font-bold text-[#10b981] tracking-widest uppercase">Ayurveda</p>
              </div>
              <div className="absolute bottom-4 z-10 flex items-center gap-1 bg-[#10b98120] px-2 py-0.5 rounded-full border border-[#10b98140]">
                <ShieldCheck className="w-2 h-2 text-[#10b981]" />
                <span className="text-[5px] text-white font-black uppercase tracking-[0.2em]">Verified</span>
              </div>
            </div>

            {/* Right Details Area */}
            <div className="flex-1 p-5 relative flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[6px] font-black text-[#94a3b8] uppercase tracking-[0.3em]">Associate Partner</p>
                  <h2 className="text-sm font-black text-[#0f172a] uppercase leading-tight">{userData.name}</h2>
                  <p className="text-[8px] font-bold text-[#059669] tracking-widest uppercase">ID: {userData.username}</p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-slate-50 border-2 border-white shadow-inner overflow-hidden flex items-center justify-center">
                  {userData.photoUrl ? (
                    <img src={userData.photoUrl} className="w-full h-full object-cover" alt="User" />
                  ) : (
                    <User className="w-6 h-6 text-slate-200" />
                  )}
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-50 pt-3">
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
                    <span className="text-[7px] font-bold">amazeayurveda.in</span>
                 </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                 <div className="flex items-center gap-1">
                    <div className="w-2 h-0.5 bg-orange-500 rounded-full" />
                    <div className="w-2 h-0.5 bg-slate-200 rounded-full" />
                    <div className="w-2 h-0.5 bg-emerald-500 rounded-full" />
                 </div>
                 <p className="text-[5px] font-black text-[#94a3b8] uppercase tracking-widest">Aatmanirbhar Bharat initiative</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        onClick={downloadID} 
        disabled={isDownloading}
        className="bg-[#059669] hover:bg-[#047857] text-white font-bold h-12 px-10 rounded-xl shadow-xl transition-all"
      >
        {isDownloading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
        {isDownloading ? "Processing Card..." : "Download ID Card"}
      </Button>
    </div>
  );
};