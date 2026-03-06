"use client";

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, ShieldCheck, Flag, Award, Loader2, CheckCircle } from "lucide-react";
import html2canvas from "html2canvas-pro"; 
import jsPDF from "jspdf";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner"; // Assuming you use sonner for toasts

const WelcomeLetter = () => {
  const { data: session } = useSession();
  const username = (session?.user as any)?.username;
  const { data: userData, isLoading } = useUser(username);
  
  const letterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    const element = letterRef.current;
    if (!element) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: "#ffffff",
        windowWidth: 800, // Forces the renderer to see a consistent desktop width
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      pdf.save(`Welcome_Letter_${userData?.username}.pdf`);

      // --- SUCCESS TOAST ---
      toast.success("Document Downloaded", {
        description: "Your official onboarding letter is now saved.",
        icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
      });

    } catch (error) {
      toast.error("Download Failed", { description: "Please try again or check your connection." });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="flex flex-col items-center gap-8 py-12 min-h-screen bg-slate-50/50 px-4">
      {/* Action Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-6 bg-white p-5 rounded-3xl shadow-xl border border-slate-200 w-full max-w-[210mm]"
      >
        <div className="flex-1">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Onboarding Gateway</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Amaze Ayurveda Official Letter</p>
        </div>
        <Button 
          onClick={downloadPDF} 
          disabled={isDownloading}
          className="bg-[#059669] hover:bg-[#047857] text-white gap-3 font-black rounded-2xl h-14 px-8 shadow-lg shadow-emerald-200 transition-all active:scale-95"
        >
          {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          {isDownloading ? "Capturing..." : "Download PDF"}
        </Button>
      </motion.div>

      {/* --- Letter Canvas (Fixed Positioning) --- */}
      <div className="w-full flex justify-center overflow-auto pb-20 no-scrollbar">
        <div className="scale-[0.4] sm:scale-[0.8] md:scale-[0.8] lg:scale-100 origin-top shadow-2xl">
          <div 
            ref={letterRef} 
            style={{ 
              width: '210mm', 
              height: '297mm',
              backgroundColor: '#ffffff',
              position: 'relative',
              padding: '25mm',
              boxSizing: 'border-box'
            }}
          >
            {/* 1. Watermark (Pinned to Center) */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.03, pointerEvents: 'none' }}>
                <img src="/amaze-logo.png" alt="watermark" style={{ width: '140mm' }} />
            </div>

            {/* 2. Header (Using Table for Perfect Alignment) */}
            <table style={{ width: '100%', borderBottom: '2px solid #059669', paddingBottom: '20px', marginBottom: '40px' }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                       <img src="/amaze-logo.png" alt="Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                       <div>
                         <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1 }}>AMAZE AYURVEDA</h1>
                         <p style={{ fontSize: '10px', fontWeight: 800, color: '#059669', letterSpacing: '4px', margin: '4px 0 0 0' }}>PRIVATE LIMITED</p>
                       </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                    <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                      <p style={{ margin: 0 }}>CIN: U85100DL2026PTC000000</p>
                      <p style={{ margin: '2px 0' }}>ISO 9001:2015 Certified</p>
                      <p style={{ color: '#059669', textDecoration: 'underline', margin: 0 }}>www.amazeayurveda.in</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 3. Recipient Details */}
            <div style={{ marginBottom: '40px', borderLeft: '4px solid #059669', paddingLeft: '20px' }}>
              <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>
                DATE OF ISSUE: {userData?.joiningDate}
              </p>
              <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#1e293b', margin: 0, textTransform: 'uppercase' }}>
                TO, {userData?.name}
              </h2>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '5px' }}>
                ASSOCIATE ID: <span style={{ color: '#059669', fontWeight: 900 }}>{userData?.username}</span>
              </p>
            </div>

            {/* 4. Letter Body */}
            <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#334155', textAlign: 'justify' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '20px' }}>
                SUBJECT: OFFICIAL ONBOARDING & WELCOME LETTER
              </h3>
              
              <p>Dear <span style={{ fontWeight: 800, color: '#0f172a' }}>{userData?.name}</span>,</p>
              
              <p>
                We are proud to welcome you as a verified Independent Business Partner. At <strong>Amaze Ayurveda</strong>, 
                we are committed to the <strong>Swadeshi Movement</strong>, empowering every Indian with health and prosperity.
              </p>

              {/* Info Box (Absolute Stability) */}
              <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0', margin: '30px 0', display: 'table', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'table-cell', width: '50%' }}>
                  <p style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px', margin: 0 }}>SPONSOR</p>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '5px 0 0 0' }}>{userData?.sponsorName || 'DIRECT'}</p>
                </div>
                <div style={{ display: 'table-cell', width: '50%', textAlign: 'right' }}>
                  <p style={{ fontSize: '9px', fontWeight: 900, color: '#059669', letterSpacing: '1px', margin: 0 }}>PLAN TYPE</p>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: '#065f46', margin: '5px 0 0 0' }}>15-LEVEL HYBRID</p>
                </div>
              </div>

              <p>
                Your partnership status is now <strong>Active</strong>. We encourage you to lead with integrity as you build your 
                genealogy network and promote wellness across the nation.
              </p>

              <p style={{ fontWeight: 900, marginTop: '40px', color: '#0f172a', fontSize: '18px' }}>Be Indian • Buy Indian • Grow Indian</p>
            </div>

            {/* 5. Footer (Pinned to Bottom) */}
            <div style={{ position: 'absolute', bottom: '30mm', left: '25mm', right: '25mm' }}>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '10px' }}>
                        <ShieldCheck size={20} />
                        <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1px' }}>VERIFIED PARTNER</span>
                      </div>
                      <p style={{ fontSize: '8px', color: '#94a3b8', maxWidth: '300px', lineHeight: 1.4 }}>
                        *This is a computer-generated onboarding document. Valid without physical signature.
                      </p>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ width: '140px', height: '1px', background: '#0f172a', opacity: 0.2, margin: '0 auto 10px' }} />
                      <p style={{ fontSize: '12px', fontWeight: 900, margin: 0 }}>Managing Director</p>
                      <p style={{ fontSize: '8px', color: '#94a3b8', fontWeight: 700, margin: 0 }}>AMAZE AYURVEDA PVT. LTD.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 6. Bottom Banner */}
            <div style={{ position: 'absolute', bottom: '10mm', left: '0', right: '0', textAlign: 'center', opacity: 0.2 }}>
               <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '5px', color: '#000' }}>WWW.AMAZEAYURVEDA.IN</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeLetter;