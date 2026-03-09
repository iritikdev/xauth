"use client";

import { useCart } from "@/lib/store/use-cart";
import { ShoppingBag, X, Plus, Minus, Trash2, Zap, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export function CartDrawer() {
  const { items, removeItem, updateQuantity } = useCart();
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalBV = items.reduce((acc, item) => acc + (item.bvAmount * item.quantity), 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group rounded-full hover:bg-emerald-50">
          <ShoppingBag className="w-6 h-6 text-slate-900 group-hover:text-emerald-600 transition-colors" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="z-[999] w-full sm:max-w-md p-0 border-none flex flex-col h-full bg-white shadow-2xl">
        <SheetHeader className="p-8 bg-[#0f172a] text-white">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
            <SheetTitle className="text-white font-black italic uppercase tracking-tighter text-2xl">Your Business Cart</SheetTitle>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Associate Order Management</p>
        </SheetHeader>

        <ScrollArea className="flex-1 px-8">
          {items.length === 0 ? (
            <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Your cart is empty</p>
            </div>
          ) : (
            <div className="py-8 space-y-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="h-24 w-24 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-black text-slate-900 text-sm leading-tight uppercase italic">{item.name}</h4>
                      <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                       <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-black">{item.bvAmount} BV</Badge>
                       <span className="text-sm font-black text-slate-900">₹{item.price}</span>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center bg-slate-50 rounded-xl border border-slate-100 p-0.5">
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-7 w-7 rounded-lg"><Minus className="w-3 h-3" /></Button>
                        <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-7 w-7 rounded-lg"><Plus className="w-3 h-3" /></Button>
                      </div>
                      <span className="text-sm font-black text-slate-900 tracking-tighter">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer Summary */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Commission BV</span>
              <Badge className="bg-emerald-500 text-white border-none font-black px-3 py-1 rounded-lg shadow-lg shadow-emerald-500/20">
                <Zap className="w-3 h-3 mr-1 fill-current" /> {totalBV} BV Points
              </Badge>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-black text-slate-900 uppercase italic">Grand Total</span>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{subtotal.toLocaleString()}</span>
            </div>
          </div>

          <Link href="/checkout" className="block w-full">
            <Button disabled={items.length === 0} className="w-full h-16 rounded-2xl bg-[#0f172a] hover:bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-[11px] gap-3 shadow-xl transition-all active:scale-95 group">
              Proceed to Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}