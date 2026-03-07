"use client"

import React, { useEffect, useState, useRef } from "react"
import { 
  ShieldCheck, UploadCloud, CreditCard, FileText, Building2, 
  CheckCircle2, Clock, AlertCircle, ArrowRight, Loader2,
  Eye, ExternalLink, RefreshCw
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import confetti from "canvas-confetti"

interface KYCData {
  aadharUrl?: string;
  panUrl?: string;
  passbookUrl?: string;
  status: "NOT_SUBMITTED" | "PENDING" | "VERIFIED" | "REJECTED";
}

export default function KYCVerification({ username }: { username: string }) {
  const queryClient = useQueryClient();
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [uploads, setUploads] = useState({
    aadhaar: "",
    pan: "",
    passbook: ""
  });

  // 1. FETCH PERSISTED DATA FROM PRISMA
  const { data: kycData, isLoading } = useQuery<KYCData>({
    queryKey: ["kyc", username],
    queryFn: async () => {
      const res = await fetch(`/api/user/${username}/kyc`);
      if (!res.ok) throw new Error("Failed to load KYC");
      return res.json();
    }
  });

  // 2. SYNC LOCAL STATE WITH DB DATA
  useEffect(() => {
    if (kycData) {
      setUploads({
        aadhaar: kycData.aadharUrl || "",
        pan: kycData.panUrl || "",
        passbook: kycData.passbookUrl || ""
      });
    }
  }, [kycData]);

  // 3. CELEBRATION LOGIC (Emerald & Gold Theme)
  const completedCount = Object.values(uploads).filter(Boolean).length;
  
  useEffect(() => {
    if (completedCount === 3 && !hasCelebrated) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#10b981', '#fbbf24'] });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#10b981', '#fbbf24'] });
      }, 250);

      setHasCelebrated(true);
      toast.success("All documents synced!", { description: "Ready for final authentication." });
    }
  }, [completedCount, hasCelebrated]);

  // 4. UPLOAD MUTATION
  const uploadMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File, type: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("username", username);
      formData.append("docType", type);

      const res = await fetch("/api/user/upload-kyc", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc", username] });
    },
    onError: (error: any) => toast.error(error.message || "Upload failed")
  });

  const handleFileSelect = (file: File, type: string) => {
    if (file.size > 300 * 1024) {
      toast.error("File too large!", { description: "Maximum allowed size is 300KB." });
      return;
    }
    uploadMutation.mutate({ file, type });
  };

  const progress = Math.round((completedCount / 3) * 100);

  if (isLoading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verifying Security Session...</p>
    </div>
  );

  return (
    <div className="p-6 space-y-8 ">
      {/* --- Header Section --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0f172a] p-8 md:p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            Identity Protection
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">KYC Verification</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Digital on-boarding for Swadeshi Associates</p>
        </div>

        <div className="relative z-10 flex items-center gap-4 bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10">
          <div className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-all",
            kycData?.status === "VERIFIED" ? "bg-emerald-500 shadow-emerald-500/20" : "bg-orange-500 shadow-orange-500/20"
          )}>
            {kycData?.status === "VERIFIED" ? <ShieldCheck className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Status</p>
            <p className="text-sm font-black uppercase tracking-tight">{kycData?.status || "NOT_SUBMITTED"}</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
      </header>

      {/* --- Progress --- */}
      <div className="space-y-3 px-6">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KYC Completion</span>
          <span className="text-sm font-black text-emerald-600">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2.5 bg-slate-100 rounded-full" />
      </div>

      {/* --- Cards Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KYCUploadCard 
          title="Aadhaar Card" 
          desc="Front & Back (Max 300KB)" 
          icon={CreditCard} 
          fileUrl={uploads.aadhaar}
          isPending={uploadMutation.isPending && uploadMutation.variables?.type === "aadhaar"}
          onFileSelect={(file: File) => handleFileSelect(file, "aadhaar")}
          onReplace={() => setUploads(p => ({ ...p, aadhaar: "" }))}
        />
        <KYCUploadCard 
          title="PAN Card" 
          desc="Clear Front Photo" 
          icon={FileText} 
          fileUrl={uploads.pan}
          isPending={uploadMutation.isPending && uploadMutation.variables?.type === "pan"}
          onFileSelect={(file: File) => handleFileSelect(file, "pan")}
          onReplace={() => setUploads(p => ({ ...p, pan: "" }))}
        />
        <KYCUploadCard 
          title="Bank Passbook" 
          desc="For Secure Payouts" 
          icon={Building2} 
          fileUrl={uploads.passbook}
          isPending={uploadMutation.isPending && uploadMutation.variables?.type === "passbook"}
          onFileSelect={(file: File) => handleFileSelect(file, "passbook")}
          onReplace={() => setUploads(p => ({ ...p, passbook: "" }))}
        />
      </div>

      <div className="flex justify-end pt-6">
        <Button 
          disabled={completedCount < 3}
          className={cn(
            "h-16 px-12 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all gap-3 active:scale-95",
            completedCount === 3 ? "bg-[#0f172a] hover:bg-emerald-600" : "bg-slate-200 text-slate-400"
          )}
        >
          Submit Documents for Review <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

function KYCUploadCard({ title, desc, icon: Icon, fileUrl, isPending, onFileSelect, onReplace }: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isUploaded = !!fileUrl;

  return (
    <Card className={cn(
      "rounded-[2.5rem] border-2 border-dashed transition-all group overflow-hidden relative",
      isUploaded ? "bg-emerald-50/50 border-emerald-200" : "bg-white border-slate-200 hover:border-emerald-500"
    )}>
      <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
        <input 
          type="file" 
          className="hidden" 
          ref={inputRef} 
          accept="image/jpeg,image/png,application/pdf"
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        />
        
        <div className={cn(
          "h-20 w-20 rounded-[2rem] flex items-center justify-center shadow-inner transition-all duration-500",
          isUploaded ? "bg-emerald-500 text-white rotate-[360deg]" : "bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600"
        )}>
          {isPending ? <Loader2 className="animate-spin w-10 h-10" /> : isUploaded ? <CheckCircle2 className="w-10 h-10" /> : <Icon className="w-10 h-10" />}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">{title}</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{desc}</p>
        </div>

        {isUploaded ? (
          <div className="flex flex-col gap-3 w-full animate-in fade-in slide-in-from-bottom-4">
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white border border-emerald-100 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            >
              <Eye size={16} /> View Document
            </a>
            <button 
              onClick={onReplace}
              className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-colors py-2"
            >
              <RefreshCw size={12} /> Replace File
            </button>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
            className="text-emerald-600 font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-emerald-50 h-12 px-8 rounded-xl"
          >
            {isPending ? "Syncing..." : <><UploadCloud className="w-5 h-5" /> Select File</>}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}