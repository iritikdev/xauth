"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Sparkles,
  Loader2,
  X,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowRight,
  Ticket,
  Percent,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions/order";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  const { data: session } = useSession();
  const cart = useCart();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const qtyAnimRef = useRef<Record<string, number>>({});

  /* ── Totals Calculations ── */
  const totalPrice = cart.items.reduce((acc, item) => {
    const net = item.price - item.price * (item.discount / 100);
    return acc + net * item.quantity;
  }, 0);

  const totalBV = cart.items.reduce((acc, item) => acc + item.bvAmount * item.quantity, 0);
  const savings = cart.items.reduce((acc, item) => acc + item.price * (item.discount / 100) * item.quantity, 0);

  /* ── Checkout Handler ── */
  const handleCheckout = async () => {
    if (!session) {
      toast.error("Please sign in to order.");
      setOpen(false);
      router.push("/sign-in");
      return;
    }
    try {
      setIsPending(true);
      const result = await createOrder(cart.items);
      if (result.success) {
        cart.clearCart();
        setOpen(false);
        router.push(`/checkout/${result.orderId}`);
      } else {
        toast.error(result.error || "Checkout failed.");
      }
    } catch {
      toast.error("Checkout failed.");
    } finally {
      setIsPending(false);
    }
  };

  /* ── Handlers ── */
  const handleRemove = (id: string, name?: string) => {
    setRemovingItemId(id);
    setTimeout(() => {
      cart.removeItem(id);
      toast.success(`${name ?? "Item"} removed from cart.`);
      setRemovingItemId(null);
    }, 2000);
  };

  const updateQuantity = (id: string, qty: number) => {
    qtyAnimRef.current[id] = (qtyAnimRef.current[id] || 0) + 1;
    cart.updateQuantity(id, qty);
  };

  useEffect(() => {
    if (cart.items.length === 0) qtyAnimRef.current = {};
  }, [cart.items.length]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        showCloseButton={false}
        side="right"
        className="h-full w-full sm:max-w-[500px] flex flex-col bg-slate-50 p-0 z-[101] shadow-2xl border-l border-slate-200"
      >
        {/* ─── STICKY HEADER ─── */}
        <div className="px-6 py-5 flex items-center justify-between bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-sm shadow-slate-100/50">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md">
              <ShoppingCart size={20} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-slate-900">Your Cart</h3>
              <p className="text-xs font-semibold text-slate-400 font-mono">
                {cart.items.length} {cart.items.length === 1 ? "ITEM" : "ITEMS"} SELECTED
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors active:scale-95"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* ─── DYNAMIC SCROLL CONTAINER ─── */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {cart.items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[65vh] text-center px-4"
              >
                <div className="h-24 w-24 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center justify-center mb-6">
                  <ShoppingCart size={32} className="text-slate-300" />
                </div>
                <h4 className="text-base font-black text-slate-900 uppercase tracking-wider">Your cart is empty</h4>
                <p className="text-xs text-slate-400 max-w-[280px] mt-2 mb-6 leading-relaxed">
                  Looks like you haven't added anything to your cart yet. Explore our premium herbal formulations to begin.
                </p>
                <Button 
                  onClick={() => setOpen(false)} 
                  className="rounded-xl h-11 px-8 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-800 shadow-lg shadow-slate-900/10"
                >
                  Start Shopping
                </Button>
              </motion.div>
            ) : (
              cart.items.map((item) => {
                const net = item.price - item.price * (item.discount / 100);
                const isItemRemoving = removingItemId === item.id;

                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={cn(
                      "group relative bg-white p-4 rounded-2xl border border-slate-200/60 flex gap-4 items-center transition-all duration-300",
                      isItemRemoving ? "opacity-30 scale-95 pointer-events-none" : "hover:shadow-md hover:border-slate-300"
                    )}
                  >
                    {/* Compact Nested Thumbnail Area */}
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-slate-100 shrink-0 bg-slate-50 flex items-center justify-center">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-105" 
                      />
                      {item.discount > 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                          <Percent size={8} /> {item.discount}%
                        </span>
                      )}
                    </div>

                    {/* Metadata Specs */}
                    <div className="flex-1 min-w-0 h-full flex flex-col justify-between py-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => handleRemove(item.id, item.name)}
                          className="text-slate-300 hover:text-rose-600 transition-colors h-7 w-7 rounded-lg flex items-center justify-center hover:bg-rose-50"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Business MLM Ledger Badge */}
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          <Zap size={9} className="fill-emerald-600 stroke-none" />
                          +{item.bvAmount * item.quantity} BV
                        </span>
                      </div>

                      {/* Quantity Stepper & Price Line Matrix */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-slate-50 rounded-xl p-0.5 border border-slate-200">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            className="h-7 w-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-800 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          >
                            <Minus size={12} strokeWidth={2.5} />
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-black text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-800 hover:text-slate-900 transition-colors"
                          >
                            <Plus size={12} strokeWidth={2.5} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold font-mono text-sm text-slate-900">
                            ₹{(net * item.quantity).toLocaleString()}
                          </p>
                          {item.discount > 0 && (
                            <p className="text-[10px] text-slate-400 font-mono line-through">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* ─── STICKY PREMIUM BOTTOM DOCK ─── */}
        {cart.items.length > 0 && (
          <div className="bg-white border-t border-slate-200 p-6 space-y-4 sticky bottom-0 z-30 shadow-[0_-12px_40px_rgba(0,0,0,0.03)]">
            
            {/* Promo Voucher Area */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Ticket size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="VOUCHER OR PROMO CODE" 
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold tracking-wider placeholder:text-slate-400 uppercase outline-none focus:border-slate-400 focus:bg-white transition-all"
                />
              </div>
              <Button variant="outline" className="h-11 rounded-xl border-slate-200 font-bold text-xs px-4 text-slate-800 hover:bg-slate-50">
                Apply
              </Button>
            </div>

            {/* Dynamic Value Metrics */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Business Value Pool</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Zap size={12} className="fill-emerald-500 stroke-none" />
                  {totalBV} Points
                </span>
              </div>
              {savings > 0 && (
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Distributor Privilege Savings</span>
                  <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                    -₹{savings.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="h-px bg-slate-200/80 my-1" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">Total Payable</span>
                <span className="text-xl font-black font-mono text-slate-900 tracking-tight">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Delivery Estimation Anchor */}
            <div className="flex items-center gap-3 px-1">
              <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <Truck size={16} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimated Delivery</p>
                <p className="text-xs font-bold text-slate-800">3–5 Business Days (Standard Dispatch)</p>
              </div>
            </div>

            {/* Primary Action Button */}
            <Button
              onClick={handleCheckout}
              disabled={isPending}
              className={cn(
                "w-full h-14 rounded-2xl font-black uppercase tracking-[0.15em] text-xs gap-2 active:scale-[0.98] transition-all shadow-lg",
                isPending 
                  ? "bg-slate-800 text-white cursor-not-allowed" 
                  : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10"
              )}
            >
              {isPending ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} strokeWidth={2.5} />
                </>
              )}
            </Button>

            {/* Trust Assurances Footnotes */}
            
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}