"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Zap, Percent, Check, Plus, Lock } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils";

interface ProductProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount: number;
  bvAmount: number;
  image: string;
  stock: number;
  category?: { name: string };
  categoryName?: string;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const [addedFlash, setAddedFlash] = useState(false);
  const cart = useCart();

  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const catName = product.category?.name ?? product.categoryName ?? "Wellness";
  const netPrice = product.price - product.price * (product.discount / 100);
  const outOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents navigating to product details page
    if (outOfStock) return;

    cart.addItem(product, 1);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative w-52 h-auto flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-300"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ══════════════ IMAGE ZONE ══════════════ */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-white">
        <Link href={`/shop/${product.id}`} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 40vw, 25vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        </Link>

        {/* Floating Badges (Top Left) */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
          {product.discount > 0 && (
            <div className="inline-flex items-center gap-0.5 bg-zinc-950/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
              <Percent size={8} className="text-emerald-400" />
              <span className="text-[8px] font-black uppercase text-white tracking-wider">
                {product.discount}%
              </span>
            </div>
          )}
          <div className="inline-flex items-center gap-0.5 bg-emerald-500/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md shadow-sm">
            <Zap size={8} className="text-white fill-white" />
            <span className="text-[8px] font-black uppercase text-white tracking-wider">
              {product.bvAmount} BV
            </span>
          </div>
        </div>

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ══════════════ INFO ZONE ══════════════ */}
      <div className="p-2.5 flex flex-col justify-between flex-1 gap-2">
        {/* Title + Category */}
        <div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-600 block truncate">
            {catName}
          </span>

          <Link href={`/shop/${product.id}`}>
            <h3 className="text-xs font-black text-zinc-900 line-clamp-1 leading-snug hover:text-emerald-700 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-end justify-between gap-1 pt-1 border-t border-zinc-50">
          
          {/* ✅ PRICE DISPLAY / BLUR ZONE */}
          <div className="relative">
            {isLoggedIn ? (
              // 🟢 LOGGED IN: Display Actual Price
              <>
                {product.discount > 0 && (
                  <span className="text-[9px] font-medium text-zinc-400 line-through block leading-none">
                    ₹{product.price}
                  </span>
                )}
                <span className="text-sm font-black text-zinc-900 tracking-tight leading-tight block">
                  ₹{netPrice.toLocaleString()}
                </span>
              </>
            ) : (
              // 🔴 NOT LOGGED IN: Blurred Price with Lock
              <Link href="/login" className="block group/blur cursor-pointer">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-zinc-400 blur-[4px] select-none">
                    ₹9,999
                  </span>
                  <Lock size={10} className="text-emerald-600 shrink-0" />
                </div>
                <span className="text-[7px] font-bold uppercase text-emerald-600 tracking-wider block">
                  Login to view
                </span>
              </Link>
            )}
          </div>

          {/* Quick Add Button */}
          {isLoggedIn && (
            <button
              disabled={outOfStock}
              onClick={handleAddToCart}
              className={cn(
                "h-7 px-2.5 rounded-lg font-bold text-[9px] uppercase tracking-wider",
              "flex items-center justify-center gap-1 shrink-0",
              "transition-all duration-200 active:scale-95",
              addedFlash
                ? "bg-emerald-500 text-white"
                : outOfStock
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  : "bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
            )}
          >
            <AnimatePresence mode="wait">
              {addedFlash ? (
                <motion.span 
                  key="check" 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="flex items-center gap-0.5"
                >
                  <Check size={10} strokeWidth={3} />
                </motion.span>
              ) : (
                <motion.span 
                  key="cart" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex items-center gap-1"
                >
                  <ShoppingCart size={10} strokeWidth={2.5} />
                  <span>{isLoggedIn ? "Add" : "Login"}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )}
        </div>
        
        {/* Pricing & Add Button Row */}
       
      </div>
    </motion.div>
  );
}