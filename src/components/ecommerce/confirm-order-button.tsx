// components/ecommerce/confirm-order-button.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PackageCheck, Loader2 } from "lucide-react";
import { confirmCodOrder } from "@/lib/actions/order";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ConfirmOrderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    const res = await confirmCodOrder(orderId);
    
    if (res.success) {
      toast.success("Order Placed Successfully!");
      router.push(`/shop/order-success/${orderId}`);
    } else {
      toast.error("Failed to place order");
    }
    setLoading(false);
  };

  return (
    <Button 
      onClick={handleConfirm}
      disabled={loading}
      className="w-full h-16 mt-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
    >
      {loading ? <Loader2 className="animate-spin" /> : <PackageCheck className="w-5 h-5" />}
      Confirm Order (COD)
    </Button>
  );
}