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
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions/order";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

/**
 * Redesigned CartDrawer
 * - Animated quantity changes
 * - Discount badges on thumbnails
 * - Remove toast + optimistic UI
 * - Sticky summary with estimated delivery and savings
 * - Accessible controls and improved visual hierarchy
 */

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

  /* ── totals ── */
  const totalPrice = cart.items.reduce((acc, item) => {
    const net = item.price - item.price * (item.discount / 100);
    return acc + net * item.quantity;
  }, 0);

  const totalBV = cart.items.reduce((acc, item) => acc + item.bvAmount * item.quantity, 0);
  const savings = cart.items.reduce((acc, item) => acc + item.price * (item.discount / 100) * item.quantity, 0);

  /* ── Checkout handler ── */
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

  /* ── Helpers ── */
  const handleRemove = (id: string, name?: string) => {
    // optimistic UI + toast
    setRemovingItemId(id);
    cart.removeItem(id);
    toast.success(`${name ?? "Item"} removed from cart.`);
    // clear removing state after short delay to allow animation if needed
    setTimeout(() => setRemovingItemId(null), 600);
  };

  const updateQuantity = (id: string, qty: number) => {
    // small animation trigger
    qtyAnimRef.current[id] = (qtyAnimRef.current[id] || 0) + 1;
    cart.updateQuantity(id, qty);
  };

  useEffect(() => {
    // reset animation refs when cart changes drastically
    if (cart.items.length === 0) qtyAnimRef.current = {};
  }, [cart.items.length]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
      showCloseButton={false}
        side="bottom"
        className="h-[80vh] sm:h-screen w-full sm:max-w-[480px] sm:side-right flex flex-col bg-[#F8F9FA] border-none rounded-t-[2.5rem] sm:rounded-t-none sm:rounded-l-[2.5rem] p-0 z-[101] shadow-2xl"
      >
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto mt-3 mb-1 sm:hidden opacity-40" />

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between bg-white/60 backdrop-blur-md sticky top-0 z-20 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <ShoppingCart size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">Your Basket</h3>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                {cart.items.length} item{cart.items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 active:scale-95 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
              <div className="h-28 w-28 bg-white rounded-[2rem] shadow-sm flex items-center justify-center">
                <ShoppingCart size={36} className="text-zinc-200" />
              </div>
              <p className="text-sm font-black text-zinc-500 uppercase tracking-widest">Your basket is empty</p>
              <p className="text-xs text-zinc-400 max-w-[260px]">Add products to your basket and they’ll appear here. We’ll save them until you’re ready to checkout.</p>
              <Button onClick={() => setOpen(false)} variant="outline" className="rounded-full px-8 border-emerald-200 text-emerald-700">
                Start Shopping
              </Button>
            </div>
          ) : (
            cart.items.map((item) => {
              const net = item.price - item.price * (item.discount / 100);
              const animKey = qtyAnimRef.current[item.id] ?? 0;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "group relative bg-white p-4 rounded-[1.5rem] shadow-sm border border-zinc-100 flex gap-4 items-center transition-all",
                    removingItemId === item.id ? "opacity-40 scale-95" : "hover:shadow-md hover:border-emerald-100"
                  )}
                >
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(item.id, item.name)}
                    className={cn(
                      "absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-md z-20 flex items-center justify-center transition-all active:scale-90",
                      "bg-rose-500 text-white border-2 border-white",
                      "md:bg-rose-50 md:text-rose-500 md:border md:border-rose-100 md:opacity-0 md:group-hover:opacity-100 md:hover:bg-rose-500 md:hover:text-white"
                    )}
                    title="Remove Item"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={14} strokeWidth={3} />
                  </button>

                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2 transition-transform group-hover:scale-105" />
                    {item.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        -{item.discount}%
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-zinc-900 line-clamp-1 tracking-tight">{item.name}</p>
                    </div>

                    <p className="text-[10px] font-semibold text-emerald-600 uppercase mt-1">+{item.bvAmount * item.quantity} BV</p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty stepper */}
                      <div className="flex items-center bg-zinc-50 rounded-lg p-1 border border-zinc-100">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-zinc-900 hover:text-emerald-600 transition-colors"
                        >
                          <Minus size={14} strokeWidth={3} />
                        </button>

                        <div
                          key={`${item.id}-${animKey}`}
                          className="w-10 text-center text-sm font-black text-zinc-900 mx-2 transition-transform duration-200"
                          style={{ transform: removingItemId === item.id ? "scale(.98)" : undefined }}
                        >
                          {item.quantity}
                        </div>

                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-zinc-900 hover:text-emerald-600 transition-colors"
                        >
                          <Plus size={14} strokeWidth={3} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-black text-sm  text-zinc-900">₹{(net * item.quantity).toLocaleString()}</p>
                        {item.discount > 0 && (
                          <p className="text-xs text-zinc-400 line-through">₹{(item.price * item.quantity).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Summary Dock */}
        {cart.items.length > 0 && (
          <div className="bg-white border-t border-zinc-100 px-6 py-6 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] space-y-4 sticky bottom-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Business Value</p>
                <p className="text-xl font-black  text-emerald-600 tracking-tighter">{totalBV} <span className="text-xs uppercase not-italic">Points</span></p>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Total Payable</p>
                <p className="text-xl font-black  text-zinc-900 tracking-tighter">₹{totalPrice.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <PackageIconFallback />
                <div>
                  <p className="text-xs font-bold text-zinc-600">Estimated delivery</p>
                  <p className="text-sm font-semibold text-zinc-800">3–5 business days</p>
                </div>
              </div>

              <div className="text-right">
                {savings > 0 && (
                  <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    You saved ₹{savings.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isPending}
              className={cn(
                "w-full h-14 rounded-2xl font-black uppercase tracking-[0.12em] text-[12px] gap-3 active:scale-95 transition-all",
                isPending ? "bg-zinc-900/80 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              )}
            >
              {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <><Sparkles size={16} className="text-white" /> Confirm Order</>}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* Small inline fallback icon component to avoid extra imports for Package icon */
function PackageIconFallback() {
  return (
    <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-90">
        <path d="M21 16V8a1 1 0 0 0-.553-.894l-8-4.5a1 1 0 0 0-.894 0l-8 4.5A1 1 0 0 0 3 8v8a1 1 0 0 0 .553.894l8 4.5a1 1 0 0 0 .894 0l8-4.5A1 1 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    </div>
  );
}
