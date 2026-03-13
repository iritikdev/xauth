"use client";

import React, { use, useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { 
  ShoppingCart, Star, Zap, ChevronLeft, ShieldCheck, 
  Truck, RefreshCcw, Minus, Plus, Leaf, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
// Import your server actions
import { getProductById } from "@/lib/actions/product"; 
import { ProductCarousel } from "@/components/ecommerce/product-carousel";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // 1. Fetch Product from DB
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

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fetching Formulation...</p>
    </div>
  );

  if (!product) return notFound();

  // 2. Logic Calculations
  // MRP ko aapne price bola tha, aur associate price discounted hai
  const associatePrice = product.price - (product.price * (product.discount / 100));
  const savingsAmount = (product.price - associatePrice) * quantity;
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
            Category: {product.category?.name || 'General'}
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
              
              {product.discount > 0 && (
                <div className="absolute top-10 right-10 z-20 bg-red-500 text-white font-black px-5 py-2 rounded-2xl shadow-xl shadow-red-500/20 rotate-12">
                  {product.discount}% OFF
                </div>
              )}
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
                <Badge className="bg-slate-100 text-slate-600 border-none font-bold px-3 py-1 text-[10px]">
                  Stock: {product.stock} units
                </Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
                {product.name}
              </h1>
              <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-lg">
                {product.description}
              </p>
            </div>

            {/* Pricing & BV Matrix */}
            <Card className="border-none shadow-2xl rounded-[3rem] bg-[#0f172a] text-white overflow-hidden relative">
              <CardContent className="p-10 space-y-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-3">Partner Price</p>
                    <div className="flex items-baseline gap-4">
                      <span className="text-6xl font-black italic tracking-tighter">₹{associatePrice}</span>
                      <div className="flex flex-col">
                        <span className="text-xl text-slate-500 line-through font-bold">₹{product.price}</span>
                        {product.discount > 0 && (
                           <span className="text-[10px] text-red-400 font-black uppercase tracking-widest">Save ₹{savingsAmount}</span>
                        )}
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

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-12 w-12 rounded-xl"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-14 text-center font-black text-xl text-slate-900">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="h-12 w-12 rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-xs gap-4 shadow-xl shadow-emerald-600/20 active:scale-95 transition-all"
              >
                <ShoppingCart className="w-6 h-6" /> 
                {product.stock === 0 ? "Out of Stock" : "Add to Business Cart"}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem]">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-black text-slate-900">Pan India Delivery</span>
              </div>
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem]">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-black text-slate-900">100% Secure Payouts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <ProductCarousel currentProductId={product.id} /> */}
    </div>
  );
}