"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ProductCard from "@/components/ecommerce/ProductCard";

export function ProductCarousel({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50/50 border-t border-slate-100 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <Sparkles className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Amaze Recommendations</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 italic uppercase tracking-tighter">
              Other <span className="text-emerald-500">Top Picks</span>
            </h2>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="icon" onClick={() => scroll("left")} className="h-12 w-12 rounded-2xl bg-white">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")} className="h-12 w-12 rounded-2xl bg-white">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8 scroll-smooth">
          {products.map((product, idx) => (
            <div key={product.id} className="min-w-[280px] md:min-w-[340px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}