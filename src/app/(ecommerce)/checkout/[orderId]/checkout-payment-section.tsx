"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  QrCode,
  Banknote,
  Copy,
  AlertCircle,
  Store,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ChevronRight,
  Sparkles,
  Lock,
  ArrowRight,
  Clock,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { ConfirmOrderButton } from "@/components/ecommerce/confirm-order-button";
import { cn } from "@/lib/utils";

interface CheckoutPaymentSectionProps {
  orderId: string;
  cartTotal: number;
  totalBv: number;
  upiId: string;
}

type PaymentMethod = "UPI_APP" | "QR_CODE" | "COD";
type DeliveryType = "HOME_DELIVERY" | "STORE_PICKUP";

const SHIPPING_THRESHOLD = 2500;
const SHIPPING_FEE = 150;

export default function CheckoutPaymentSection({
  orderId,
  cartTotal,
  totalBv,
  upiId,
}: CheckoutPaymentSectionProps) {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("HOME_DELIVERY");
  const [method, setMethod] = useState<PaymentMethod>("UPI_APP");
  const [isCopied, setIsCopied] = useState(false);

  // Dynamic Shipping Fee Logic
  const shippingCharge =
    deliveryType === "STORE_PICKUP"
      ? 0
      : cartTotal <= SHIPPING_THRESHOLD
      ? SHIPPING_FEE
      : 0;

  const finalPayableAmount = cartTotal + shippingCharge;
  const amountNeededForFreeShipping = Math.max(0, SHIPPING_THRESHOLD - cartTotal + 1);

  // Dynamic Payment Links
  const upiLink = `upi://pay?pa=${upiId}&pn=Amaze%20Ayurveda&am=${finalPayableAmount}&cu=INR`;
  const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    upiLink
  )}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setIsCopied(true);
    toast.success("UPI ID copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ───────────────── STEP 1: FULFILLMENT METHOD ───────────────── */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Delivery Preference
              </h2>
              <p className="text-xs text-slate-500">
                Choose how you would like to receive your order
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 size={12} /> Step Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Home Delivery Card */}
          <button
            type="button"
            onClick={() => setDeliveryType("HOME_DELIVERY")}
            className={cn(
              "group relative flex flex-col justify-between p-5 rounded-2xl border-2 transition-all duration-200 text-left outline-none",
              deliveryType === "HOME_DELIVERY"
                ? "border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-600/10 shadow-sm"
                : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            )}
          >
            <div className="flex items-start justify-between w-full mb-3">
              <div
                className={cn(
                  "p-2.5 rounded-xl transition-colors",
                  deliveryType === "HOME_DELIVERY"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                )}
              >
                <Truck size={20} />
              </div>
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                  deliveryType === "HOME_DELIVERY"
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-300 bg-transparent"
                )}
              >
                {deliveryType === "HOME_DELIVERY" && <CheckCircle2 size={14} />}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">
                  Home Delivery
                </span>
                <span className="text-xs font-bold text-slate-700 font-mono">
                  {cartTotal > SHIPPING_THRESHOLD ? "FREE" : `+₹${SHIPPING_FEE}`}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Direct doorstep dispatch via courier partner
              </p>
            </div>
          </button>

          {/* Store Pickup Card */}
          <button
            type="button"
            onClick={() => setDeliveryType("STORE_PICKUP")}
            className={cn(
              "group relative flex flex-col justify-between p-5 rounded-2xl border-2 transition-all duration-200 text-left outline-none",
              deliveryType === "STORE_PICKUP"
                ? "border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-600/10 shadow-sm"
                : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            )}
          >
            <div className="flex items-start justify-between w-full mb-3">
              <div
                className={cn(
                  "p-2.5 rounded-xl transition-colors",
                  deliveryType === "STORE_PICKUP"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                )}
              >
                <Store size={20} />
              </div>
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                  deliveryType === "STORE_PICKUP"
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-300 bg-transparent"
                )}
              >
                {deliveryType === "STORE_PICKUP" && <CheckCircle2 size={14} />}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">
                  Store Pickup
                </span>
                <span className="text-xs font-extrabold text-emerald-600 uppercase">
                  FREE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Collect directly from nearest outlet
              </p>
            </div>
          </button>
        </div>

        {/* Dynamic Shipping Banner */}
        {deliveryType === "HOME_DELIVERY" && cartTotal <= SHIPPING_THRESHOLD && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Add products worth <strong>₹{amountNeededForFreeShipping.toLocaleString()}</strong> more to unlock <strong className="text-emerald-700">FREE Home Delivery</strong>!
            </span>
          </motion.div>
        )}
      </section>

      {/* ───────────────── STEP 2: PAYMENT METHOD ───────────────── */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Payment Option
              </h2>
              <p className="text-xs text-slate-500">
                Encrypted & secure checkout powered by Amaze Pay
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Lock size={12} /> 256-Bit SSL
          </span>
        </div>

        {/* Radio Tiles */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setMethod("UPI_APP")}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 text-center",
              method === "UPI_APP"
                ? "border-emerald-600 bg-emerald-50/40 text-emerald-950 font-bold shadow-sm"
                : "border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <Smartphone className={cn("w-5 h-5", method === "UPI_APP" ? "text-emerald-600" : "text-slate-400")} />
            <span className="text-xs font-bold">UPI App</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod("QR_CODE")}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 text-center",
              method === "QR_CODE"
                ? "border-emerald-600 bg-emerald-50/40 text-emerald-950 font-bold shadow-sm"
                : "border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <QrCode className={cn("w-5 h-5", method === "QR_CODE" ? "text-emerald-600" : "text-slate-400")} />
            <span className="text-xs font-bold">Scan QR</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod("COD")}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 text-center",
              method === "COD"
                ? "border-emerald-600 bg-emerald-50/40 text-emerald-950 font-bold shadow-sm"
                : "border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <Banknote className={cn("w-5 h-5", method === "COD" ? "text-emerald-600" : "text-slate-400")} />
            <span className="text-xs font-bold">Cash / COD</span>
          </button>
        </div>

        {/* Dynamic Payment Tab Body */}
        <AnimatePresence mode="wait">
          {method === "UPI_APP" && (
            <motion.div
              key="upi"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 space-y-4 pt-4 border-t border-slate-100"
            >
              <Link href={upiLink} target="_blank" className="block">
                <Button className="h-13 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide gap-2 shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-transform">
                  <Smartphone className="w-4 h-4" />
                  Pay ₹{finalPayableAmount.toLocaleString()} via Instant UPI App
                  <ArrowRight size={16} />
                </Button>
              </Link>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Merchant VPA / UPI ID
                  </p>
                  <p className="truncate font-mono text-xs font-bold text-slate-900">
                    {upiId}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUPI}
                  className="h-8 rounded-xl border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 shadow-none gap-1.5"
                >
                  {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
            </motion.div>
          )}

          {method === "QR_CODE" && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 text-center space-y-4 pt-4 border-t border-slate-100"
            >
              <div className="relative mx-auto w-fit rounded-2xl border border-slate-200/80 bg-white p-3 shadow-md">
                <img
                  src={qrCodeSrc}
                  alt="Amaze Ayurveda Payment QR Code"
                  className="h-48 w-48 rounded-xl object-contain"
                />
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-left flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-slate-600">
                  Scan using GPay, PhonePe, Paytm, or BHIM to complete your transfer of{" "}
                  <strong className="text-slate-900 font-mono">
                    ₹{finalPayableAmount.toLocaleString()}
                  </strong>.
                </p>
              </div>
            </motion.div>
          )}

          {method === "COD" && (
            <motion.div
              key="cod"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 space-y-4 pt-4 border-t border-slate-100"
            >
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 text-xs text-slate-600 leading-relaxed">
                {deliveryType === "STORE_PICKUP"
                  ? "Pay ₹" +
                    finalPayableAmount.toLocaleString() +
                    " directly at the store counter upon collecting your package."
                  : "Pay ₹" +
                    finalPayableAmount.toLocaleString() +
                    " via cash or UPI upon delivery at your provided address."}
              </div>

              <ConfirmOrderButton orderId={orderId} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}