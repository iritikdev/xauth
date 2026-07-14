import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  CheckCircle2, Package, Truck, Zap,
  ArrowRight, FileText, Home, Sparkles,
  ChevronLeft, Hash, CreditCard, MapPin,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { baseDashboardUrl } from "@/lib/constants";

export default async function OrderSuccessPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  const previewItems = order.items.slice(0, 3);
  const extra        = order.items.length - 3;

  return (
    <div
      className="min-h-screen bg-zinc-50 relative overflow-x-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ambient bg orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-400/5 blur-[130px]" />
        <div className="absolute -bottom-32 right-0  w-[400px] h-[400px] rounded-full bg-zinc-900/4 blur-[110px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-6">

        {/* ── Back button ── */}
        <div className="flex items-center gap-3">
          <Link
            href={`${baseDashboardUrl}/orders`}
            className="flex items-center gap-2 h-9 rounded-2xl border border-zinc-200 bg-white px-3 text-[11px] font-bold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-all shadow-sm"
          >
            <ChevronLeft size={14} strokeWidth={2.5} /> My Orders
          </Link>
          <span className="text-zinc-300 text-xs">/</span>
          <span className="text-[11px] font-medium text-zinc-400 truncate">
            #{order.id.slice(-8).toUpperCase()}
          </span>
        </div>

        {/* ── Success hero ── */}
        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 p-8 sm:p-10 text-center">
          {/* corner marks */}
          {(["tl","tr","bl","br"] as const).map((p) => (
            <span key={p} className={cn(
              "absolute h-5 w-5 border-emerald-400/25",
              p==="tl" && "top-4 left-4 border-t-2 border-l-2 rounded-tl",
              p==="tr" && "top-4 right-4 border-t-2 border-r-2 rounded-tr",
              p==="bl" && "bottom-4 left-4 border-b-2 border-l-2 rounded-bl",
              p==="br" && "bottom-4 right-4 border-b-2 border-r-2 rounded-br",
            )} />
          ))}
          <div className="absolute -top-16 right-1/3 h-48 w-48 rounded-full bg-emerald-400/6 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-5">
            {/* animated check */}
            <div className="relative">
              <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
                <CheckCircle2 size={36} className="text-emerald-400" strokeWidth={2} />
              </div>
              <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400/20 animate-ping opacity-30" />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 mb-2">
                Order Confirmed
              </p>
              <h1
                className="text-3xl sm:text-4xl font-black text-white leading-tight"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                Thank you!
              </h1>
              <p className="text-sm font-medium text-zinc-500 mt-2 max-w-xs mx-auto leading-relaxed">
                Your Amaze Ayurveda order is placed. We'll process it right away.
              </p>
            </div>
          </div>
        </div>

        {/* ── Order details + BV grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Order details card */}
          <div className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                <Package size={13} strokeWidth={2} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
                Order Details
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-0.5">
                    Order ID
                  </p>
                  <p className="text-[12px] font-black text-zinc-900 font-mono tracking-wider">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest",
                  order.status === "DELIVERED"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : order.status === "SHIPPED"
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-amber-50 border-amber-200 text-amber-700"
                )}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {order.status}
                </div>
              </div>

              <div className="h-px bg-zinc-100" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-400 mb-0.5">
                    Order Total
                  </p>
                  <p
                    className="text-xl font-black text-zinc-900"
                    style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                  >
                    ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-400 mb-0.5">
                    Payment
                  </p>
                  <p className="text-sm font-black text-emerald-700">
                    Cash on Delivery
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BV prestige card */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-900 p-6 shadow-xl">
            <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-emerald-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                  Business Volume
                </p>
              </div>
              <div>
                <p
                  className="text-5xl font-black text-emerald-100 leading-none"
                  style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                >
                  {order.totalBv}
                  <span className="text-xl font-black text-emerald-600 ml-2">BV</span>
                </p>
                <p className="text-[11px] font-bold text-emerald-700 mt-2">
                  Added on successful delivery
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-400/10 border border-emerald-400/20 px-4 py-3">
                <p className="text-[10px] font-medium text-emerald-300/70 leading-snug">
                  BV is credited to your distributor account after cash collection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Product summary ── */}
        <div className="rounded-[2rem] border border-zinc-100 bg-white overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-zinc-50 bg-zinc-50/60 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-400">
              <Package size={12} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Items Ordered
            </span>
            <span className="ml-auto text-[10px] font-black text-zinc-400 bg-white border border-zinc-200 rounded-full px-2.5 py-0.5">
              {order.items.length}
            </span>
          </div>

          <div className="divide-y divide-zinc-50">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-12 w-12 rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={48}
                      height={48}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <Package size={20} className="text-zinc-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-black text-zinc-900 truncate"
                    style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                    {item.product.name}
                  </p>
                  <p className="text-[10px] font-medium text-zinc-400 mt-0.5">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-zinc-900"
                    style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-600">
                    +{item.product.bvAmount * item.quantity} BV
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── What's next ── */}
        <div className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
              <Truck size={13} strokeWidth={2} />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
              What's Next?
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: <FileText size={16} strokeWidth={2} />,
                step: "01",
                label: "Processing",
                desc: "Our team is verifying and packing your Ayurvedic products.",
                active: false,
              },
              {
                icon: <Truck size={16} strokeWidth={2} />,
                step: "02",
                label: "Dispatch",
                desc: "Handed to our Bihar courier partner for delivery.",
                active: false,
              },
              {
                icon: <Home size={16} strokeWidth={2} />,
                step: "03",
                label: "Delivery",
                desc: "Pay cash at your doorstep. BV credited instantly.",
                active: true,
              },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center gap-3">
                <div className={cn(
                  "h-11 w-11 rounded-2xl flex items-center justify-center transition-all",
                  s.active
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
                    : "bg-zinc-50 border border-zinc-200 text-zinc-400"
                )}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-900 mb-1">
                    {s.label}
                  </p>
                  <p className="text-[10px] font-medium text-zinc-400 leading-snug">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`${baseDashboardUrl}/orders`}
            className="flex items-center justify-center gap-2 h-12 rounded-2xl border border-zinc-200 bg-white text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 transition-all shadow-sm flex-1"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            <FileText size={13} strokeWidth={2} /> View All Orders
          </Link>
          <Link
            href={`${baseDashboardUrl}/store`}
            className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white text-[11px] font-black uppercase tracking-[0.18em] transition-all active:scale-[0.98] flex-1 shadow-sm"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Continue Shopping <ArrowRight size={13} strokeWidth={2.5} />
          </Link>
        </div>

      </div>
    </div>
  );
}