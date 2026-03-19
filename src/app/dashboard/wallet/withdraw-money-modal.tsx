"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, IndianRupee, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { withdrawRequestAction } from "@/lib/actions/wallet";

export function WithdrawMoneyModal({ balance, onRefresh }: { balance: number, onRefresh: () => void }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleWithdraw = async () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount < 500) {
      return toast.error("Minimum withdrawal is ₹500");
    }
    if (numAmount > balance) {
      return toast.error("Insufficient balance");
    }

    setLoading(true);
    try {
      const res = await withdrawRequestAction(numAmount);
      if (res.success) {
        toast.success("Withdrawal request sent to admin!");
        setOpen(false);
        setAmount("");
        onRefresh();
      } else {
        toast.error(res.error || "Request failed");
      }
    } catch (err) {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 h-14 px-8 font-black uppercase tracking-widest text-[10px] gap-2 transition-all active:scale-95">
          <Send className="w-4 h-4" /> Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] border-none p-8 max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tight text-slate-900">
            Request <span className="text-red-600">Withdrawal</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
            <p className="text-[10px] font-black uppercase text-slate-400">Available to Withdraw</p>
            <p className="text-xl font-black text-slate-900">₹{balance.toLocaleString('en-IN')}</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Withdraw Amount (Min ₹500)</label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-16 pl-12 rounded-2xl text-2xl font-black bg-slate-50 border-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold leading-relaxed uppercase tracking-tight">
              Note: Payouts are processed within 24-48 hours after admin approval. Ensure your bank KYC is verified.
            </p>
          </div>

          <Button 
            onClick={handleWithdraw}
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-red-600 text-white font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Submit Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}