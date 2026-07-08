"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Zap, Percent, Plus, Eye, Lock, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product }: { product: any }) {
  const [addedFlash, setAddedFlash] = useState(false);
  const cart = useCart();
  const router = useRouter();

  // 1. Check User Login Session
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const netPrice = product.price - product.price * (product.discount / 100);
  const outOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Link click prevent karne ke liye

    // Agar logged in nahi hai, toh login page par bhejo
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (outOfStock) return;

    cart.addItem(product, 1);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1400);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="group relative flex flex-col bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm active:shadow-md transition-all"
    >
      {/* ─── IMAGE SECTION ─── */}
      <div className="relative aspect-[1/1.1] w-full bg-slate-50 overflow-hidden">
        <Link href={`/shop/${product.id}`} className="block h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </Link>

        {/* Top Badges */}
       <div className="absolute top-2 left-2 flex  gap-1 z-10">
          {product.discount > 0 && (
            <div className={cn(
              "bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase transition-all",
              !isLoggedIn && "blur-[3px] select-none opacity-80"
            )}>
              -{product.discount}%
            </div>
          )}

          {/* BV Badge */}
          <div className={cn(
            "bg-[#1c3320] text-[#e8a020] text-[8px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-1 transition-all",
            !isLoggedIn && "blur-[3px] select-none opacity-80"
          )}>
            <Zap size={8} className="fill-[#e8a020]" />
            {isLoggedIn ? `${product.bvAmount} BV` : "99 BV"}
          </div>
        </div>

        {/* View Detail Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
            <Eye size={16} className="text-slate-700" />
          </div>
        </div>

        {/* Quick Add / Login Redirect Button */}
        <Button
          onClick={handleAddToCart}
          disabled={outOfStock && isLoggedIn}
          className={cn(
            "absolute bottom-2 right-2 h-9 w-9 p-0 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90 z-20",
            addedFlash ? "bg-emerald-500 text-white" : "bg-white text-slate-900 hover:bg-slate-50",
            outOfStock && isLoggedIn && "hidden"
          )}
        >
          <AnimatePresence mode="wait">
            {addedFlash ? (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} key="check">
                <Check size={16} strokeWidth={3} />
              </motion.span>
            ) : isLoggedIn ? (
              <Plus size={18} key="plus" />
            ) : (
              <Lock size={14} className="text-emerald-700" key="lock" />
            )}
          </AnimatePresence>
        </Button>

        {outOfStock && isLoggedIn && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-white px-2 py-1 rounded-lg shadow-sm">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ─── DETAILS SECTION ─── */}
      <div className="p-3 flex flex-col flex-1 gap-1">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">
            {product.category?.name || "Ayurveda"}
          </span>
          <Link href={`/shop/${product.id}`}>
            <h3 className="text-[12px] font-bold text-slate-800 line-clamp-1 leading-tight">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing Area with Blurred Login Guard */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          {isLoggedIn ? (
            // 🟢 Logged-in State: Show Actual Prices
            <>
              <span className="text-sm font-[1000] text-slate-900 italic tracking-tighter">
                ₹{netPrice.toLocaleString()}
              </span>
              {product.discount > 0 && (
                <span className="text-[9px] font-bold text-slate-300 line-through">
                  ₹{product.price}
                </span>
              )}
            </>
          ) : (
            // 🔴 Guest State: Blur Price & Show Lock Link
            <Link href="/sign-in" className="flex items-center gap-1 group/blur">
              <span className="text-xs font-black text-slate-400 blur-[4px] select-none">
                ₹9,999
              </span>
              <span className="text-[8px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-0.5">
                <Lock size={9} /> Login
              </span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}