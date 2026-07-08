"use client";

import React, { use, useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import {
  ShoppingCart, Leaf, ChevronLeft, ShieldCheck, Truck,
  Minus, Plus, Zap, Loader2, Heart, Share2, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getProductById } from "@/lib/actions/product";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        const data = await getProductById(resolvedParams.id);
        if (!data) return notFound();
        setProduct(data);
      } catch (error) {
        toast.error("Failed to load formulation");
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [resolvedParams.id]);

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfdfc]">
      <div className="relative">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
        <div className="absolute inset-0 blur-xl bg-emerald-400/20 animate-pulse rounded-full" />
      </div>
      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-emerald-800 animate-bounce">
        Amaze Ayurveda
      </p>
    </div>
  );

  const associatePrice = product.price - (product.price * (product.discount / 100));
  const totalBV = product.bvAmount * quantity;
  const stockLeft = product.stock ?? 0;

  const handleAddToCart = () => {
    cart.addItem(product, quantity);
    toast.success("Added to Business Cart", {
      description: `${product.name} (Qty: ${quantity}) - ${totalBV} BV Earned.`,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Amaze Ayurveda. Earn ${product.bvAmount} BV on this purchase!`,
      url: window.location.href, // Current page link
    };

    try {
      // Check if native sharing is available
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Shared successfully");
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!", {
          description: "You can now paste and share it anywhere."
        });
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32 md:pb-10">
      {/* --- MOBILE TOP HEADER --- */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-4 h-14 flex items-center justify-between lg:hidden">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 truncate max-w-[200px]">
          {product.name}
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors active:scale-90"
            title="Share Product"
          >
            <Share2 size={18} className="transition-transform group-active:rotate-12" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full"><Heart size={18} /></Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto lg:px-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-12">

          {/* --- LEFT: IMAGE GALLERY (MYNTRA STYLE) --- */}
          <div className="w-full lg:w-[55%] relative">
            <div className="aspect-[1/1] sm:aspect-[4/3] lg:rounded-[3rem] bg-[#f8fafc] overflow-hidden group relative">
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={product.image}
                className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700"
              />
              {product.discount > 0 && (
                <div className="absolute bottom-6 left-6 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-xl">
                  {product.discount}% Exclusive Discount
                </div>
              )}
            </div>
            {/* Trust Icons row on mobile */}
            <div className="flex justify-center gap-6 py-6 lg:hidden">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Leaf size={18} /></div>
                <span className="text-[8px] font-black uppercase text-slate-400">Pure</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><ShieldCheck size={18} /></div>
                <span className="text-[8px] font-black uppercase text-slate-400">Tested</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Truck size={18} /></div>
                <span className="text-[8px] font-black uppercase text-slate-400">Express</span>
              </div>
            </div>
          </div>

          {/* --- RIGHT: PRODUCT INFO --- */}
          <div className="flex-1 px-5 lg:px-0 space-y-6 lg:space-y-8">
            {/* <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-emerald-200 text-emerald-700 rounded-md bg-emerald-50/30 px-2 py-0.5">
                  {product.category?.name || "Premium Formulation"}
                </Badge>
              </div>
              <h1 className="text-3xl lg:text-5xl font-black italic tracking-tighter text-slate-900 leading-tight uppercase">
                {product.name}
              </h1>
              <p className="text-slate-500 text-sm lg:text-lg leading-relaxed font-medium">
                {product.description}
              </p>
            </div> */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-emerald-200 text-emerald-700 rounded-md bg-emerald-50/30 px-2 py-0.5">
                  {product.category?.name || "Premium Formulation"}
                </Badge>
              </div>

              <h1 className="text-xl lg:text-5xl font-bold  tracking-tighter text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* ── RICH TEXT RENDERER ── */}
              <div
                className={cn(
                  "text-slate-500 text-sm lg:text-lg leading-relaxed font-medium",
                  "prose prose-slate max-w-none", // Tailwind Typography (Optional but recommended)
                  "[&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5", // Manual styling for lists
                  "[&_strong]:font-black [&_strong]:text-slate-900", // Bold styling
                  "[&_p]:mb-4" // Paragraph spacing
                )}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* --- PRICING BENTO CARD --- */}
            <div className="bg-slate-50 rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600">Associate Price</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl lg:text-6xl font-bold  tracking-tighter">₹{associatePrice}</span>
                    <span className="text-lg text-slate-400 line-through font-bold">₹{product.price}</span>
                  </div>
                </div>
                <div className="h-14 w-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                  <Zap size={24} fill="white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-100">
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Earning BV</p>
                  <p className="text-xl font-black italic text-emerald-700">+{totalBV} Points</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100">
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Availability</p>
                  <p className={cn("text-sm font-black italic", stockLeft > 0 ? "text-slate-900" : "text-red-500")}>
                    {stockLeft > 0 ? `${stockLeft} Units Left` : "Out of Stock"}
                  </p>
                </div>
              </div>
            </div>

            {/* --- DESKTOP PURCHASE PANEL --- */}
            <div className="hidden lg:flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl w-fit">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10 rounded-xl bg-white shadow-sm"><Minus size={14} /></Button>
                <span className="w-10 text-center font-black">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)} className="h-10 w-10 rounded-xl bg-white shadow-sm"><Plus size={14} /></Button>
              </div>
              <Button onClick={handleAddToCart} className="h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs gap-3">
                <ShoppingCart size={20} /> Add to Business Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE STICKY BOTTOM BAR (MYNTRA VIBE) --- */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 p-4 lg:hidden animate-in slide-in-from-bottom duration-500">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-9 w-9 rounded-lg"><Minus size={12} /></Button>
            <span className="w-8 text-center font-black text-sm">{quantity}</span>
            <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)} className="h-9 w-9 rounded-lg"><Plus size={12} /></Button>
          </div>
          <Button
            disabled={stockLeft === 0}
            onClick={handleAddToCart}
            className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/20 gap-2"
          >
            <ShoppingCart size={16} />
            {stockLeft === 0 ? "Sold Out" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}