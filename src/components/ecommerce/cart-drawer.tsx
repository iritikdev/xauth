"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Minus, Plus, ShoppingBag, Trash2,
  Sparkles, Loader2, ArrowRight, Package,
  ShoppingCart, X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions/order";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function CartDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  const { data: session } = useSession();
  const cart              = useCart();
  const router            = useRouter();
  const [isPending, setIsPending] = useState(false);

  /* ── totals ── */
  const totalPrice = cart.items.reduce((acc, item) => {
    const net = item.price - item.price * (item.discount / 100);
    return acc + net * item.quantity;
  }, 0);

  const totalBV = cart.items.reduce(
    (acc, item) => acc + item.bvAmount * item.quantity,
    0
  );

  const savings = cart.items.reduce((acc, item) => {
    return acc + item.price * (item.discount / 100) * item.quantity;
  }, 0);

  /* ── checkout ── */
  const handleCheckout = async () => {
    if (!session) {
      toast.error("Please sign in to complete your order.");
      setOpen(false);
      router.push("/sign-in");
      return;
    }
    if (cart.items.length === 0) return;
    try {
      setIsPending(true);
      const result = await createOrder(cart.items);
      if (result.success) {
        cart.clearCart();
        setOpen(false);
        router.push(`/checkout/${result.orderId}`);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        className="w-full sm:max-w-[420px] flex flex-col bg-white border-none rounded-l-[2rem] p-0 overflow-hidden z-[101]"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {/* ── Header ── */}
        <div className="relative overflow-hidden bg-zinc-950 px-6 py-6 flex-shrink-0">
          {/* ambient orb */}
          <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-emerald-400/8 blur-3xl pointer-events-none" />
          {/* corner marks */}
          {(["tl","tr"] as const).map((p) => (
            <span key={p} className={cn(
              "absolute h-4 w-4 border-emerald-400/25",
              p==="tl" && "top-3 left-3 border-t border-l rounded-tl",
              p==="tr" && "top-3 right-3 border-t border-r rounded-tr",
            )} />
          ))}

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                <ShoppingCart size={16} className="text-emerald-400" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-emerald-400/70 mb-0.5">
                  Business Cart
                </p>
                <SheetTitle
                  className="text-[15px] font-black text-white leading-none"
                  style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                >
                  {cart.items.length === 0
                    ? "Your cart"
                    : `${cart.items.length} item${cart.items.length !== 1 ? "s" : ""}`}
                </SheetTitle>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white flex items-center justify-center transition-all"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* emerald hairline */}
          <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent" />
        </div>

        {/* ── Cart items ── */}
        <div className="flex-1 overflow-y-auto">
          {cart.items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full gap-5 px-6 py-16">
              <div className="h-16 w-16 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                <ShoppingBag size={24} className="text-zinc-300" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-zinc-500 mb-1"
                  style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                  Your cart is empty
                </p>
                <p className="text-[11px] font-medium text-zinc-400">
                  Add products to earn BV and unlock rewards
                </p>
              </div>
              <Link
                href="/dashboard/store"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 h-10 rounded-2xl bg-zinc-950 text-white px-5 text-[10px] font-black uppercase tracking-[0.16em] hover:bg-zinc-800 transition-all"
              >
                <Package size={13} strokeWidth={2} /> Browse Store
              </Link>
            </div>
          ) : (
            <div className="px-5 py-4 space-y-3">
              {cart.items.map((item) => {
                const net = item.price - item.price * (item.discount / 100);
                const lineTotal = net * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="group flex gap-3 rounded-[1.5rem] border border-zinc-100 bg-zinc-50/40 p-3.5 hover:border-zinc-200 hover:bg-white transition-all"
                  >
                    {/* thumbnail */}
                    <div className="relative h-16 w-16 rounded-2xl bg-white border border-zinc-100 overflow-hidden flex-shrink-0 shadow-sm">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    {/* info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className="text-[13px] font-black text-zinc-900 line-clamp-1 leading-snug"
                          style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                        >
                          {item.name}
                        </p>
                        <button
                          onClick={() => cart.removeItem(item.id)}
                          className="h-6 w-6 rounded-lg border border-zinc-200 bg-white text-zinc-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-all shrink-0 opacity-0 group-hover:opacity-100"
                        >
                          <X size={10} strokeWidth={2.5} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* qty stepper */}
                        <div className="flex items-center bg-white border border-zinc-200 rounded-xl h-7 px-1 gap-0.5">
                          <button
                            onClick={() => cart.updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="h-5 w-5 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                          >
                            <Minus size={10} strokeWidth={2.5} />
                          </button>
                          <span className="px-2 text-[12px] font-black text-zinc-900 min-w-[20px] text-center"
                            style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                            className="h-5 w-5 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                          >
                            <Plus size={10} strokeWidth={2.5} />
                          </button>
                        </div>

                        {/* price + BV */}
                        <div className="text-right">
                          <p
                            className="text-[13px] font-black text-zinc-900"
                            style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                          >
                            ₹{lineTotal.toLocaleString("en-IN")}
                          </p>
                          <p className="text-[10px] font-black text-emerald-600">
                            +{item.bvAmount * item.quantity} BV
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* clear all */}
              <button
                onClick={cart.clearCart}
                className="w-full flex items-center justify-center gap-1.5 h-8 rounded-xl border border-zinc-200 bg-white text-[10px] font-bold text-zinc-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
              >
                <Trash2 size={11} strokeWidth={2} /> Clear Cart
              </button>
            </div>
          )}
        </div>

        {/* ── Footer summary ── */}
        {cart.items.length > 0 && (
          <div className="flex-shrink-0 border-t border-zinc-100 bg-white px-5 py-5 space-y-4">

            {/* BV earned */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-900 px-5 py-4">
              <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={13} className="text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                    BV Earned This Order
                  </span>
                </div>
                <span
                  className="text-xl font-black text-emerald-300"
                  style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                >
                  {totalBV} BV
                </span>
              </div>
            </div>

            {/* price breakdown */}
            <div className="space-y-2 px-1">
              {savings > 0 && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-zinc-400">Partner Savings</span>
                  <span className="font-black text-emerald-600">
                    − ₹{savings.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500">Total Payable</span>
                <span
                  className="text-2xl font-black text-zinc-900"
                  style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                >
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* checkout button */}
            <button
              onClick={handleCheckout}
              disabled={isPending}
              className={cn(
                "w-full h-12 rounded-2xl text-[11px] font-black uppercase tracking-[0.18em]",
                "flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                isPending
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  : "bg-zinc-950 hover:bg-zinc-800 text-white shadow-sm shadow-zinc-900/20"
              )}
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              {isPending ? (
                <><Loader2 size={14} className="animate-spin" /> Processing…</>
              ) : (
                <>Secure Checkout <ArrowRight size={13} strokeWidth={2.5} /></>
              )}
            </button>

            <p className="text-center text-[10px] font-medium text-zinc-400">
              Cash on Delivery · BV credited on delivery
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}