"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Plus, Minus, Zap, Percent, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function ProductCard({ product }: { product: ProductProps }) {
  const [quantity, setQuantity] = useState(1);
  // Inside ProductDetailsPage component
  const cart = useCart();

  const handleAddToCart = () => {
    cart.addItem(product, quantity);
  };

  // Calculate the price after associate discount
  const associatePrice =
    product.price - product.price * (product.discount / 100);
  const totalBV = product.bvAmount * quantity;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative w-full max-w-[340px] bg-white rounded-[2.8rem] p-5 shadow-2xl shadow-slate-200/60 border border-slate-50 transition-all hover:border-emerald-100"
    >
      {/* Top Badges (Discount & BV) */}
      <div className="absolute top-8 left-8 z-10 flex flex-col gap-2">
        {product.discount > 0 && (
          <Badge className="bg-slate-900 text-white border-none rounded-xl px-3 py-1.5 flex gap-1.5 items-center">
            <Percent size={12} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {product.discount}% OFF
            </span>
          </Badge>
        )}
        <Badge className="bg-emerald-600 text-white border-none rounded-xl px-3 py-1.5 flex gap-1.5 items-center shadow-lg shadow-emerald-600/20">
          <Zap size={12} className="fill-white" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {product.bvAmount} BV
          </span>
        </Badge>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square w-full rounded-[2.2rem] overflow-hidden bg-slate-50 mb-6">
         <Link href={`/shop/${product.id}`} >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        </Link>
      </div>

      {/* Product Info */}
      <div className="space-y-4 px-2">
        <div>
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
              {product.category.name}
            </p>
            {product.stock < 10 && (
              <span className="text-[9px] font-bold text-red-500 uppercase italic">
                Only {product.stock} left
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="text-slate-400 text-xs line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 line-through">
              MRP ₹{product.price.toLocaleString()}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                ₹{associatePrice.toLocaleString()}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={14} className="text-slate-300" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 text-white rounded-xl border-none p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                      Partner Benefit Price
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">
              Total Points
            </p>
            <p className="text-sm font-black text-emerald-600 tracking-tight">
              +{totalBV} BV
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center justify-between bg-slate-100/50 rounded-2xl p-1 border border-slate-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-white transition-all"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={product.stock === 0}
            >
              <Minus size={16} className="text-slate-500" />
            </Button>
            <span className="font-black text-slate-900">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-white transition-all"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={product.stock === 0}
            >
              <Plus size={16} className="text-slate-500" />
            </Button>
          </div>

          <Button
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className="h-12 w-12 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white shadow-xl transition-all active:scale-95 disabled:bg-slate-200"
          >
            <ShoppingCart size={20} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
