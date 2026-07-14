"use client";

import React, { useState } from "react";
import {
  Smartphone,
  QrCode,
  Banknote,
  Copy,
  AlertCircle,
  Store,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { ConfirmOrderButton } from "@/components/ecommerce/confirm-order-button";
import { cn } from "@/lib/utils";

interface CheckoutPaymentSectionProps {
  orderId: string;
  cartTotal: number;
  upiId: string;
}

type PaymentMethod = "UPI_APP" | "QR_CODE" | "COD";
type DeliveryType = "HOME_DELIVERY" | "STORE_PICKUP";

export default function CheckoutPaymentSection({
  orderId,
  cartTotal,
  upiId,
}: CheckoutPaymentSectionProps) {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("HOME_DELIVERY");
  const [method, setMethod] = useState<PaymentMethod>("UPI_APP");

  // Calculate Shipping Charge Logic
  const SHIPPING_THRESHOLD = 2500;
  const SHIPPING_FEE = 150;

  const shippingCharge =
    deliveryType === "STORE_PICKUP"
      ? 0
      : cartTotal <= SHIPPING_THRESHOLD
      ? SHIPPING_FEE
      : 0;

  const finalPayableAmount = cartTotal + shippingCharge;

  // Dynamic UPI Link & QR API generator
  const upiLink = `upi://pay?pa=${upiId}&pn=Amaze%20Ayurveda&am=${finalPayableAmount}&cu=INR`;
  const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    upiLink
  )}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    toast.success("UPI ID copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* ══════════════ STEP 1: DELIVERY METHOD SELECTION ══════════════ */}
      <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200/60 space-y-4 shadow-sm">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
            Fulfillment Option
          </p>
          <h3 className="text-lg font-black text-slate-900">Delivery Preference</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Home Delivery Button */}
          <button
            type="button"
            onClick={() => setDeliveryType("HOME_DELIVERY")}
            className={cn(
              "flex flex-col items-start p-4 rounded-2xl border transition-all text-left gap-2 relative",
              deliveryType === "HOME_DELIVERY"
                ? "border-emerald-500 bg-emerald-50/40 text-slate-900 shadow-sm"
                : "border-slate-100 bg-slate-50/80 text-slate-500 hover:bg-slate-100"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <Truck className={cn("w-5 h-5", deliveryType === "HOME_DELIVERY" ? "text-emerald-600" : "text-slate-400")} />
              {deliveryType === "HOME_DELIVERY" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Home Delivery</p>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                {cartTotal <= SHIPPING_THRESHOLD ? "₹150 Delivery Charge" : "FREE Delivery"}
              </p>
            </div>
          </button>

          {/* Store Pickup Button */}
          <button
            type="button"
            onClick={() => setDeliveryType("STORE_PICKUP")}
            className={cn(
              "flex flex-col items-start p-4 rounded-2xl border transition-all text-left gap-2 relative",
              deliveryType === "STORE_PICKUP"
                ? "border-emerald-500 bg-emerald-50/40 text-slate-900 shadow-sm"
                : "border-slate-100 bg-slate-50/80 text-slate-500 hover:bg-slate-100"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <Store className={cn("w-5 h-5", deliveryType === "STORE_PICKUP" ? "text-emerald-600" : "text-slate-400")} />
              {deliveryType === "STORE_PICKUP" && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Store Pickup</p>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
                No Delivery Charge
              </p>
            </div>
          </button>
        </div>

        {/* Dynamic Delivery Alert */}
        {deliveryType === "HOME_DELIVERY" && cartTotal <= SHIPPING_THRESHOLD && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[11px] text-amber-900 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Add products worth <strong>₹{(SHIPPING_THRESHOLD - cartTotal + 1).toLocaleString()}</strong> more to unlock FREE Home Delivery!
            </span>
          </div>
        )}
      </div>

      {/* ══════════════ STEP 2: SUMMARY BREAKDOWN ══════════════ */}
      <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white space-y-3 shadow-xl">
        <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
          <span>Items Subtotal</span>
          <span>₹{cartTotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
          <span>Delivery Fee ({deliveryType === "STORE_PICKUP" ? "Pickup" : "Home"})</span>
          <span className={shippingCharge === 0 ? "text-emerald-400 font-black uppercase" : "text-white"}>
            {shippingCharge === 0 ? "FREE" : `+₹${shippingCharge}`}
          </span>
        </div>

        <div className="h-px bg-white/10 my-2" />

        <div className="flex justify-between items-end">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Final Payable</span>
          <span className="text-2xl font-black text-emerald-400 italic font-mono">
            ₹{finalPayableAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ══════════════ STEP 3: PAYMENT GATEWAY SELECTION ══════════════ */}
      <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200/60 space-y-5 shadow-sm">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
            Payment Method
          </p>
          <h3 className="text-lg font-black text-slate-900">Choose Gateway</h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setMethod("UPI_APP")}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center gap-1.5",
              method === "UPI_APP"
                ? "border-emerald-500 bg-emerald-50/50 text-emerald-700 font-bold shadow-sm"
                : "border-slate-100 bg-slate-50/80 text-slate-500 hover:bg-slate-100"
            )}
          >
            <Smartphone className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-wider font-black">UPI App</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod("QR_CODE")}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center gap-1.5",
              method === "QR_CODE"
                ? "border-emerald-500 bg-emerald-50/50 text-emerald-700 font-bold shadow-sm"
                : "border-slate-100 bg-slate-50/80 text-slate-500 hover:bg-slate-100"
            )}
          >
            <QrCode className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-wider font-black">Scan QR</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod("COD")}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center gap-1.5",
              method === "COD"
                ? "border-emerald-500 bg-emerald-50/50 text-emerald-700 font-bold shadow-sm"
                : "border-slate-100 bg-slate-50/80 text-slate-500 hover:bg-slate-100"
            )}
          >
            <Banknote className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-wider font-black">Cash / COD</span>
          </button>
        </div>

        {/* UPI APP OPTION */}
        {method === "UPI_APP" && (
          <div className="space-y-4 pt-2 animate-in fade-in duration-300">
            <Link href={upiLink} target="_blank" className="block">
              <Button className="h-14 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-widest gap-2 shadow-lg shadow-emerald-600/20">
                <Smartphone className="w-4 h-4" />
                Pay ₹{finalPayableAmount.toLocaleString()} via UPI
              </Button>
            </Link>

            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Business VPA / UPI ID
                </p>
                <p className="truncate font-mono text-xs font-bold text-slate-900">{upiId}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyUPI}
                className="h-8 w-8 rounded-xl bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* SCAN QR OPTION */}
        {method === "QR_CODE" && (
          <div className="space-y-4 text-center pt-2 animate-in fade-in duration-300">
            <div className="relative mx-auto w-fit rounded-[2rem] border border-slate-200/80 bg-white p-3 shadow-md">
              <img src={qrCodeSrc} alt="Payment QR Code" className="h-44 w-44 rounded-xl" />
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-amber-900 font-medium">
                Scan using PhonePe, GPay, or Paytm to pay ₹{finalPayableAmount.toLocaleString()}.
              </p>
            </div>
          </div>
        )}

        {/* CASH ON DELIVERY OPTION */}
        {method === "COD" && (
          <div className="space-y-4 pt-2 animate-in fade-in duration-300">
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 text-xs text-slate-600 font-medium leading-relaxed">
              {deliveryType === "STORE_PICKUP"
                ? "🏪 Pay ₹" + finalPayableAmount.toLocaleString() + " directly at the store counter upon collecting your package."
                : "📦 Pay ₹" + finalPayableAmount.toLocaleString() + " with cash or UPI upon delivery at your provided address."}
            </div>

            <ConfirmOrderButton orderId={orderId} />
          </div>
        )}
      </div>
    </div>
  );
}