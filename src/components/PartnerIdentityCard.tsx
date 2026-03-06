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
import { QRCodeSVG } from "qrcode.react";

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

      const canvasFront = await html2canvas(frontRef.current!, { scale: 4, useCORS: true });
      pdf.addImage(canvasFront.toDataURL("image/png"), "PNG", 0, 0, 85.6, 54);

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

  const verificationUrl = `https://amazeayurveda.in/verify/${userData.username}`;

  return (
    <div className="flex flex-col items-center gap-6 py-10 w-full px-4">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Partner Identity Card</h3>
        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.2em]">Front & Back Verification</p>
      </div>

      <div className="relative group">
        <button 
          onClick={() => setShowBack(!showBack)}
          className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white shadow-xl p-3 rounded-full hover:bg-emerald-50 transition-colors z-50 border border-slate-100"
        >
          <RefreshCw className={cn("w-5 h-5 text-emerald-600 transition-transform duration-500", showBack && "rotate-180")} />
        </button>

        <div className="w-full flex justify-center items-center overflow-hidden h-[280px]">
          <div className="scale-[0.7] sm:scale-100 origin-center transition-all duration-500">
            
            {/* FRONT SIDE */}
            <div className={cn(showBack ? "hidden" : "block")}>
              <div ref={frontRef} style={{ width: '85.6mm', height: '54mm' }} className="rounded-[18px] shadow-2xl flex bg-white border border-slate-100 overflow-hidden">
                <div className="w-[35%] bg-[#0f172a] flex flex-col items-center justify-center p-4">
                    <Image src="/amaze-logo.png" width={50} height={50} alt="Logo" className="mb-2" />
                    <h4 className="text-[10px] font-black text-white uppercase tracking-tighter">Amaze</h4>
                    <p className="text-[8px] font-bold text-[#10b981] uppercase">Ayurveda</p>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between relative">
                    <div>
                        <h2 className="text-[12px] font-black text-[#0f172a] uppercase leading-tight">{userData.name}</h2>
                        <p className="text-[9px] font-bold text-emerald-600">ID: {userData.username}</p>
                    </div>

                    {/* PHOTO INTEGRATION */}
                    <div className="absolute top-16 right-6 w-16 h-16 rounded-xl bg-slate-100 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                        {userData.photoUrl ? (
                          <img src={userData.photoUrl} alt="Partner" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-8 h-8 text-slate-300" />
                        )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="w-2.5 h-2.5 text-emerald-600" />
                        <span className="text-[8px] font-bold">+91 {userData.mobile}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Globe className="w-2.5 h-2.5 text-emerald-600" />
                        <span className="text-[8px] font-bold tracking-tight">amazeayurveda.in</span>
                      </div>
                    </div>
                </div>
              </div>
            </div>

            {/* BACK SIDE */}
            <div className={cn(!showBack ? "hidden" : "block")}>
              <div 
                ref={backRef} 
                style={{ width: '85.6mm', height: '54mm', backgroundColor: '#f8fafc' }} 
                className="rounded-[18px] shadow-2xl flex flex-col p-5 border border-slate-100 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <img src="/amaze-logo.png" alt="pattern" className="w-full h-full object-cover" />
                </div>

                <div className="flex justify-between items-start z-10 h-full">
                  {/* ADDRESS SECTION */}
                  <div className="w-[60%] flex flex-col justify-between h-full py-1">
                    <div className="space-y-2">
                       <div className="flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                          <p className="text-[7px] font-black text-slate-900 uppercase tracking-widest">Address</p>
                       </div>
                       <p className="text-[7px] text-slate-600 leading-relaxed font-bold uppercase pr-4">
                          {userData.address}, {userData.district}, <br />
                          {userData.state} - {userData.pincode}
                       </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[5px] font-bold text-slate-400 max-w-[140px] leading-tight">
                        This card is property of Amaze Ayurveda Pvt. Ltd. If found, please return to the nearest corporate office.
                      </p>
                      <p className="text-[7px] font-black text-emerald-600 uppercase tracking-[0.2em]">Verified Swadeshi Partner</p>
                    </div>
                  </div>

                  {/* QR SECTION */}
                  <div className="w-[40%] flex flex-col items-center justify-center gap-2 border-l border-slate-200 pl-4 h-full">
                    <div className="bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                      <QRCodeSVG 
                        value={verificationUrl} 
                        size={65} 
                        level="H"
                        imageSettings={{
                            src: "/amaze-logo.png",
                            height: 12,
                            width: 12,
                            excavate: true,
                        }}
                      />
                    </div>
                    <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest">Scan to Verify</p>
                  </div>
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