"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
  ShieldCheck, 
  UploadCloud, 
  CreditCard, 
  FileText, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function KYCVerificationPage() {
  const [kycStatus, setKycStatus] = useState<"pending" | "verified" | "rejected">("pending")
  const progress = 65; // Example progress

  return (
    <div className="p-6 space-y-8">
      {/* --- KYC Status Header --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            Security Protocol
          </Badge>
          <h1 className="text-3xl font-black tracking-tight">Identity Verification</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Complete KYC to unlock full payout access</p>
        </div>

        <div className="relative z-10 flex items-center gap-4 bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10">
          <div className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg",
            kycStatus === "pending" ? "bg-orange-500" : "bg-emerald-500"
          )}>
            {kycStatus === "pending" ? <Clock className="text-white w-6 h-6" /> : <ShieldCheck className="text-white w-6 h-6" />}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Status</p>
            <p className="text-sm font-black uppercase">
              {kycStatus === "pending" ? "Verification In-Progress" : "Fully Verified"}
            </p>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
      </header>

      {/* --- Progress Section --- */}
      <div className="space-y-3 px-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Completion</span>
          <span className="text-xs font-black text-emerald-600">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2 bg-slate-100 rounded-full overflow-hidden" />
      </div>

      {/* --- Upload Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KYCUploadCard 
          title="Aadhaar Card" 
          desc="Front & Back (PDF/JPG)" 
          icon={CreditCard} 
          status="completed"
        />
        <KYCUploadCard 
          title="PAN Card" 
          desc="Clear Front Image" 
          icon={FileText} 
          status="pending"
        />
        <KYCUploadCard 
          title="Bank Passbook" 
          desc="For Instant Payouts" 
          icon={Building2} 
          status="empty"
        />
      </div>

      {/* --- Guidelines --- */}
      <Card className="rounded-[2.5rem] border-none bg-orange-50/50 p-8 border border-orange-100">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-orange-600 shrink-0" />
          <div className="space-y-2">
            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Verification Guidelines</h4>
            <ul className="text-xs text-orange-800/80 font-bold space-y-1 list-disc pl-4 leading-relaxed">
              <li>Documents must be clear and readable.</li>
              <li>Names on documents must match your profile name (Ritik Kumar).</li>
              <li>Bank accounts must belong to the registered associate.</li>
              <li>Processing time is typically 24-48 business hours.</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4">
        <Button className="h-14 px-10 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-sm shadow-xl shadow-emerald-200 gap-2">
          Submit Documents for Review <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

// --- SUB-COMPONENT: UPLOAD CARD ---
function KYCUploadCard({ title, desc, icon: Icon, status }: { title: string, desc: string, icon: any, status: "completed" | "pending" | "empty" }) {
  return (
    <Card className={cn(
      "rounded-[2.5rem] border-2 border-dashed transition-all group cursor-pointer overflow-hidden",
      status === "completed" ? "bg-emerald-50/50 border-emerald-200" : "bg-white border-slate-200 hover:border-emerald-500"
    )}>
      <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
        <div className={cn(
          "h-16 w-16 rounded-3xl flex items-center justify-center shadow-inner",
          status === "completed" ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600"
        )}>
          {status === "completed" ? <CheckCircle2 className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
        </div>
        
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{desc}</p>
        </div>

        {status === "completed" ? (
          <Badge className="bg-emerald-500 text-white border-none px-3">Uploaded</Badge>
        ) : (
          <Button variant="ghost" className="text-emerald-600 font-black text-[10px] uppercase tracking-widest gap-2">
            <UploadCloud className="w-4 h-4" /> Select File
          </Button>
        )}
      </CardContent>
    </Card>
  )
}