"use client";

import React, { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowUpFromLine, Loader2, IndianRupee,
  AlertCircle, CheckCircle2, Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { withdrawRequestAction } from "@/lib/actions/wallet";
import { cn } from "@/lib/utils";

/* ─── quick-amount presets ────────────────────────────────────── */
const PRESETS = [500, 1000, 2000, 5000];

export function WithdrawMoneyModal({
  balance,
  onRefresh,
}: {
  balance: number;
  onRefresh: () => void;
}) {
  const [amount, setAmount]   = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);

  const num       = parseFloat(amount) || 0;
  const tooLow    = num > 0 && num < 100;
  const tooHigh   = num > balance;
  const isValid   = num >= 100 && num <= balance;
  const afterBal  = balance - num;

  const handleWithdraw = async () => {
    if (!isValid) {
      if (tooLow)  return toast.error("Minimum withdrawal is ₹100");
      if (tooHigh) return toast.error("Insufficient balance");
      return toast.error("Enter a valid amount");
    }
    setLoading(true);
    try {
      const res = await withdrawRequestAction(num);
      if (res.success) {
        toast.success("Withdrawal request submitted!");
        setOpen(false);
        setAmount("");
        onRefresh();
      } else {
        toast.error(res.error || "Request failed");
      }
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setAmount(""); }}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 h-11 rounded-2xl bg-emerald-400 hover:bg-emerald-300 px-5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-950 transition-all shadow-lg shadow-emerald-400/20 active:scale-[0.98]"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          <ArrowUpFromLine size={14} strokeWidth={2.5} />
          Withdraw
        </button>
      </DialogTrigger>

      <DialogContent
        className="rounded-[2rem] border border-zinc-100 p-0 max-w-sm overflow-hidden bg-white shadow-2xl"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {/* ── modal header ── */}
        <div className="relative overflow-hidden bg-zinc-950 px-7 py-6">
          {/* ambient */}
          <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-emerald-400/8 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                <Wallet size={14} className="text-emerald-400" strokeWidth={2} />
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">
                Amaze Wallet
              </p>
            </div>
            <h2
              className="text-2xl font-black text-white leading-tight"
              style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
            >
              Withdraw Funds
            </h2>
            <p className="text-[11px] font-medium text-zinc-500 mt-1">
              Processed within 24–48 hrs after admin approval
            </p>
          </div>
        </div>

        {/* ── body ── */}
        <div className="px-7 py-6 space-y-5">

          {/* available balance pill */}
          <div className="flex items-center justify-between rounded-2xl bg-zinc-50 border border-zinc-100 px-4 py-3.5">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-400 mb-0.5">
                Available Balance
              </p>
              <p
                className="text-xl font-black text-zinc-900"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                ₹{balance.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <IndianRupee size={16} className="text-emerald-600" strokeWidth={2} />
            </div>
          </div>

          {/* amount input */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400 mb-2">
              Withdraw Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-zinc-400">
                ₹
              </span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={cn(
                  "w-full h-14 rounded-2xl border pl-9 pr-4 text-2xl font-black text-zinc-900 bg-zinc-50",
                  "focus:outline-none focus:ring-2 transition-all",
                  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                  tooHigh
                    ? "border-red-200 bg-red-50/40 focus:ring-red-400/30 focus:border-red-400"
                    : tooLow
                    ? "border-amber-200 bg-amber-50/40 focus:ring-amber-400/30 focus:border-amber-400"
                    : isValid
                    ? "border-emerald-200 bg-emerald-50/40 focus:ring-emerald-400/30 focus:border-emerald-400"
                    : "border-zinc-200 focus:ring-emerald-400/40 focus:border-emerald-400"
                )}
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              />
              {/* validation icon */}
              {isValid && (
                <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>

            {/* inline error */}
            {tooHigh && (
              <p className="text-[10px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle size={10} /> Exceeds available balance
              </p>
            )}
            {tooLow && (
              <p className="text-[10px] font-bold text-amber-600 mt-1.5 flex items-center gap-1">
                <AlertCircle size={10} /> Minimum withdrawal is ₹500
              </p>
            )}
          </div>

          {/* quick presets */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-zinc-400 mb-2">
              Quick Select
            </p>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  disabled={p > balance}
                  onClick={() => setAmount(String(p))}
                  className={cn(
                    "h-9 rounded-xl text-[11px] font-black transition-all border",
                    num === p
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                      : p > balance
                      ? "bg-zinc-50 text-zinc-300 border-zinc-100 cursor-not-allowed"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50"
                  )}
                >
                  ₹{(p / 1000) >= 1 ? `${p/1000}k` : p}
                </button>
              ))}
            </div>
          </div>

          {/* after-withdrawal preview */}
          {isValid && (
            <div className="flex items-center justify-between rounded-2xl bg-zinc-50 border border-zinc-100 px-4 py-3">
              <p className="text-[10px] font-medium text-zinc-400">Balance after withdrawal</p>
              <p
                className="text-sm font-black text-zinc-900"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                ₹{afterBal.toLocaleString("en-IN")}
              </p>
            </div>
          )}

          {/* note */}
          <div className="flex items-start gap-2.5 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3">
            <AlertCircle size={12} className="text-amber-600 shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-[10px] font-medium text-amber-700 leading-relaxed">
              Ensure your bank KYC is verified. Payouts processed within 24–48 hrs of approval.
            </p>
          </div>

          {/* submit */}
          <button
            onClick={handleWithdraw}
            disabled={loading || !isValid}
            className={cn(
              "w-full h-12 rounded-2xl text-[11px] font-black uppercase tracking-[0.18em]",
              "flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
              loading || !isValid
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                : "bg-zinc-950 hover:bg-zinc-800 text-white shadow-sm shadow-zinc-900/20"
            )}
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            {loading ? (
              <><Loader2 size={14} className="animate-spin" /> Processing…</>
            ) : (
              <><ArrowUpFromLine size={14} strokeWidth={2.5} /> Submit Withdrawal</>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}