"use client";

import React, { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { addMoneyAction } from "@/lib/actions/wallet";

export function AddMoneyModal({ onRefresh }: { onRefresh: () => void }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAddMoney = async () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount < 100) {
      return toast.error("Minimum deposit is ₹100");
    }

    setLoading(true);
    try {
      const res = await addMoneyAction(numAmount);
      if (res.success) {
        toast.success("Money added to wallet!");
        setOpen(false);
        setAmount("");
        onRefresh(); // Page data refresh karne ke liye
      } else {
        toast.error(res.error || "Failed to add money");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl bg-emerald-500 hover:bg-emerald-600 h-14 px-8 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-emerald-500/20">
          <Plus className="w-4 h-4" /> Add Money
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] border-none p-8 max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tight">
            Deposit <span className="text-emerald-600">Money</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Enter Amount (INR)
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-16 pl-12 rounded-2xl text-2xl font-black bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div className="flex gap-2">
            {[500, 1000, 2000, 5000].map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className="flex-1 py-2 rounded-xl bg-slate-50 text-[10px] font-black text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-transparent hover:border-emerald-100 transition-all"
              >
                +₹{amt}
              </button>
            ))}
          </div>

          <Button 
            onClick={handleAddMoney}
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Proceed to Deposit"}
          </Button>

          <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Secured by Amaze Swadeshi Gateway
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}