"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Plus, Minus, Zap, Percent, Info, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";

interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  bvAmount: number;
  image: string;
  stock: number;
  category: { name: string };
}

/* ── Tiny botanical leaf ── */
const MiniLeaf = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.2" />
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="2" opacity="0.35" />
  </svg>
);

export default function ProductCard({ product }: { product: ProductProps }) {
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();

  const handleAddToCart = () => cart.addItem(product, quantity);

  const associatePrice = product.price - product.price * (product.discount / 100);
  const totalBV        = product.bvAmount * quantity;
  const outOfStock     = product.stock === 0;
  const lowStock       = product.stock > 0 && product.stock < 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group relative w-full max-w-[340px] flex flex-col"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Card shell ── */}
      <div className="relative bg-white rounded-[2.5rem] overflow-hidden border border-[#1c3320]/6 shadow-[0_8px_40px_rgba(28,50,32,0.08)] hover:shadow-[0_16px_56px_rgba(28,50,32,0.13)] transition-shadow duration-300">

        {/* ── Image zone ── */}
        <div className="relative aspect-[4/3] w-full bg-[#f5f0e8] overflow-hidden">

          {/* Parchment leaf watermark */}
          <MiniLeaf className="absolute bottom-3 right-4 w-14 text-[#1c3320] opacity-[0.07] rotate-6 pointer-events-none" />

          <Link href={`/shop/${product.id}`}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Link>

          {/* Badges — top left */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
            {product.discount > 0 && (
              <div className="inline-flex items-center gap-1.5 bg-[#1c3320] px-2.5 py-1 rounded-lg">
                <Percent size={10} className="text-[#e8a020]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white">
                  {product.discount}% OFF
                </span>
              </div>
            )}
            <div className="inline-flex items-center gap-1.5 bg-[#e8a020] px-2.5 py-1 rounded-lg shadow-[0_4px_12px_rgba(232,160,32,0.35)]">
              <Zap size={10} className="text-[#1c3320] fill-[#1c3320]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1c3320]">
                {product.bvAmount} BV
              </span>
            </div>
          </div>

          {/* Low stock pill — top right */}
          {lowStock && (
            <div className="absolute top-4 right-4 z-10 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
              <span className="text-[9px] font-bold text-red-500 uppercase tracking-wide">
                {product.stock} left
              </span>
            </div>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#1c3320]/40">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* ── Info zone ── */}
        <div className="p-5 space-y-4">

          {/* Category + name */}
          <div>
            <div className="inline-flex items-center gap-1.5 mb-1.5">
              <Leaf className="w-2.5 h-2.5 text-[#e8a020] fill-[#e8a020]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#1c3320]/40">
                {product.category.name}
              </span>
            </div>
            <Link href={`/shop/${product.id}`}>
              <h3
                className="text-base font-black text-[#1c3320] leading-snug line-clamp-1 hover:text-[#1c6634] transition-colors"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {product.name}
              </h3>
            </Link>
            <p className="text-[#1c3320]/40 text-xs line-clamp-2 mt-1 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Thin divider */}
          <div className="h-px bg-[#1c3320]/6" />

          {/* Pricing */}
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] font-medium text-[#1c3320]/30 line-through block">
                MRP ₹{product.price.toLocaleString()}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xl font-black text-[#1c3320] tracking-tight">
                  ₹{associatePrice.toLocaleString()}
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={13} className="text-[#1c3320]/20 hover:text-[#e8a020] transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c3320] text-white rounded-xl border-none px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest">
                        Partner Benefit Price
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* BV Points */}
            <div className="text-right bg-[#1c3320]/4 border border-[#1c3320]/6 rounded-xl px-3 py-2">
              <p className="text-[8px] font-bold uppercase tracking-widest text-[#1c3320]/35 mb-0.5">
                Points
              </p>
              <p className="text-sm font-black text-[#e8a020] tracking-tight">
                +{totalBV} BV
              </p>
            </div>
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-2.5 pt-1">

            {/* Stepper */}
            <div className="flex items-center bg-[#f5f0e8] border border-[#1c3320]/8 rounded-xl px-1 py-1 gap-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={outOfStock}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-[#1c3320]/50 hover:bg-white hover:text-[#1c3320] disabled:opacity-30 transition-all"
              >
                <Minus size={13} />
              </button>
              <span className="w-8 text-center text-sm font-black text-[#1c3320]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={outOfStock}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-[#1c3320]/50 hover:bg-white hover:text-[#1c3320] disabled:opacity-30 transition-all"
              >
                <Plus size={13} />
              </button>
            </div>

            {/* Add to cart */}
            <button
              disabled={outOfStock}
              onClick={handleAddToCart}
              className="flex-1 h-10 rounded-xl bg-[#1c3320] hover:bg-[#1c6634] disabled:bg-[#1c3320]/15 text-white font-bold text-[10px] uppercase tracking-[0.18em] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(28,50,32,0.2)] hover:shadow-[0_6px_22px_rgba(28,50,32,0.3)] active:scale-[0.97] transition-all duration-200"
            >
              <ShoppingCart size={14} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}