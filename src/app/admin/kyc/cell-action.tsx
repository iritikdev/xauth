"use client";

import { useState } from "react";
import { Check, X, Eye, User, CreditCard, Landmark, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateKycStatus } from "@/lib/actions/kyc";
import { KycStatus } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const KycCellAction = ({ data }: { data: any }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleUpdate = async (status: KycStatus) => {
    setLoading(true);
    try {
      const res = await updateKycStatus(data.id, status);
      if (res.success) {
        toast.success(`KYC ${status.toLowerCase()}!`);
        setOpen(false);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const kyc = data.kycDocument;

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-xl font-bold gap-2 border-emerald-100 text-emerald-700 hover:bg-emerald-50">
            <Eye className="h-4 w-4" /> Review Detail
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-y-auto rounded-[2rem] max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              Associate Verification
              <Badge className={cn(
                kyc.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
              )}>
                {kyc.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1  gap-6 py-4">
            {/* User Info Section */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personal & Bank Details</h4>
              <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                <DetailRow icon={<User size={14}/>} label="Name" value={data.name} />
                <DetailRow icon={<FileText size={14}/>} label="PAN" value={kyc.panNumber} />
                <DetailRow icon={<FileText size={14}/>} label="Aadhar No" value={kyc.aadharNo} />
                <DetailRow icon={<Landmark size={14}/>} label="A/C No" value={data.accountNo} />
                <DetailRow icon={<Landmark size={14}/>} label="IFSC" value={data.ifsc} />
                <DetailRow icon={<Landmark size={14}/>} label="Bank" value={data.branch} />
              </div>
            </div>

            {/* Document Preview Section */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Documents Attached</h4>
              <div className="grid grid-cols-2 gap-2">
                <DocPreview label="Aadhar Front" url={kyc.aadharFrontUrl} />
                <DocPreview label="Aadhar Back" url={kyc.aadharBackUrl} />
                <DocPreview label="PAN Card" url={kyc.panUrl} />
                <DocPreview label="Passbook" url={kyc.passbookUrl} />
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-between border-t pt-4">
            <Button 
              variant="destructive" 
              className="rounded-xl font-black uppercase text-xs tracking-widest"
              onClick={() => handleUpdate(KycStatus.REJECTED)}
              disabled={loading}
            >
              <X className="mr-2 h-4 w-4" /> Reject KYC
            </Button>
            <Button 
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase text-xs tracking-widest"
              onClick={() => handleUpdate(KycStatus.VERIFIED)}
              disabled={loading}
            >
              <Check className="mr-2 h-4 w-4" /> Approve & Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper components for Modal
const DetailRow = ({ icon, label, value }: any) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-slate-500 flex items-center gap-2">{icon} {label}</span>
    <span className="font-bold text-slate-900">{value || "N/A"}</span>
  </div>
);

const DocPreview = ({ label, url }: any) => (
  <div className="group relative aspect-video bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
    {url ? (
      <>
        <img src={url} alt={label} className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
          <p className="text-[8px] text-white font-bold uppercase">{label}</p>
          <Button size="icon" variant="secondary" className="h-6 w-6 rounded-full" onClick={() => window.open(url, "_blank")}>
            <ExternalLink size={12} />
          </Button>
        </div>
      </>
    ) : (
      <div className="flex items-center justify-center h-full text-[8px] font-bold text-slate-400 uppercase">Missing</div>
    )}
  </div>
);