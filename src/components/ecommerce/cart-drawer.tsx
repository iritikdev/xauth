"use client";

import { useState } from "react"; // Added
import { useCart } from "@/hooks/use-cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, Trash2, Zap, Loader2 } from "lucide-react"; // Added Loader2
import Image from "next/image";
import { useRouter } from "next/navigation"; // Added
import { createOrder } from "@/lib/actions/order"; // Import your server action
import { toast } from "sonner";
import { useSession } from "next-auth/react"; 
export function CartDrawer({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const { data: session } = useSession();
  const cart = useCart();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // Calculate Totals
  const totalPrice = cart.items.reduce((acc, item) => {
    const associatePrice = item.price - (item.price * (item.discount / 100));
    return acc + (associatePrice * item.quantity);
  }, 0);

  const totalBV = cart.items.reduce((acc, item) => acc + (item.bvAmount * item.quantity), 0);

  // --- CHECKOUT LOGIC ---
  const handleCheckout = async () => {
    // 1. Check Login on Client Side first
    if (!session) {
      toast.error("Authentication Required", {
        description: "Please login to earn BV points and complete your order.",
      });
      setOpen(false); // Close drawer
      router.push("/sign-in"); // Redirect to your sign-in page
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
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen} >
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-white border-none rounded-l-[3rem] p-0 overflow-hidden z-[101]">
        <SheetHeader className="p-8 bg-slate-900 text-white">
          <SheetTitle className="text-white flex items-center gap-3 italic font-black uppercase tracking-tighter text-2xl">
            <ShoppingBag className="text-emerald-400" /> Business <span className="text-emerald-400">Cart</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
              <ShoppingBag size={48} className="opacity-10" />
              <p className="font-black uppercase tracking-widest text-xs">Your cart is empty</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <div className="relative h-20 w-20 bg-white rounded-2xl overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-emerald-600">+{item.bvAmount * item.quantity} BV</span>
                    <span className="font-black text-slate-900">₹{(item.price - (item.price * (item.discount / 100))).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center bg-white rounded-xl border border-slate-200">
                      <button onClick={() => cart.updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2"><Minus size={12}/></button>
                      <span className="px-2 font-bold text-xs">{item.quantity}</span>
                      <button onClick={() => cart.updateQuantity(item.id, item.quantity + 1)} className="p-2"><Plus size={12}/></button>
                    </div>
                    <button onClick={() => cart.removeItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.items.length > 0 && (
          <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
            <div className="flex justify-between items-center bg-emerald-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
              <div className="flex items-center gap-2">
                <Zap size={20} className="fill-white" />
                <span className="font-black uppercase tracking-widest text-[10px]">Earned Points</span>
              </div>
              <span className="text-xl font-black">{totalBV} BV</span>
            </div>
            
            <div className="flex justify-between items-center px-2">
              <span className="font-bold text-slate-500 italic">Total Payable</span>
              <span className="text-3xl font-black text-slate-900">₹{totalPrice.toLocaleString()}</span>
            </div>

            <Button 
              onClick={handleCheckout}
              disabled={isPending}
              className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </>
              ) : (
                "Proceed to Secure Checkout"
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}