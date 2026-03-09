"use client";

import React, { use, useState, useMemo } from "react";
import { notFound, useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  Star, 
  Zap, 
  ChevronLeft, 
  ShieldCheck, 
  Truck, 
  RefreshCcw,
  Minus,
  Plus,
  Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { products } from "@/lib/constants";
import { ProductCarousel } from "@/components/ecommerce/product-carousel";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  // 1. Find Product
  const product = useMemo(() => 
    products.find((p) => p.id === resolvedParams.id), 
    [resolvedParams.id]
  );

  if (!product) return notFound();

  // 2. Calculate Discount Logic
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const savingsAmount = (product.mrp - product.price) * quantity;
  const totalBV = product.bvAmount * quantity;

  const handleAddToCart = () => {
    toast.success("Added to Business Cart", {
      description: `${product.name} (Qty: ${quantity}) added. You earn ${totalBV} BV.`,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Navigation Row */}
        <div className="flex items-center justify-between mb-12">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-slate-500 hover:text-emerald-600 font-black uppercase tracking-widest text-[10px] gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Shop
          </Button>
          <Badge variant="outline" className="border-slate-200 text-slate-400 font-bold px-4 py-1 rounded-full">
            Product ID: #00{product.id}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Product Image Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <div className="aspect-square rounded-[3.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center p-12 overflow-hidden relative">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain relative z-10" 
              />
              
              {/* Discount Float Badge */}
              <div className="absolute top-10 right-10 z-20 bg-red-500 text-white font-black px-5 py-2 rounded-2xl shadow-xl shadow-red-500/20 rotate-12 animate-pulse">
                {discountPercent}% OFF
              </div>

              {/* Decorative Circle */}
              <div className="absolute inset-20 bg-emerald-500/5 rounded-full blur-3xl" />
            </div>
          </motion.div>

          {/* Right: Product Details Section */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black px-4 py-1.5 uppercase tracking-widest text-[10px]">
                  <Leaf className="w-3 h-3 mr-2" /> 100% Ayurvedic
                </Badge>
                <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-black text-slate-900">{product.rating}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
                {product.name}
              </h1>
              <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-lg">
                {product.description}
              </p>
            </div>

            {/* Pricing & Business Value Matrix */}
            <Card className="border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[3rem] bg-[#0f172a] text-white overflow-hidden relative">
              <CardContent className="p-10 space-y-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-3">Partner Price</p>
                    <div className="flex items-baseline gap-4">
                      <span className="text-6xl font-black italic tracking-tighter">₹{product.price}</span>
                      <div className="flex flex-col">
                        <span className="text-xl text-slate-500 line-through font-bold">₹{product.mrp}</span>
                        <span className="text-[10px] text-red-400 font-black uppercase tracking-widest">Save ₹{savingsAmount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left md:text-right bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-3">Business Volume</p>
                    <div className="flex flex-col md:items-end">
                      <span className="text-4xl font-black text-white">{totalBV} BV</span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">Points for Commission</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <Zap className="absolute -bottom-10 -left-10 w-48 h-48 text-white/5 rotate-12" />
            </Card>

            {/* Quantity Selector & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-12 w-12 rounded-xl text-slate-500 hover:bg-white"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-14 text-center font-black text-xl text-slate-900">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-12 w-12 rounded-xl text-slate-500 hover:bg-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button 
                onClick={handleAddToCart}
                className="flex-1 h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-xs gap-4 shadow-xl shadow-emerald-600/20 transition-all active:scale-95 group"
              >
                <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" /> 
                Add to Business Cart
              </Button>
            </div>

            {/* Trust Logistics */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Truck className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Shipping</span>
                  <span className="text-xs font-black text-slate-900">Pan India Delivery</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <RefreshCcw className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Return</span>
                  <span className="text-xs font-black text-slate-900">7 Days Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductCarousel currentProductId={product.id} />
    </div>
  );
}