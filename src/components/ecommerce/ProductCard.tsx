"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingCart, Plus, Minus, Zap,
  Percent, Info, Leaf, Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip, TooltipContent,
  TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ─── accept both shapes ──────────────────────────────────────── */
interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  bvAmount: number;
  image: string;
  stock: number;
  // either shape works
  category?: { name: string };
  categoryName?: string;
}

/* ─── tiny leaf watermark ─────────────────────────────────────── */
const MiniLeaf = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none">
    <path
      d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z"
      fill="currentColor" opacity="0.18"
    />
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="2" opacity="0.3" />
  </svg>
);

/* ─── component ───────────────────────────────────────────────── */
export default function ProductCard({ product }: { product: ProductProps }) {
  const [quantity, setQuantity] = useState(1);
  const [addedFlash, setAddedFlash] = useState(false);
  const cart = useCart();

  const catName = product.category?.name ?? product.categoryName ?? "Wellness";
  const netPrice = product.price - product.price * (product.discount / 100);
  const totalBV  = product.bvAmount * quantity;
  const outOfStock = product.stock === 0;
  const lowStock   = product.stock > 0 && product.stock < 10;

  const handleAddToCart = () => {
    cart.addItem(product, quantity);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative w-full flex flex-col"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="relative bg-white rounded-[2rem] overflow-hidden border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-300">

        {/* ══════════════ IMAGE ZONE ══════════════ */}
        <div className="relative aspect-[4/3] w-full bg-zinc-50 overflow-hidden">

          {/* leaf watermark */}
          <MiniLeaf className="absolute bottom-3 right-4 w-12 text-emerald-900 opacity-[0.06] rotate-6 pointer-events-none" />

          <Link href={`/shop/${product.id}`}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Link>

          {/* view overlay on hover */}
          <Link
            href={`/shop/${product.id}`}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-zinc-950/10 backdrop-blur-[2px] z-10"
          >
            <div className="flex items-center gap-1.5 bg-white/90 rounded-2xl px-4 py-2 shadow-lg">
              <Eye size={13} className="text-zinc-700" strokeWidth={2} />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">
                View
              </span>
            </div>
          </Link>

          {/* badges — top left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            {product.discount > 0 && (
              <div className="inline-flex items-center gap-1 bg-zinc-950 px-2.5 py-1 rounded-xl">
                <Percent size={9} className="text-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white">
                  {product.discount}% OFF
                </span>
              </div>
            )}
            <div className="inline-flex items-center gap-1 bg-emerald-500 px-2.5 py-1 rounded-xl shadow-sm shadow-emerald-500/30">
              <Zap size={9} className="text-white fill-white" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white">
                {product.bvAmount} BV
              </span>
            </div>
          </div>

          {/* low stock — top right */}
          {lowStock && (
            <div className="absolute top-3 right-3 z-20 bg-red-50 border border-red-100 px-2.5 py-1 rounded-xl">
              <span className="text-[9px] font-black text-red-500 uppercase tracking-wide">
                {product.stock} left
              </span>
            </div>
          )}

          {/* out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[3px] flex items-center justify-center z-20">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* ══════════════ INFO ZONE ══════════════ */}
        <div className="p-5 space-y-4">

          {/* category + name + desc */}
          <div>
            <div className="inline-flex items-center gap-1 mb-1.5">
              <Leaf size={9} className="text-emerald-500" />
              <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                {catName}
              </span>
            </div>

            <Link href={`/shop/${product.id}`}>
              <h3
                className="text-[15px] font-black text-zinc-900 leading-snug line-clamp-1 hover:text-emerald-800 transition-colors"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                {product.name}
              </h3>
            </Link>

            <p className="text-zinc-400 text-[11px] line-clamp-2 mt-1 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* divider */}
          <div className="h-px bg-zinc-100" />

          {/* pricing row */}
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] font-medium text-zinc-400 line-through block">
                MRP ₹{product.price.toLocaleString()}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="text-xl font-black text-zinc-900 tracking-tight"
                  style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                >
                  ₹{netPrice.toLocaleString()}
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={13} className="text-zinc-300 hover:text-emerald-500 transition-colors cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-950 text-white rounded-xl border-none px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest">
                        Partner Benefit Price
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* BV box */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-3 py-2 text-right">
              <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-500/70 mb-0.5">
                Points
              </p>
              <p
                className="text-sm font-black text-emerald-700 tracking-tight"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                +{totalBV} BV
              </p>
            </div>
          </div>

          {/* qty stepper + add to cart */}
          <div className="flex items-center gap-2.5 pt-1">

            {/* stepper */}
            <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-1 py-1 gap-0.5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={outOfStock}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-white hover:text-zinc-900 hover:shadow-sm disabled:opacity-30 transition-all"
              >
                <Minus size={12} strokeWidth={2.5} />
              </button>
              <span
                className="w-7 text-center text-sm font-black text-zinc-900"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={outOfStock}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-white hover:text-zinc-900 hover:shadow-sm disabled:opacity-30 transition-all"
              >
                <Plus size={12} strokeWidth={2.5} />
              </button>
            </div>

            {/* add to cart */}
            <button
              disabled={outOfStock}
              onClick={handleAddToCart}
              className={cn(
                "flex-1 h-10 rounded-xl font-bold text-[10px] uppercase tracking-[0.16em]",
                "flex items-center justify-center gap-1.5",
                "transition-all duration-200 active:scale-[0.97]",
                addedFlash
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                  : outOfStock
                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                    : "bg-zinc-950 hover:bg-zinc-800 text-white shadow-sm shadow-zinc-900/20"
              )}
            >
              {addedFlash ? (
                <>✓ Added</>
              ) : (
                <>
                  <ShoppingCart size={13} strokeWidth={2} />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}