"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { confirmOnlinePaidOrder } from "@/lib/actions/order";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ConfirmPaymentButtonProps {
  orderId: string;
  payableAmount: number;
}

export function ConfirmPaymentButton({ orderId, payableAmount }: ConfirmPaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOnlinePaymentConfirm = async () => {
    try {
      setLoading(false);
      setLoading(true);
      
      const res = await confirmOnlinePaidOrder(orderId);
      
      if (res.success) {
        toast.success("Online Payment Verified Successfully!");
        router.push(`/shop/order-success/${orderId}`);
      } else {
        toast.error(res.error || "Failed to confirm payment metadata");
      }
    } catch (error) {
      toast.error("An error occurred during payment verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 w-full mt-4">
      <Button
        onClick={handleOnlinePaymentConfirm}
        disabled={loading}
        className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : (
          <CreditCard className="w-4 h-4" />
        )}
        <span>
          {loading ? "Verifying Transaction..." : `I Have Paid ₹${payableAmount.toLocaleString()}`}
        </span>
      </Button>
      
      <p className="text-[10px] text-center text-slate-400 font-medium flex items-center justify-center gap-1 tracking-wide">
        <ShieldCheck size={12} className="text-emerald-500" />
        <span>Transaction settles instantly into your member wallet profile.</span>
      </p>
    </div>
  );
}