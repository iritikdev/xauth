"use client";

import React, { useRef, useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, ShieldCheck, Flag, Award, Loader2 } from "lucide-react";
// Switching to html2canvas-pro to handle modern CSS color functions
import html2canvas from "html2canvas-pro"; 
import jsPDF from "jspdf";
import Image from "next/image";

interface WelcomeLetterProps {
  userData: {
    name: string;
    username: string;
    joiningDate: string;
    sponsorName: string;
  };
}

const WelcomeLetter = ({ userData }: WelcomeLetterProps) => {
  const letterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    const element = letterRef.current;
    if (!element) return;

    setIsDownloading(true);
    try {
      // Pro version handles lab() and oklch() natively
      const canvas = await html2canvas(element, { 
        scale: 3, // Increased scale for high-quality printing
        useCORS: true, 
        backgroundColor: "#ffffff", // Use Hex to be safe
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Amaze_Welcome_${userData?.username || 'Member'}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-12 min-h-screen">
      {/* Action Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200"
      >
        <div className="text-sm font-medium text-slate-600">
          Your official swadeshi onboarding document is ready.
        </div>
        <Button 
          onClick={downloadPDF} 
          disabled={isDownloading}
          className="bg-[#059669] hover:bg-[#047857] text-white gap-2 font-bold rounded-xl h-12 px-6 transition-all"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isDownloading ? "Generating PDF..." : "Download Welcome Letter"}
        </Button>
      </motion.div>

      {/* --- Letter Canvas (A4 Dimensions) --- */}
      {/* We use inline Hex styles to prevent CSS variable conflicts */}
      <div 
        ref={letterRef} 
        style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
        className="w-[210mm] min-h-[297mm] shadow-2xl p-[20mm] relative overflow-hidden border-[12px] border-[#ecfdf5]"
      >
        {/* Background Watermark */}
        <div className="absolute top-0 right-0 opacity-[0.03] rotate-12 -translate-y-12 translate-x-12 pointer-events-none">
            <img src="/amaze-logo.png" alt="watermark" className="w-[500px]" />
        </div>
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-16 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 relative">
                <Image src="/amaze-logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight leading-none uppercase">Amaze Ayurveda</h1>
                <p className="text-[#059669] font-bold uppercase tracking-widest text-xs mt-1">Private Limited</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#fff7ed] text-[#c2410c] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#ffedd5] w-fit">
              <Flag className="w-3 h-3 fill-current" /> Vocal for Local
            </div>
          </div>
          
          <div className="text-right text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
            <p>CIN: U85100DL2026PTC000000</p>
            <p>ISO 9001:2015 Certified Company</p>
            <p className="mt-2 text-[#0f172a] underline decoration-[#059669]">www.amazeayurveda.in</p>
          </div>
        </div>

        {/* Recipient Details */}
        <div className="mb-12 space-y-1 relative z-10">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Date: {userData?.joiningDate}</p>
          <h2 className="text-2xl font-bold text-[#1e293b]">To, {userData?.name}</h2>
          <p className="text-slate-500 font-medium">Username ID: <span className="text-[#059669] font-black tracking-wider">{userData?.username}</span></p>
        </div>

        {/* Letter Body */}
        <div className="space-y-6 text-[#334155] leading-relaxed relative z-10 text-sm">
          <h3 className="text-xl font-black text-[#0f172a] mb-4 border-b pb-2 border-slate-100">
            Subject: Official Onboarding & Welcome to the Swadeshi Movement
          </h3>
          
          <p>Dear <span className="font-bold text-[#0f172a]">{userData?.name}</span>,</p>
          
          <p>
            It is with great pride and joy that we welcome you to the <strong className="text-[#0f172a]">Amaze Ayurveda</strong> family. By joining us, you are not just starting a business; you are becoming a vital part of the **Aatmanirbhar Bharat** mission.
          </p>

          <p>
            We are committed to empowering every Indian to build a sustainable future through the power of authentic Ayurveda. Your participation helps us strengthen the "Be Indian, Buy Indian" movement across the nation.
          </p>

          {/* Quick Info Box */}
          <div className="grid grid-cols-2 gap-4 py-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Sponsor</p>
              <p className="font-bold text-[#0f172a]">{userData?.sponsorName}</p>
            </div>
            <div className="bg-[#f0fdf4] p-5 rounded-2xl border border-[#dcfce7]">
              <p className="text-[9px] font-black text-[#059669] uppercase tracking-widest mb-1">Plan Structure</p>
              <p className="font-bold text-[#065f46]">15-Level Hybrid Plan</p>
            </div>
          </div>

          <p>
            Your account is now fully active. We encourage you to explore our flagship releases like <strong>SlimExpert</strong> and <strong>Josh Vital</strong> as you begin your journey toward financial freedom.
          </p>

          <p className="font-black text-[#0f172a] pt-4">Rising Together, Rising Strong.</p>
        </div>

        {/* Footer / Signatures */}
        <div className="mt-24 flex justify-between items-end relative z-10">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[#059669]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified Swadeshi Partner</span>
             </div>
             <p className="text-[9px] text-slate-400 max-w-[320px] italic">
               *This is a computer-generated document issued by the Onboarding Department and does not require a physical signature.
             </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-32 h-[2px] bg-[#0f172a] mx-auto opacity-20" />
            <p className="text-xs font-black uppercase tracking-tighter">Managing Director</p>
            <p className="text-[9px] text-slate-500 font-bold">Amaze Ayurveda Pvt. Ltd.</p>
          </div>
        </div>

        {/* Absolute Bottom Badge */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-20 pointer-events-none">
           <div className="flex items-center gap-2 border-t border-slate-900 pt-2 w-[80%] justify-center">
              <Award className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Be Indian • Buy Indian • Grow Indian</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeLetter;