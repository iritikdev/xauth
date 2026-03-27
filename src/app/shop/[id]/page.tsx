"use client";

import React, { use, useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import {
  ShoppingCart, Leaf, ChevronLeft, ShieldCheck, Truck,
  Minus, Plus, Zap, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getProductById } from "@/lib/actions/product";
import { useCart } from "@/hooks/use-cart";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [addedFlash, setAddedFlash] = useState(false);
  const cart = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        const data = await getProductById(resolvedParams.id);
        if (!data) return notFound();
        setProduct(data);
      } catch (error) {
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [resolvedParams.id]);

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Fetching Formulation...
        </p>
      </div>
    );

  if (!product) return notFound();

  // Pricing & BV
  const associatePrice =
    product.price - (product.price * (product.discount / 100));
  const savingsAmount = (product.price - associatePrice) * quantity;
  const totalBV = product.bvAmount * quantity;

  const handleAddToCart = () => {
    cart.addItem(product, quantity);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1400);
    toast.success("Added to Business Cart", {
      description: `${product.name} (Qty: ${quantity}) added. You earn ${totalBV} BV.`,
    });
  };

  const stockLeft = product.stock ?? 0;
  const qtyMax = Math.max(1, stockLeft);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-12">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-slate-500 hover:text-emerald-600 font-black uppercase tracking-widest text-[10px] gap-2 px-0"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Shop
          </Button>

          <Badge
            variant="outline"
            className="border-slate-200 text-slate-400 font-bold px-4 py-1 rounded-full w-fit"
          >
            Category: {product.category?.name || "General"}
          </Badge>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Image */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="rounded-[2.5rem] border border-slate-100 bg-gradient-to-b from-slate-50/60 to-white overflow-hidden p-4 sm:p-6"
            >
              <div className="relative aspect-[4/3] rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain relative z-10 p-6"
                />

                {product.discount > 0 && (
                  <div className="absolute top-5 right-5 z-20 bg-red-500 text-white font-black px-4 py-2 rounded-2xl shadow-xl shadow-red-500/20 rotate-12">
                    {product.discount}% OFF
                  </div>
                )}

                {/* ambient glow */}
                <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
              </div>

              {/* small highlight row */}
              <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                <Badge className="bg-emerald-500/10 text-emerald-700 border-none font-black px-4 py-2 rounded-full text-[10px] uppercase tracking-widest">
                  <Leaf className="w-3 h-3 mr-2 inline" /> 100% Ayurvedic
                </Badge>
                <Badge className="bg-slate-100 text-slate-700 border-none font-bold px-4 py-2 rounded-full text-[10px]">
                  Stock: {stockLeft} units
                </Badge>
              </div>
            </motion.div>
          </div>

          {/* Right: Details + Sticky Purchase */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            {/* Title / description */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 italic tracking-tighter leading-[1.05] uppercase">
                {product.name}
              </h1>
              <p className="text-slate-500 font-medium text-[15px] sm:text-lg leading-relaxed max-w-xl">
                {product.description}
              </p>
            </div>

            {/* Pricing card (clean + readable) */}
            <Card className="rounded-[2.2rem] border-slate-100 shadow-sm">
              <CardContent className="p-5 sm:p-7 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-3">
                      Partner Price
                    </p>

                    <div className="flex items-baseline gap-4 flex-wrap">
                      <span className="text-4xl sm:text-5xl font-black italic tracking-tighter text-slate-900">
                        ₹{associatePrice}
                      </span>

                      <div className="flex flex-col">
                        <span className="text-sm text-slate-400 line-through font-bold">
                          ₹{product.price}
                        </span>

                        {product.discount > 0 ? (
                          <span className="text-[11px] text-red-600 font-black uppercase tracking-widest">
                            Save ₹{savingsAmount} <span className="font-bold">(for Qty {quantity})</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest">
                            Best Value Partner Offer
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* light icon */}
                  <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-[1.5rem] bg-slate-50 border border-slate-100 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-2">
                      Business Volume
                    </p>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <div className="text-3xl font-black text-slate-900">{totalBV} BV</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">
                          Points for Commission
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-white border border-slate-100 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-2">
                      Availability
                    </p>
                    <div className="text-sm font-bold text-slate-900">
                      {stockLeft === 0 ? (
                        <span className="text-red-600">Out of stock</span>
                      ) : stockLeft <= 5 ? (
                        <span className="text-amber-600">Low stock</span>
                      ) : (
                        <span className="text-emerald-700">In stock</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {stockLeft === 0
                        ? "Contact support for restock updates."
                        : `Max you can add: ${qtyMax}`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sticky purchase panel (main conversion) */}
            <div className="lg:sticky lg:top-6">
              <Card className="rounded-[2.2rem] border-none shadow-2xl">
                <CardContent className="p-5 sm:p-7 bg-[#0f172a] text-white rounded-[2.2rem] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.25),transparent_55%)] pointer-events-none" />

                  <div className="relative z-10 space-y-5">
                    {/* Quantity */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-300 mb-2">
                          Quantity
                        </p>

                        <div className="flex items-center bg-white/5 rounded-2xl p-1.5 border border-white/10">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="h-12 w-12 rounded-xl text-white/90 hover:text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>

                          <span className="w-14 text-center font-black text-xl text-white">{quantity}</span>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setQuantity((q) => Math.min(qtyMax, q + 1))}
                            className="h-12 w-12 rounded-xl text-white/90 hover:text-white"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Mini BV pill */}
                      <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                          Total BV
                        </span>
                        <span className="text-3xl font-black text-white">{totalBV}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      onClick={handleAddToCart}
                      disabled={stockLeft === 0}
                      className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.18em] text-xs shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all gap-4"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      {stockLeft === 0 ? "Out of Stock" : "Add to Business Cart"}
                    </Button>

                    {/* helper note */}
                    <div className="flex items-start gap-3 text-xs text-slate-300">
                      <div className="mt-0.5 w-2 h-2 rounded-full bg-emerald-400" />
                      <p className="leading-relaxed">
                        Partner pricing updates automatically with quantity. You earn BV based on {product.bvAmount} BV per unit.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-black text-slate-900">Pan India Delivery</span>
              </div>
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-black text-slate-900">100% Secure Payouts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}