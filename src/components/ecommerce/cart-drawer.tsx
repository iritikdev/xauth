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
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

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

  /* ── totals ── */
  const totalPrice = cart.items.reduce((acc, item) => {
    const net = item.price - item.price * (item.discount / 100);
    return acc + net * item.quantity;
  }, 0);

  const totalBV = cart.items.reduce((acc, item) => acc + item.bvAmount * item.quantity, 0);
  const savings = cart.items.reduce((acc, item) => acc + item.price * (item.discount / 100) * item.quantity, 0);

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
        toast.error(result.error);
      }
    } catch {
      toast.error("Checkout failed.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        // Mobile par niche se aur round corners ke saath, desktop par side se
        side="bottom"
        className="h-[92vh] sm:h-screen w-full sm:max-w-[440px] sm:side-right flex flex-col bg-[#F8F9FA] border-none rounded-t-[2.5rem] sm:rounded-t-none sm:rounded-l-[2.5rem] p-0 z-[101] shadow-2xl"
      >
        {/* ── Mobile Drag Handle ── */}
        <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto mt-3 mb-1 sm:hidden opacity-40" />

        {/* ── Header ── */}
        <div className="px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-20 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <ShoppingCart size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">Your Basket</h3>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                {cart.items.length} Formulation{cart.items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 active:scale-90 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* ── Cart Items ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
              <div className="h-20 w-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center">
                <ShoppingBag size={32} className="text-zinc-200" />
              </div>
              <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">Basket is empty</p>
              <Button onClick={() => setOpen(false)} variant="outline" className="rounded-full px-8 border-emerald-200 text-emerald-700">Explore Products</Button>
            </div>
          ) : (
            cart.items.map((item) => {
              const net = item.price - item.price * (item.discount / 100);
              return (
                <div
                  key={item.id}
                  className="group relative bg-white p-4 rounded-[2.5rem] shadow-sm border border-zinc-100 flex gap-4 items-center transition-all hover:border-emerald-100"
                >
                  {/* ── REMOVE BUTTON ── */}
                  <button
                    onClick={() => cart.removeItem(item.id)}
                    className={cn(
                      "absolute -top-1 -right-1 h-8 w-8 rounded-full shadow-md z-20 flex items-center justify-center transition-all active:scale-90",
                      "bg-rose-500 text-white border-2 border-white", // Mobile: Bright & Visible
                      "md:bg-rose-50 md:text-rose-500 md:border md:border-rose-100 md:opacity-0 md:group-hover:opacity-100 md:hover:bg-rose-500 md:hover:text-white" // Desktop: Hover effects
                    )}
                    title="Remove Item"
                  >
                    <Trash2 size={14} strokeWidth={3} />
                  </button>

                  {/* thumbnail */}
                  <div className="h-20 w-20 rounded-2xl bg-slate-50 border border-slate-100 relative shrink-0 overflow-hidden shadow-inner">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs font-black text-zinc-900 line-clamp-1 uppercase italic tracking-tighter">
                        {item.name}
                      </p>
                    </div>

                    <p className="text-[10px] font-bold text-emerald-600 uppercase">
                      +{item.bvAmount * item.quantity} BV Earned
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* qty stepper */}
                      <div className="flex items-center bg-zinc-50 rounded-xl p-1 border border-zinc-100">
                        <button
                          onClick={() => cart.updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="h-7 w-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-zinc-900 hover:text-emerald-600 transition-colors"
                        >
                          <Minus size={12} strokeWidth={3} />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-zinc-900">{item.quantity}</span>
                        <button
                          onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-zinc-900 hover:text-emerald-600 transition-colors"
                        >
                          <Plus size={12} strokeWidth={3} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-black text-sm italic text-zinc-900">
                          ₹{(net * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* ── Bottom Summary Dock ── */}
        {cart.items.length > 0 && (
          <div className="bg-white border-t border-zinc-100 px-6 py-6 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.04)] space-y-4">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Business Value</p>
                <p className="text-2xl font-black italic text-emerald-600 tracking-tighter">{totalBV} <span className="text-xs uppercase not-italic">Points</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Total Payable</p>
                <p className="text-2xl font-black italic text-zinc-900 tracking-tighter">₹{totalPrice.toLocaleString()}</p>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isPending}
              className="w-full h-14 rounded-2xl bg-zinc-900 hover:bg-black text-white font-black uppercase tracking-[0.2em] text-[11px] gap-3 shadow-xl shadow-zinc-900/20 active:scale-95 transition-all"
            >
              {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <><Sparkles size={16} className="text-emerald-400" /> Confirm Order</>}
            </Button>

            {savings > 0 && (
              <p className="text-center text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 py-2 rounded-full border border-emerald-100">
                You saved ₹{savings.toLocaleString()} on this order
              </p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}