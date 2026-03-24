"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Download, ShieldCheck, MapPin, Phone, 
  Globe, User, Loader2, CheckCircle, RefreshCw, 
  Mail, Calendar, Sparkles, FileText, Printer,
  Share2, QrCode, IdCard, Award, Zap, ChevronRight
} from "lucide-react";
import html2canvas from "html2canvas-pro"; 
import jsPDF from "jspdf";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

interface DownloadOptions {
  frontOnly?: boolean;
  backOnly?: boolean;
  complete?: boolean;
}

export const PartnerIdentityCard = () => {
  const { data: session } = useSession();
  const username = (session?.user as any)?.username;
  const { data: userData, isLoading } = useUser(username);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [showBack, setShowBack] = useState(false);

  const verificationUrl = `https://amazeayurveda.in/verify/${userData?.username || 'demo'}`;

  const generatePDF = useCallback(async (options: DownloadOptions) => {
    setIsDownloading(true);
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 54]
      });

      if (options.frontOnly || options.complete) {
        const canvasFront = await html2canvas(frontRef.current!, { 
          scale: 4, 
          useCORS: true,
          backgroundColor: '#0f172a',
          logging: false
        });
        pdf.addImage(canvasFront.toDataURL("image/png"), "PNG", 0, 0, 85.6, 54);
      }

      if (options.backOnly) {
        const canvasBack = await html2canvas(backRef.current!, { 
          scale: 4, 
          useCORS: true,
          backgroundColor: '#f8fafc',
          logging: false
        });
        pdf.addImage(canvasBack.toDataURL("image/png"), "PNG", 0, 0, 85.6, 54);
      } else if (options.complete) {
        pdf.addPage([85.6, 54], "l");
        const canvasBack = await html2canvas(backRef.current!, { 
          scale: 4, 
          useCORS: true,
          backgroundColor: '#f8fafc',
          logging: false
        });
        pdf.addImage(canvasBack.toDataURL("image/png"), "PNG", 0, 0, 85.6, 54);
      }

      const fileName = options.frontOnly 
        ? `Amaze_ID_Front_${userData?.username}.pdf`
        : options.backOnly 
        ? `Amaze_ID_Back_${userData?.username}.pdf`
        : `Amaze_ID_Card_${userData?.username}.pdf`;
      
      pdf.save(fileName);
      toast.success("ID Card Downloaded Successfully!");
    } catch (err) {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [userData?.username]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Amaze Ayurveda Partner ID',
          text: `Check out my Partner ID: ${userData?.username}`,
          url: verificationUrl,
        });
      } catch {
        toast.info("Sharing cancelled");
      }
    } else {
      navigator.clipboard.writeText(verificationUrl);
      toast.success("Verification link copied!");
    }
  }, [verificationUrl, userData?.username]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center animate-pulse">
            <IdCard className="w-10 h-10 text-white" />
          </div>
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-emerald-500/30 animate-ping" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-bold text-slate-800">Loading Your Card</p>
          <p className="text-sm text-slate-500">Please wait...</p>
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
          <User className="w-10 h-10 text-slate-400" />
        </div>
        <p className="text-lg font-semibold text-slate-600">Please login to view your ID Card</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-200 rounded-full px-4 py-2 mb-4">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Official Partner Document</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Your Partner <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Identity Card</span>
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Your official Amaze Ayurveda partner identification with QR verification for instant authentication
        </p>
      </motion.div>

      {/* Main Card Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative mb-10"
      >
        {/* Ambient Glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 rounded-[3rem] opacity-20 blur-3xl" />
        
        {/* Card Container */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-[2rem] p-8 md:p-12 shadow-2xl">
          {/* Floating Badge */}
          <div className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
            <Award className="w-4 h-4 text-white" />
            <span className="text-xs font-bold text-white uppercase">Verified Partner</span>
          </div>

          {/* Card Display */}
          <div className="relative">
            {/* Flip Toggle */}
            <button 
              onClick={() => setShowBack(!showBack)}
              className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-50 bg-white hover:bg-emerald-50 rounded-full p-3 md:p-4 shadow-xl transition-all hover:scale-110 active:scale-95 group"
            >
              <RefreshCw className={cn(
                "w-5 h-5 md:w-6 md:h-6 text-slate-700 transition-transform duration-500 group-hover:text-emerald-600",
                showBack && "rotate-180"
              )} />
            </button>

            {/* Card Wrapper */}
            <div className="flex justify-center">
              <AnimatePresence mode="wait">
                {!showBack ? (
                  <motion.div
                    key="front"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div 
                      ref={frontRef} 
                      style={{ width: '85.6mm', height: '54mm' }} 
                      className="rounded-[16px] flex overflow-hidden shadow-2xl"
                    >
                      {/* Left Panel - Brand */}
                      <div className="w-[32%] bg-gradient-to-b from-emerald-600 to-emerald-800 flex flex-col items-center justify-center p-3 relative">
                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-white rounded-full blur-2xl" />
                          <div className="absolute bottom-0 left-0 w-12 h-12 bg-emerald-300 rounded-full blur-xl" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col items-center gap-1.5">
                          <div className="relative">
                            <Image src="/amaze-logo.png" width={48} height={48} alt="Logo" className="drop-shadow-lg" />
                            <div className="absolute -inset-1 bg-emerald-400/30 rounded-full blur-md" />
                          </div>
                          <h4 className="text-[10px] font-black text-white uppercase tracking-wider">Amaze</h4>
                          <p className="text-[7px] font-bold text-emerald-200 uppercase tracking-widest">Ayurveda</p>
                        </div>

                        <div className="absolute bottom-3 z-10 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-white" />
                          <span className="text-[6px] font-bold text-white">Verified</span>
                        </div>
                      </div>

                      {/* Right Panel - Details */}
                      <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 p-4 flex flex-col justify-between relative">
                        {/* Top Section */}
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h2 className="text-[12px] font-black text-white leading-tight tracking-wide uppercase">
                              {userData.name || 'Partner Name'}
                            </h2>
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                                ID: {userData.username}
                              </span>
                            </div>
                          </div>
                          
                          {/* Photo */}
                          <div className="relative">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 p-0.5">
                              {userData.photoUrl ? (
                                <img src={userData.photoUrl} alt="Partner" className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <div className="w-full h-full rounded-lg bg-slate-700 flex items-center justify-center">
                                  <User className="w-6 h-6 text-slate-400" />
                                </div>
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span className="text-[7px] font-semibold">+91 {userData.mobile}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Globe className="w-3 h-3 text-emerald-400" />
                            <span className="text-[7px] font-semibold">amazeayurveda.in</span>
                          </div>
                        </div>

                        {/* Bottom Strip */}
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className="text-[6px] font-medium text-slate-400">
                              Since: {userData.createdAt 
                                ? new Date(userData.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) 
                                : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-400">
                            <QrCode className="w-3 h-3" />
                            <span className="text-[6px] font-semibold">Scan to Verify</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div 
                      ref={backRef} 
                      style={{ width: '85.6mm', height: '54mm' }} 
                      className="rounded-[16px] flex flex-col p-4 bg-gradient-to-br from-slate-50 to-white shadow-2xl overflow-hidden relative"
                    >
                      {/* Watermark */}
                      <div className="absolute inset-0 opacity-[0.04] flex items-center justify-center pointer-events-none">
                        <Image src="/amaze-logo.png" alt="" width={120} height={120} className="grayscale" />
                      </div>

                      {/* Main Content */}
                      <div className="flex justify-between items-start relative z-10 flex-1">
                        {/* Left - Address */}
                        <div className="flex flex-col justify-between h-full py-1 pr-3">
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-2">
                              <div className="bg-emerald-100 p-1.5 rounded-lg">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              </div>
                              <p className="text-[7px] font-black text-slate-700 uppercase tracking-wider">Address</p>
                            </div>
                            <p className="text-[7px] text-slate-600 leading-relaxed font-medium max-w-[115px]">
                              {userData.address}, {userData.district}, {userData.state} - {userData.pincode}
                            </p>
                          </div>

                          <div className="space-y-2">
                            {userData.email && (
                              <div className="flex items-center gap-1.5 text-slate-500">
                                <Mail className="w-2.5 h-2.5 text-emerald-500" />
                                <span className="text-[6px] font-medium truncate max-w-[100px]">{userData.email}</span>
                              </div>
                            )}
                            <p className="text-[5px] text-slate-400 max-w-[120px] leading-tight">
                              Property of Amaze Ayurveda Pvt. Ltd. If found, return to nearest corporate office.
                            </p>
                            <div className="flex items-center gap-1.5 bg-emerald-100 w-fit px-2 py-1 rounded-full">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span className="text-[6px] font-bold text-emerald-700 uppercase tracking-wide">Swadeshi Partner</span>
                            </div>
                          </div>
                        </div>

                        {/* Right - QR */}
                        <div className="flex flex-col items-center justify-center gap-1.5 border-l-2 border-slate-200 pl-3 h-full">
                          <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-100 relative">
                            <QRCodeSVG 
                              value={verificationUrl} 
                              size={65} 
                              level="H"
                              bgColor="#ffffff"
                              fgColor="#0f172a"
                              imageSettings={{
                                src: "/amaze-logo.png",
                                height: 12,
                                width: 12,
                                excavate: true,
                              }}
                            />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-2.5 h-2.5 text-white" />
                            </div>
                          </div>
                          <p className="text-[6px] font-bold text-slate-500 uppercase tracking-widest">Verify</p>
                          <p className="text-[5px] text-slate-400 text-center max-w-[55px]">Authentic</p>
                        </div>
                      </div>

                      {/* Bottom Bar */}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 relative z-10">
                        <div className="flex items-center gap-2">
                          <Image src="/amaze-logo.png" width={14} height={14} alt="Logo" className="opacity-50" />
                          <span className="text-[5px] font-bold text-slate-400 uppercase tracking-wider">Amaze Ayurveda</span>
                        </div>
                        <span className="text-[4px] text-slate-400">CIN: U82990BR2023PTC066853</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Side Indicator */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <div className={cn(
              "w-1 h-8 rounded-full transition-all duration-300",
              !showBack ? "bg-emerald-500" : "bg-slate-300"
            )} />
            <div className={cn(
              "w-1 h-8 rounded-full transition-all duration-300",
              showBack ? "bg-emerald-500" : "bg-slate-300"
            )} />
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4"
      >
        <Button 
          onClick={() => generatePDF({ complete: true })}
          disabled={isDownloading}
          className="col-span-2 md:col-span-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold h-14 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-105 flex-col gap-1 py-2"
        >
          {isDownloading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span className="text-[10px]">Complete PDF</span>
        </Button>

        <Button 
          onClick={() => generatePDF({ frontOnly: true })}
          disabled={isDownloading}
          variant="outline"
          className="h-14 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 font-semibold text-slate-700 transition-all flex-col gap-1 py-2 bg-white"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px]">Front Only</span>
        </Button>

        <Button 
          onClick={() => generatePDF({ backOnly: true })}
          disabled={isDownloading}
          variant="outline"
          className="h-14 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 font-semibold text-slate-700 transition-all flex-col gap-1 py-2 bg-white"
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[10px]">Back Only</span>
        </Button>

        <Button 
          onClick={() => window.print()}
          variant="outline"
          className="h-14 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 font-semibold text-slate-700 transition-all flex-col gap-1 py-2 bg-white"
        >
          <Printer className="w-5 h-5" />
          <span className="text-[10px]">Print</span>
        </Button>

        <Button 
          onClick={handleShare}
          variant="outline"
          className="h-14 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 font-semibold text-slate-700 transition-all flex-col gap-1 py-2 bg-white"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-[10px]">Share</span>
        </Button>
      </motion.div>

      {/* Status Badges */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4 mt-8"
      >
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">Card Active</span>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700">Verified Partner</span>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
          <Zap className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700">QR Enabled</span>
        </div>
      </motion.div>
    </div>
  );
};
