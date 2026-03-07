"use client";

import React, { useRef, useState } from "react";
import {
  ShieldCheck,
  User,
  MapPin,
  Building2,
  CheckCircle2,
  Printer,
  Edit3,
  Loader2,
  Phone,
  Mail,
  Fingerprint,
  Landmark,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import Image from "next/image";

interface UserProfileSummaryProps {
  userData: any;
  onEdit: () => void;
}

export default function UserProfileSummary({
  userData,
  onEdit,
}: UserProfileSummaryProps) {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const downloadKYCPDF = async () => {
    const element = summaryRef.current;
    if (!element) return;

    setIsPrinting(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`UserProfile_${userData?.username || "Associate"}.pdf`);
    } catch (error) {
      console.error("PDF Export failed", error);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="px-4 md:p-8 space-y-8 pb-20">
      {/* --- Capturable Area Start --- */}
      <div
        ref={summaryRef}
        className="bg-white p-2 md:p-8 rounded-[3rem] border border-slate-100 shadow-sm"
      >
        {/* Header Section */}
        <header className="bg-[#0f172a] p-8 md:p-12 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl mb-16">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left space-y-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Authenticated Swadeshi Associate
              </Badge>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                {userData?.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">
                  ID: {userData?.username}
                </p>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">
                  Sponsor: {userData?.sponsorName || "Direct"}
                </p>
              </div>
            </div>

            {/* User Photo / Avatar Section */}
            <div className="relative group">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden bg-slate-100 relative transition-transform duration-500 group-hover:scale-105">
                {userData?.photoUrl ? (
                  <Image
                    src={userData.photoUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-300">
                    <User size={64} />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl border-4 border-[#0f172a] shadow-lg">
                <ShieldCheck size={20} />
              </div>
            </div>
          </div>

          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
        </header>

        {/* Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DataSection
            title="Personal & Identity"
            icon={Fingerprint}
            items={[
              {
                label: "Father's Name",
                value: userData?.fatherName,
                icon: User,
              },
              { label: "Email Address", value: userData?.email, icon: Mail },
              { label: "Mobile Number", value: userData?.mobile, icon: Phone },
              {
                label: "Aadhaar Card",
                value: `XXXX-XXXX-${userData?.aadharNo?.slice(-4)}`,
                isVerified: true,
              },
              {
                label: "PAN Card",
                value: userData?.panNumber,
                isVerified: true,
              },
            ]}
          />

          <DataSection
            title="Banking & Payouts"
            icon={Landmark}
            items={[
              {
                label: "Bank Name",
                value: userData?.branch?.split("-")[0] || "Verified Bank",
              },
              { label: "Account No", value: userData?.accountNo },
              {
                label: "UPI ID (VPA)",
                value: userData?.upiId,
                isVerified: true,
              }, // Added UPI
              { label: "IFSC Code", value: userData?.ifsc, isVerified: true },
              {
                label: "Branch Name",
                value: userData?.branch?.split("-")[1] || "Main Branch",
              },
            ]}
          />
          <DataSection
            title="Succession & Nominee"
            icon={ShieldCheck}
            items={[
              { label: "Nominee Name", value: userData?.nomineeName },
              { label: "Relationship", value: userData?.nomineeRelation },
              { label: "Mobile Number", value: userData?.nomineeMobile },
              {
                label: "Aadhaar Number",
                value: `XXXX-XXXX-${userData?.nomineeAadhaar?.slice(-4)}`,
                isVerified: true,
              },
            ]}
          />
          <DataSection
            title="Registered Address"
            icon={MapPin}
            items={[
              { label: "Permanent Address", value: userData?.address },
              { label: "City & District", value: userData?.district },
              {
                label: "State & Pincode",
                value: `${userData?.state} - ${userData?.pincode}`,
                isVerified: true,
              },
            ]}
          />
        </div>

        {/* PDF-Only Slogan */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex justify-center items-center gap-4 opacity-30">
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">
            Be Indian
          </span>
          <div className="h-1 w-1 bg-slate-900 rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">
            Buy Indian
          </span>
          <div className="h-1 w-1 bg-slate-900 rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">
            Grow Indian
          </span>
        </div>
      </div>
      {/* --- Capturable Area End --- */}

      {/* Action Buttons (Excluded from Ref) */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 no-print">
        <Button
          variant="outline"
          onClick={onEdit}
          className="h-16 px-10 rounded-2xl border-slate-200 font-black text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-all gap-3 w-full sm:w-auto shadow-sm"
        >
          <Edit3 className="w-5 h-5" /> Edit Profile Details
        </Button>
        <Button
          onClick={downloadKYCPDF}
          disabled={isPrinting}
          className="h-16 px-12 rounded-2xl bg-[#0f172a] hover:bg-emerald-600 text-white font-black text-lg shadow-2xl shadow-slate-200 gap-3 w-full sm:w-auto transition-all"
        >
          {isPrinting ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Printer className="w-6 h-6" />
          )}
          {isPrinting ? "Securing PDF..." : "Download Profile PDF"}
        </Button>
      </div>
    </div>
  );
}

function DataSection({
  title,
  icon: TitleIcon,
  items,
}: {
  title: string;
  icon: any;
  items: any[];
}) {
  return (
    <Card className="rounded-[2.5rem] border-none bg-slate-50/50 p-8 space-y-6">
      <div className="flex items-center gap-3 pb-2">
        <TitleIcon className="w-5 h-5 text-emerald-600" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          {title}
        </h3>
      </div>
      <div className="space-y-5">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-start group">
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                {item.label}
              </p>
              <p className="text-sm font-black text-slate-900 tracking-tight leading-none break-all">
                {item.value || "---"}
              </p>
            </div>
            {item.isVerified && (
              <div className="bg-emerald-100 p-1 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
