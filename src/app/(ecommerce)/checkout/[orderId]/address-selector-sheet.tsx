"use client";

import React, { useState, useTransition } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle2, Home, Briefcase, Compass, Loader2, Plus } from "lucide-react";
import { updateOrderAddress } from "./address-action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Matching schema payload props definitions mapping
interface DBAddress {
  id: string;
  receiverName: string;
  receiverMobile: string;
  addressLine: string;
  landmark: string | null;
  district: string;
  state: string;
  pinCode: string;
  addressType: "HOME" | "WORK" | "OTHER";
  isDefault: boolean;
}

interface AddressSelectorSheetProps {
  orderId: string;
  savedAddresses: DBAddress[];
  currentOrderAddressString?: string | null;
}

export function AddressSelectorSheet({
  orderId,
  savedAddresses = [],
  currentOrderAddressString,
}: AddressSelectorSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
    // Optimistic fallback parameter lookups: automatic fallback selections logic hookups
    const defaultAddr = savedAddresses.find((a) => a.isDefault);
    return defaultAddr ? defaultAddr.id : savedAddresses[0]?.id || null;
  });
  const [isPending, startTransition] = useTransition();

  const handleConfirmAddressUpdate = () => {
    if (!selectedAddressId) {
      toast.error("Please explicitly select a destination profile layout card.");
      return;
    }

    startTransition(async () => {
      const res = await updateOrderAddress(orderId, selectedAddressId);
      if (res.success) {
        toast.success(res.message);
        setIsOpen(false);
      } else {
        toast.error(res.error || "Mutation pipeline layout mapping exception.");
      }
    });
  };

  const getBadgeIcon = (type: "HOME" | "WORK" | "OTHER") => {
    switch (type) {
      case "HOME": return <Home size={11} />;
      case "WORK": return <Briefcase size={11} />;
      default: return <Compass size={11} />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-50 shrink-0 select-none cursor-pointer"
        >
          Change Address
        </Button>
      </SheetTrigger>

      <SheetContent 
        side="right" 
        className="h-full w-full sm:max-w-[460px] flex flex-col bg-slate-50 p-0 border-l border-slate-200 z-[105]"
      >
        {/* Header Configurations */}
        <div className="px-6 py-5 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-10">
          <div>
            <SheetTitle className="text-base font-bold text-slate-900 tracking-tight">
              Select Shipping Address
            </SheetTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose from your saved fulfillment destinations
            </p>
          </div>
        </div>

        {/* Dynamic Items Loops List Panels */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-3.5">
          {savedAddresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
              <div className="h-14 w-14 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-300 mb-4">
                <MapPin size={24} />
              </div>
              <h4 className="text-sm font-bold text-slate-900">No Saved Addresses Found</h4>
              <p className="text-xs text-slate-400 max-w-[240px] mt-1 mb-4 leading-relaxed">
                Please populate your user dashboard records before validating order routing parameters.
              </p>
            </div>
          ) : (
            savedAddresses.map((addr) => {
              const isChecked = selectedAddressId === addr.id;

              return (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={cn(
                    "w-full flex items-start gap-4 p-4 rounded-xl border-2 bg-white text-left transition-all duration-200 outline-none select-none cursor-pointer",
                    isChecked
                      ? "border-slate-900 shadow-xs ring-1 ring-slate-900/5"
                      : "border-slate-200/80 hover:border-slate-300"
                  )}
                >
                  {/* Selector Radio Metrics */}
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                      isChecked ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300"
                    )}
                  >
                    {isChecked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>

                  {/* Metadata Specs */}
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {addr.receiverName}
                      </span>
                      <span className="text-xs font-mono font-medium text-slate-400">
                        {addr.receiverMobile}
                      </span>
                      
                      {/* Sub-type badges */}
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border mt-0.5",
                        addr.addressType === "HOME" ? "bg-blue-50 text-blue-700 border-blue-100" :
                        addr.addressType === "WORK" ? "bg-amber-50 text-amber-700 border-amber-100" :
                        "bg-slate-50 text-slate-700 border-slate-100"
                      )}>
                        {getBadgeIcon(addr.addressType)}
                        {addr.addressType}
                      </span>

                      {addr.isDefault && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-100 rounded-md">
                          DEFAULT
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium break-words pt-0.5">
                      {addr.addressLine}
                      {addr.landmark ? `, Near ${addr.landmark}` : ""}
                    </p>
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                      {addr.district}, {addr.state} - <span className="font-mono">{addr.pinCode}</span>
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Sticky Action Footer Panel Bar */}
        {savedAddresses.length > 0 && (
          <div className="bg-white border-t border-slate-200 p-5 sticky bottom-0 z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.02)] space-y-2">
            <Button
              onClick={handleConfirmAddressUpdate}
              disabled={isPending}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-none gap-2 cursor-pointer transition-colors"
            >
              {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle2 size={14} />}
              <span>{isPending ? "Updating Route..." : "Deliver to This Address"}</span>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}