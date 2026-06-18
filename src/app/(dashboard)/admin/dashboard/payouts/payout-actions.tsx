"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updatePayoutStatus } from "@/lib/actions/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    // md:flex-row desktop ke liye, default flex-col mobile ke liye
    <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
      
      {/* Reject Button */}
      <Button 
        onClick={() => handleAction("FAILED")}
        disabled={!!loading}
        variant="outline" 
        className={cn(
          "h-14 rounded-2xl border-rose-100 text-rose-600 hover:bg-rose-50 font-black uppercase tracking-widest text-[10px] px-6 transition-all",
          "w-full md:w-32 lg:w-40", // Mobile par full, desktop par fixed width
          loading === "REJECT" && "opacity-70"
        )}
      >
        {loading === "REJECT" ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : (
          <><X size={14} className="mr-2 shrink-0" /> Reject</>
        )}
      </Button>

      {/* Approve Button */}
      <Button 
        onClick={() => handleAction("COMPLETED")}
        disabled={!!loading}
        className={cn(
          "h-14 rounded-2xl bg-emerald-600 hover:bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] px-6 transition-all shadow-lg shadow-emerald-900/10",
          "w-full md:w-44 lg:w-56", // Mobile par full width
          loading === "APPROVE" && "opacity-70"
        )}
      >
        {loading === "APPROVE" ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : (
          <><Check size={14} className="mr-2 shrink-0" /> Approve Payout</>
        )}
      </Button>

    </div>
  );
}