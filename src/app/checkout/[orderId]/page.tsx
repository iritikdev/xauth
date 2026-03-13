import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  ShieldCheck,
  MapPin,
  Package,
  CreditCard,
  ArrowLeft,
  Info,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { confirmCodOrder } from "@/lib/actions/order";
import { ConfirmOrderButton } from "@/components/ecommerce/confirm-order-button";

export default async function CheckoutSummaryPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Header Info Bar */}
      <div className="bg-white border-b border-slate-200/60 py-4 mb-10">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link
            href="/shop"
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Back to Shop
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Order ID:
            </span>
            <Badge
              variant="outline"
              className="font-mono text-[10px] rounded-lg bg-slate-50"
            >
              #{order.id.slice(-8).toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items Card */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-black uppercase tracking-tighter italic">
                  Order <span className="text-emerald-500">Items</span>
                </h2>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold">
                {order.items.length} Products
              </Badge>
            </div>

            <div className="p-8 space-y-8">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group"
                >
                  <div className="flex gap-5">
                    <div className="h-20 w-20 bg-slate-50 rounded-[1.5rem] flex-shrink-0 border border-slate-100 p-3 group-hover:bg-white group-hover:shadow-md transition-all">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-slate-900 leading-tight">
                        {item.product.name}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400">
                          Qty: {item.quantity}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-tighter">
                          +{item.bv * item.quantity} BV
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right w-full sm:w-auto border-t sm:border-none pt-4 sm:pt-0">
                    <p className="font-black text-lg text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      ₹{item.price} / unit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Card */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin className="text-emerald-600 w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Deliver To
                </p>
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                  {order.user.name}
                </p>
                <p className="text-xs font-medium text-slate-500 max-w-xs">
                  {order.address || "Address not provided in profile"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-10 border-slate-200 hover:bg-slate-50"
            >
              Change Address
            </Button>
          </div>
        </div>

        {/* Right Column: Checkout Sidebar */}
        <div className="space-y-6">
          {/* Business Summary Card */}
          <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8 bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/10">
                <Zap className="text-emerald-400 fill-emerald-400 w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                  Growth Rewards
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                  Total Points Earned
                </span>
                <div className="text-5xl font-black italic tracking-tighter flex items-baseline gap-2 text-white">
                  {order.totalBv}{" "}
                  <span className="text-xl text-emerald-400 not-italic uppercase tracking-widest">
                    BV
                  </span>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 space-y-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold italic">
                    Cart Total
                  </span>
                  <span className="font-bold">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold italic">
                    Delivery
                  </span>
                  <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                    Free
                  </span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between items-end">
                  <span className="text-slate-400 font-bold italic">
                    Total Payable
                  </span>
                  <span className="text-3xl font-black tracking-tighter italic">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button className="w-full h-16 mt-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-emerald-600/20 transition-all active:scale-95 group">
                <CreditCard className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Pay via Razorpay
              </Button>
            </div>

            {/* Background Decor */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>

          {/* Security & Info */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200/60 space-y-4">
            <div className="flex items-center gap-3 text-slate-500">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Secured Payment Gateway
              </p>
            </div>
            <div className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                BV Points will be credited to your{" "}
                <span className="text-slate-900 font-bold">
                  Business Wallet
                </span>{" "}
                instantly after a successful transaction.
              </p>
            </div>
          </div>
        </div>
        <ConfirmOrderButton orderId={order.id} />
      </div>
    </div>
  );
}

// Simple Helper Component
function Separator({ className }: { className?: string }) {
  return <div className={cn("h-[1px] w-full", className)} />;
}
