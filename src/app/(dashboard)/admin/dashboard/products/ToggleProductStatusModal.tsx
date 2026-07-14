"use client";

import React, { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2, AlertTriangle, CheckCircle2, Power } from "lucide-react";
import { deactivateProduct, toggleProductStatus } from "@/lib/actions/product"; // Apni action function
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ToggleProductStatusModalProps {
  productId: string;
  productName: string;
  isActive: boolean; // ✅ Added isActive status flag
}

export function ToggleProductStatusModal({
  productId,
  productName,
  isActive = true,
}: ToggleProductStatusModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = () => {
    startTransition(async () => {
      // Direct action toggle invocation
      const res = await toggleProductStatus(productId, !isActive);

      if (res.success) {
        toast.success(res.message || `Product successfully ${isActive ? "deactivated" : "activated"}!`);
        setOpen(false);
      } else {
        toast.error(res.error || "Failed to update product status.");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {/* Dynamic Trigger Button Based on Active State */}
        <button
          className={cn(
            "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer",
            isActive
              ? "text-rose-600 hover:bg-rose-50"
              : "text-emerald-600 hover:bg-emerald-50"
          )}
        >
          <Power size={14} />
          <span>{isActive ? "Deactivate" : "Activate"}</span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-[2.5rem] border-none bg-white p-8 sm:p-10 shadow-2xl sm:max-w-[450px]">
        <AlertDialogHeader className="flex flex-col items-center text-center space-y-4">
          
          {/* Dynamic Header Icon */}
          <div
            className={cn(
              "h-16 w-16 rounded-3xl flex items-center justify-center mb-2",
              isActive ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
            )}
          >
            {isActive ? <AlertTriangle size={32} /> : <CheckCircle2 size={32} />}
          </div>

          <AlertDialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">
            Confirm{" "}
            <span className={isActive ? "text-rose-600" : "text-emerald-600"}>
              {isActive ? "Deactivation" : "Activation"}
            </span>
          </AlertDialogTitle>

          <AlertDialogDescription className="text-slate-500 font-medium leading-relaxed">
            You are about to {isActive ? "deactivate" : "reactivate"}{" "}
            <span className="font-black text-slate-900">"{productName}"</span>.{" "}
            {isActive
              ? "This product will be hidden from the store and user catalog."
              : "This product will become visible to all customers in the store catalog."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8 gap-3 sm:gap-2">
          <AlertDialogCancel className="h-12 sm:h-14 rounded-2xl border-slate-100 bg-slate-50 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 flex-1">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Prevent closing until async process finishes
              handleToggleStatus();
            }}
            disabled={isPending}
            className={cn(
              "h-12 sm:h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white shadow-xl flex-1",
              isActive
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
            )}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : isActive ? (
              "Deactivate"
            ) : (
              "Activate"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}