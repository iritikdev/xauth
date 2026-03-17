"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Star, ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart"; // Aapka cart hook
import { toast } from "sonner";
import ProductCard from "./ProductCard";

export const FeaturedProducts = ({ initialProducts }: { initialProducts: any[] }) => {
  const cart = useCart();
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, []);

  const onAddToCart = (product: any) => {
    cart.addItem(product, 4);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em]">
              <Leaf size={14} className="animate-bounce" /> Swadeshi Best Sellers
            </div>
            <h2 className="text-5xl md:text-6xl font-[1000] text-slate-900 tracking-tighter leading-none">
              Amaze <span className="text-emerald-600 italic">Signature</span>
            </h2>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="group rounded-2xl border-slate-200 font-black uppercase text-[10px] tracking-widest h-14 px-8 hover:bg-slate-900 hover:text-white transition-all">
              Explore Store <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Framer Motion Draggable Slider */}
        <motion.div ref={carousel} className="cursor-grab active:cursor-grabbing">
          <motion.div 
            drag="x" 
            dragConstraints={{ right: 0, left: -width }}
            className="flex gap-8"
          >
            {initialProducts.map((product) => (
              <motion.div 
                key={product.id}
                className="min-w-[300px] md:min-w-[350px] group"
              >
                <ProductCard product={product}/>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Slider Navigation Hint */}
        <div className="mt-12 flex items-center gap-4 justify-center md:justify-start">
            <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                   className="h-full bg-emerald-500"
                   animate={{ x: [0, 40, 0] }}
                   transition={{ duration: 3, repeat: Infinity }}
                />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Drag to Explore</span>
        </div>
      </div>
    </section>
  );
};