"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/store/use-cart";
import { 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  ChevronLeft, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalBV = items.reduce((acc, item) => acc + (item.bvAmount * item.quantity), 0);
  const shipping = 0; 
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    // Simulate API call to createOrder server action
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsProcessing(false);
    setIsOrdered(true);
    clearCart();
  };

  if (isOrdered) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-white">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">Order Placed!</h1>
          <p className="text-slate-500 font-medium">
            Your Swadeshi products are on the way. <br />
            <strong className="text-emerald-600">{totalBV} BV</strong> has been credited to your business account.
          </p>
          <div className="pt-6">
            <Link href="/dashboard">
              <Button className="h-14 w-full rounded-2xl bg-[#0f172a] hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-slate-900/10">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <Link href="/shop" className="text-slate-400 hover:text-emerald-600 flex items-center gap-2 font-black uppercase tracking-widest text-[10px] transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Business Shop
        </Link>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase mt-4 text-slate-900">Secure Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Forms */}
        <div className="lg:col-span-2 space-y-12">
          {/* Shipping Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-slate-900">Shipping Address</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em]">Full Name</Label>
                <Input placeholder="Ritik Kumar" className="h-14 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500/50 transition-all" />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em]">Mobile Number</Label>
                <Input placeholder="+91 XXXXX XXXXX" className="h-14 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500/50 transition-all" />
              </div>
              <div className="md:col-span-2 space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em]">Full Address</Label>
                <Input placeholder="House No, Street, Area..." className="h-14 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500/50 transition-all" />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em]">City</Label>
                <Input placeholder="Patna" className="h-14 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500/50 transition-all" />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em]">Pincode</Label>
                <Input placeholder="800001" className="h-14 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500/50 transition-all" />
              </div>
            </div>
          </section>

          <Separator className="bg-slate-100" />

          {/* Payment Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-slate-900">Payment Method</h2>
            </div>

            <RadioGroup defaultValue="upi" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PaymentOption id="upi" label="UPI / QR Code" icon={<Zap className="w-5 h-5" />} />
              <PaymentOption id="wallet" label="Business Wallet" icon={<ShieldCheck className="w-5 h-5" />} />
              <PaymentOption id="cod" label="Cash on Delivery" icon={<Truck className="w-5 h-5" />} />
            </RadioGroup>
          </section>
        </div>

        {/* Right: Summary Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">
            <Card className="border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[3rem] bg-white overflow-hidden">
              <CardHeader className="bg-slate-50 p-8 border-b border-slate-100">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-bold">{item.name} <span className="text-xs text-slate-300 ml-1">× {item.quantity}</span></span>
                      <span className="text-slate-900 font-black">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  {items.length === 0 && <p className="text-center text-xs text-slate-400 italic">Cart is empty</p>}
                </div>

                <Separator className="bg-slate-50" />

                {/* BV Reward Box */}
                <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-center justify-between relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-[9px] font-black uppercase text-emerald-600 tracking-[0.2em] mb-1">Commission Earned</p>
                    <p className="text-2xl font-black text-emerald-700 italic tracking-tighter">{totalBV} BV</p>
                  </div>
                  <Zap className="w-12 h-12 text-emerald-500/10 absolute -right-2 -bottom-2 group-hover:rotate-12 transition-transform duration-500" />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-slate-500 text-sm font-bold">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 text-sm font-bold">
                    <span>Shipping Fee</span>
                    <span>FREE</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Grand Total</span>
                    <span className="text-4xl font-black text-slate-900 italic tracking-tighter">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  disabled={isProcessing || items.length === 0}
                  onClick={handlePlaceOrder}
                  className="w-full h-16 rounded-[1.5rem] bg-[#0f172a] hover:bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-slate-900/20 transition-all active:scale-95 group flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Confirm Order <Lock className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-center gap-3 text-slate-400 p-4 bg-slate-50 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">SSL Encrypted Transaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fixed Payment Option Component
function PaymentOption({ id, label, icon }: { id: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="relative">
      <RadioGroupItem value={id} id={id} className="peer sr-only" />
      <Label
        htmlFor={id}
        className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] cursor-pointer peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50/50 hover:bg-slate-50 transition-all text-center gap-4 group"
      >
        <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 peer-data-[state=checked]:text-emerald-600 transition-colors shadow-sm">
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 peer-data-[state=checked]:text-emerald-700 transition-colors">
          {label}
        </span>
      </Label>
    </div>
  );
}