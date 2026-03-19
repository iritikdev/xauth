"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updatePayoutStatus } from "@/lib/actions/admin";
import { toast } from "sonner";

export default function PayoutActions({ transactionId }: { transactionId: string }) {
  const [loading, setLoading] = useState<"APPROVE" | "REJECT" | null>(null);

  const handleAction = async (status: "COMPLETED" | "FAILED") => {
    setLoading(status === "COMPLETED" ? "APPROVE" : "REJECT");
    const res = await updatePayoutStatus(transactionId, status);
    
    if (res.success) {
      toast.success(status === "COMPLETED" ? "Payout Approved" : "Payout Rejected & Refunded");
    } else {
      toast.error(res.error);
    }
    setLoading(null);
  };

  return (
    <div className="flex gap-3 w-full md:w-auto">
      <Button 
        onClick={() => handleAction("FAILED")}
        disabled={!!loading}
        variant="outline" 
        className="flex-1 md:flex-none h-14 rounded-2xl border-red-100 text-red-600 hover:bg-red-50 font-black uppercase tracking-widest text-[10px] px-8"
      >
        {loading === "REJECT" ? <Loader2 className="animate-spin h-4 w-4" /> : <X size={16} className="mr-2" />}
        Reject
      </Button>
      <Button 
        onClick={() => handleAction("COMPLETED")}
        disabled={!!loading}
        className="flex-1 md:flex-none h-14 rounded-2xl bg-emerald-600 hover:bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] px-10 shadow-lg shadow-emerald-100"
      >
        {loading === "APPROVE" ? <Loader2 className="animate-spin h-4 w-4" /> : <Check size={16} className="mr-2" />}
        Approve Payout
      </Button>
    </div>
  );
}