import { getMyOrders } from "@/lib/actions/order";
import {
  Package, ChevronRight, Clock, CheckCircle2,
  Truck, AlertCircle, Sparkles, ShoppingBag,
  ArrowRight, CalendarDays, Hash,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";

/* ─── status config ───────────────────────────────────────────── */
const STATUS = {
  DELIVERED: {
    icon: CheckCircle2,
    cls: "bg-emerald-50 border-emerald-200 text-emerald-700",
    dot: "bg-emerald-500",
    iconCls: "text-emerald-500",
  },
  SHIPPED: {
    icon: Truck,
    cls: "bg-blue-50 border-blue-200 text-blue-700",
    dot: "bg-blue-500",
    iconCls: "text-blue-500",
  },
  PENDING: {
    icon: Clock,
    cls: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-400",
    iconCls: "text-amber-500",
  },
  DEFAULT: {
    icon: AlertCircle,
    cls: "bg-zinc-100 border-zinc-200 text-zinc-500",
    dot: "bg-zinc-400",
    iconCls: "text-zinc-400",
  },
} as const;

function getStatus(status: string) {
  return STATUS[status as keyof typeof STATUS] ?? STATUS.DEFAULT;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

/* ─── page ────────────────────────────────────────────────────── */
export default async function MyOrdersPage() {
  const orders = await getMyOrders();

  const totalBV    = orders.reduce((a: number, o: any) => a + (o.totalBv ?? 0), 0);
  const totalSpent = orders.reduce((a: number, o: any) => a + (o.totalAmount ?? 0), 0);

  return (
    <div
      className="space-y-6 pb-20"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">
            Account
          </p>
          <h1
            className="text-2xl sm:text-3xl font-black text-zinc-900 leading-tight"
            style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
          >
            My Orders
          </h1>
          <p className="mt-1.5 text-sm font-medium text-zinc-400">
            Review your past purchases and track current deliveries.
          </p>
        </div>

        <Link
          href="/dashboard/store"
          className="inline-flex items-center gap-2 h-11 rounded-2xl bg-zinc-950 text-white px-5 text-[10px] font-black uppercase tracking-[0.18em] hover:bg-zinc-800 active:scale-[0.98] transition-all shrink-0 shadow-sm"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          <ShoppingBag size={13} strokeWidth={2} />
          Browse Store
        </Link>
      </div>

      {/* ── Summary strip ── */}
      {orders.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Orders", value: orders.length.toString() },
            { label: "Total Spent",  value: `₹${totalSpent.toLocaleString("en-IN")}` },
            { label: "BV Earned",   value: `${totalBV.toLocaleString("en-IN")} BV`, emerald: true },
          ].map((s) => (
            <div
              key={s.label}
              className={cn(
                "rounded-[2rem] border p-4 sm:p-5 flex flex-col gap-1 shadow-sm",
                s.emerald
                  ? "bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-900 border-emerald-800"
                  : "bg-white border-zinc-100"
              )}
            >
              <p className={cn(
                "text-[9px] font-black uppercase tracking-[0.18em]",
                s.emerald ? "text-emerald-400/70" : "text-zinc-400"
              )}>
                {s.label}
              </p>
              <p
                className={cn(
                  "text-xl sm:text-2xl font-black leading-none",
                  s.emerald ? "text-emerald-300" : "text-zinc-900"
                )}
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                {s.emerald && <Sparkles size={12} className="inline text-emerald-400 mr-1.5 mb-0.5" />}
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-5 rounded-[2rem] border border-dashed border-zinc-200 bg-white">
          <div className="h-16 w-16 rounded-3xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
            <Package size={24} className="text-zinc-300" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-zinc-500 mb-1">No orders yet</p>
            <p className="text-[11px] font-medium text-zinc-400">
              Start shopping to earn BV and unlock rewards
            </p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-2 h-11 rounded-2xl bg-zinc-950 text-white px-6 text-[10px] font-black uppercase tracking-[0.18em] hover:bg-zinc-800 transition-all"
          >
            <ShoppingBag size={13} strokeWidth={2} /> Start Shopping
          </Link>
        </div>
      )}

      {/* ── Order cards ── */}
      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const st       = getStatus(order.status);
            const StatusIcon = st.icon;
            const previewItems = order.items.slice(0, 4);
            const extra    = order.items.length - 4;

            return (
              <div
                key={order.id}
                className="rounded-[2rem] border border-zinc-100 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-200"
              >
                {/* ── card header ── */}
                <div className="px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-50 bg-zinc-50/60">
                  {/* order id + date */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm">
                      <Package size={14} className="text-zinc-400" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Hash size={9} className="text-zinc-400" />
                        <p className="text-[11px] font-black text-zinc-900 font-mono tracking-wider">
                          {order.id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      {order.createdAt && (
                        <div className="flex items-center gap-1">
                          <CalendarDays size={9} className="text-zinc-400" />
                          <p className="text-[10px] font-medium text-zinc-400">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* status */}
                    <span className={cn(
                      "inline-flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em]",
                      st.cls
                    )}>
                      <StatusIcon size={11} strokeWidth={2.5} className={st.iconCls} />
                      {order.status}
                    </span>

                    {/* payment */}
                    <span className="inline-flex items-center rounded-2xl border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* ── card body ── */}
                <div className="px-5 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

                  {/* product thumbnails */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {previewItems.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="h-12 w-12 rounded-2xl border-2 border-white bg-zinc-50 overflow-hidden shadow-sm flex items-center justify-center"
                          style={{ zIndex: previewItems.length - idx }}
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name ?? ""}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ))}
                      {extra > 0 && (
                        <div
                          className="h-12 w-12 rounded-2xl border-2 border-white bg-zinc-950 flex items-center justify-center text-[10px] font-black text-white shadow-sm"
                          style={{ zIndex: 0 }}
                        >
                          +{extra}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-zinc-900 leading-snug line-clamp-1">
                        {order.items[0]?.product?.name ?? "Order"}
                        {order.items.length > 1 && (
                          <span className="text-zinc-400 font-medium"> +{order.items.length - 1} more</span>
                        )}
                      </p>
                      <p className="text-[10px] font-medium text-zinc-400 mt-0.5">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* value + BV + action */}
                  <div className="flex items-center gap-4 sm:gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end">

                    {/* BV */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <Sparkles size={9} className="text-emerald-500" />
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600">
                          BV
                        </p>
                      </div>
                      <p
                        className="text-base font-black text-zinc-900"
                        style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                      >
                        {order.totalBv}
                      </p>
                    </div>

                    {/* amount */}
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-0.5">
                        Amount
                      </p>
                      <p
                        className="text-base font-black text-zinc-900"
                        style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                      >
                        ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* view details */}
                    <Link
                      href={`/shop/order-success/${order.id}`}
                      className="flex items-center gap-1.5 h-10 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white px-4 text-[10px] font-black uppercase tracking-[0.14em] transition-all active:scale-[0.97] shrink-0"
                      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                    >
                      <span className="hidden sm:inline">View</span>
                      <ArrowRight size={13} strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>

                {/* ── progress bar for non-delivered ── */}
                {order.status !== "DELIVERED" && (
                  <div className="px-5 sm:px-6 pb-4">
                    <div className="flex items-center gap-0 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                      {["Placed","Processing","Shipped","Delivered"].map((step, i) => {
                        const stepIdx   = ["PENDING","PROCESSING","SHIPPED","DELIVERED"].indexOf(order.status);
                        const active    = i <= stepIdx;
                        const current   = i === stepIdx;
                        return (
                          <React.Fragment key={step}>
                            <div className="flex flex-col items-center gap-1">
                              <div className={cn(
                                "h-1.5 w-1.5 rounded-full transition-all",
                                current ? "bg-emerald-500 scale-150" : active ? "bg-emerald-400" : "bg-zinc-200"
                              )} />
                              <span className={cn("text-[8px] hidden sm:block", active ? "text-emerald-600 font-black" : "text-zinc-300")}>
                                {step}
                              </span>
                            </div>
                            {i < 3 && (
                              <div className={cn(
                                "flex-1 h-px mx-1 mb-4",
                                i < stepIdx ? "bg-emerald-400" : "bg-zinc-200"
                              )} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}