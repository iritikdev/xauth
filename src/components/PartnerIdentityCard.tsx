"use client";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Download, ShieldCheck, MapPin, Phone, 
  Globe, User, Loader2, CheckCircle, RefreshCw 
} from "lucide-react";
import html2canvas from "html2canvas-pro"; 
import jsPDF from "jspdf";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react"; // Standard SVG QR library

export const PartnerIdentityCard = () => {
  const { data: session } = useSession();
  const username = (session?.user as any)?.username;
  const { data: userData, isLoading } = useUser(username);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [showBack, setShowBack] = useState(false);

  const downloadID = async () => {
    setIsDownloading(true);
    try {
      const pdf = new jsPDF("l", "mm", [85.6, 54]);

      // Capture Front
      const canvasFront = await html2canvas(frontRef.current!, { scale: 4, useCORS: true });
      pdf.addImage(canvasFront.toDataURL("image/png"), "PNG", 0, 0, 85.6, 54);

      // Add Page for Back
      pdf.addPage([85.6, 54], "l");
      const canvasBack = await html2canvas(backRef.current!, { scale: 4, useCORS: true });
      pdf.addImage(canvasBack.toDataURL("image/png"), "PNG", 0, 0, 85.6, 54);

      pdf.save(`Amaze_ID_Complete_${userData?.username}.pdf`);
      toast.success("Double-Sided ID Ready");
    } catch (err) {
      toast.error("Generation Failed");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading || !userData) return null;

  // The URL that the QR code will point to
  const verificationUrl = `https://amazeayurveda.in/verify/${userData.username}`;

  return (
    <div className="flex flex-col items-center gap-6 py-10 w-full px-4">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Partner Identity Card</h3>
        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.2em]">Front & Back Verification</p>
      </div>

      <div className="relative group">
        {/* Flip Toggle Button */}
        <button 
          onClick={() => setShowBack(!showBack)}
          className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white shadow-xl p-3 rounded-full hover:bg-emerald-50 transition-colors z-50 border border-slate-100"
        >
          <RefreshCw className={cn("w-5 h-5 text-emerald-600 transition-transform duration-500", showBack && "rotate-180")} />
        </button>

        <div className="w-full flex justify-center items-center overflow-hidden h-[280px]">
          <div className="scale-[0.7] sm:scale-100 origin-center">
            
            {/* FRONT SIDE */}
            <div className={cn(showBack ? "hidden" : "block")}>
              <div ref={frontRef} style={{ width: '85.6mm', height: '54mm' }} className="rounded-[18px] shadow-2xl flex bg-white border border-slate-100 overflow-hidden">
                {/* ... (Previous Front Side Code Here) ... */}
                <div className="w-[35%] bg-[#0f172a] flex flex-col items-center justify-center p-4">
                    <Image src="/amaze-logo.png" width={50} height={50} alt="Logo" className=" mb-2" />
                    <h4 className="text-[10px] font-black text-white uppercase tracking-tighter">Amaze</h4>
                    <p className="text-[8px] font-bold text-[#10b981] uppercase">Ayurveda</p>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-[16px] font-black text-[#0f172a] uppercase">{userData.name}</h2>
                        <p className="text-[9px] font-bold text-emerald-600">ID: {userData.username}</p>
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-slate-100 self-end border-2 border-white shadow-md overflow-hidden">
                        <User className="w-full h-full p-2 text-slate-300" />
                    </div>
                </div>
              </div>
            </div>

            {/* BACK SIDE (WITH QR) */}
            <div className={cn(!showBack ? "hidden" : "block")}>
              <div 
                ref={backRef} 
                style={{ width: '85.6mm', height: '54mm', backgroundColor: '#f8fafc' }} 
                className="rounded-[18px] shadow-2xl flex flex-col items-center justify-between p-6 border border-slate-100 text-center relative"
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <img src="/amaze-logo.png" alt="pattern" className="w-full h-full object-cover" />
                </div>

                <div className="space-y-1 z-10">
                    <p className="text-[8px] font-black text-slate-900 uppercase">Scan to Verify Associate</p>
                    <div className="h-[0.5px] w-12 bg-emerald-500 mx-auto" />
                </div>

                {/* The QR Code */}
                <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-100 z-10">
                  <QRCodeSVG 
                    value={verificationUrl} 
                    size={70} 
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                        src: "/amaze-logo.png",
                        x: undefined,
                        y: undefined,
                        height: 15,
                        width: 15,
                        excavate: true,
                    }}
                  />
                </div>

                <div className="z-10 space-y-1">
                    <p className="text-[6px] font-bold text-slate-500 max-w-[180px] leading-tight">
                        This card is property of Amaze Ayurveda Pvt. Ltd. If found, please return to the nearest corporate office.
                    </p>
                    <p className="text-[7px] font-black text-emerald-600 tracking-widest uppercase">www.amazeayurveda.in</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Button 
        onClick={downloadID} 
        disabled={isDownloading}
        className="bg-[#0f172a] hover:bg-emerald-600 text-white font-black h-16 px-12 rounded-2xl shadow-2xl transition-all"
      >
        {isDownloading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Download className="w-5 h-5 mr-3" />}
        Download Double-Sided PDF
      </Button>
    </div>
  );
};