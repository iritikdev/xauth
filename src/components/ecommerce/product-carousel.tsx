"use client";

import React, { useRef } from "react";
import { products } from "@/lib/constants";
import { ProductCard } from "./product-card";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ProductCarousel({ currentProductId }: { currentProductId: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter out the current product so it doesn't recommend itself
  const recommendations = products.filter((p) => p.id !== currentProductId).slice(0, 6);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-slate-50/50 border-t border-slate-100 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <Sparkles className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Personalized For You</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 italic uppercase tracking-tighter">
              Other <span className="text-emerald-500">Top Picks</span>
            </h2>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => scroll("left")}
              className="h-12 w-12 rounded-2xl border-slate-200 bg-white shadow-sm hover:text-emerald-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => scroll("right")}
              className="h-12 w-12 rounded-2xl border-slate-200 bg-white shadow-sm hover:text-emerald-600"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8"
        >
          {recommendations.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[280px] md:min-w-[320px] snap-start"
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}