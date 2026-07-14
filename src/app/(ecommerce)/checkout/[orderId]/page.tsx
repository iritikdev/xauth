import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  ShieldCheck,
  MapPin,
  Package,
  ArrowLeft,
  Info,
  Lock,
  Truck,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import CheckoutPaymentSection from "./checkout-payment-section";

export default async function CheckoutSummaryPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
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

  const upiId = "amazeayurveda@naviaxis";
  const SHIPPING_THRESHOLD = 2500;
  const SHIPPING_FEE = 150;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 font-sans text-slate-900 antialiased">
      {/* ──────────────── Top Navigation Bar ──────────────── */}
      <header className="sticky top-15 py-3 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Order ID:</span>
            <Badge
              variant="secondary"
              className="font-mono text-xs font-bold rounded-lg bg-slate-100 text-slate-800"
            >
              #{order.id.slice(-8).toUpperCase()}
            </Badge>
          </div>
        </div>
      </header>

      {/* ──────────────── Main Content Container ──────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ──────────────── LEFT COLUMN: Items + Payment ──────────────── */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Order Items Section */}
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                    <Package size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Items in Order
                    </h2>
                    <p className="text-xs text-slate-500">
                      Review products in your cart
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-bold text-xs">
                  {order.items.length} {order.items.length === 1 ? "Product" : "Products"}
                </Badge>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 first:pt-4 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex-shrink-0 relative overflow-hidden">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span className="font-bold text-emerald-600">
                            +{item.bv * item.quantity} BV
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-900 font-mono">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        ₹{item.price} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery Address Card */}
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Shipping Destination
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    {order.user.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                    {order.address || "No address saved in profile"}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-50 shrink-0"
              >
                Edit
              </Button>
            </section>

            {/* Interactive Payment Section Component */}
            <CheckoutPaymentSection
              orderId={order.id}
              cartTotal={order.totalAmount}
              totalBv={order.totalBv}
              upiId={upiId}
            />
          </div>

          {/* ──────────────── RIGHT COLUMN: Sticky Order Summary ──────────────── */}
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Sticky Summary Card */}
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <h2 className="text-base font-bold text-white">
                  Order Summary
                </h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  <Zap size={12} className="fill-emerald-400" />
                  <span>+{order.totalBv} BV Earned</span>
                </div>
              </div>

              <div className="py-6 space-y-3.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-white font-medium">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Standard Shipping</span>
                  <span className="font-bold text-emerald-400">
                    {order.totalAmount > SHIPPING_THRESHOLD ? "FREE" : `₹${SHIPPING_FEE}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-200">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    ₹{(order.totalAmount + (order.totalAmount <= SHIPPING_THRESHOLD ? SHIPPING_FEE : 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>Encrypted checkout. Guaranteed safe & secure.</span>
              </div>
            </div>

            {/* Business Wallet Notice */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-start gap-3">
              <Info size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">
                Accumulated <strong className="text-slate-900 font-bold">{order.totalBv} Business Volume (BV)</strong> points will automatically credit to your member wallet upon confirmation.
              </p>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}