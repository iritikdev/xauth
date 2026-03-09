"use client";

import React, { useRef } from 'react';
import { motion, useScroll } from "framer-motion";
import { products } from "@/lib/constants";
import { ProductCard } from './ecommerce/product-card'; // Use your card component

const LatestReleases = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Track horizontal scroll of the specific container
  const { scrollXProgress } = useScroll({
    container: targetRef, // Use container for internal scroll tracking
  });

  return (
    <section className="py-24 bg-white overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-12 flex justify-between items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-xs">
            <span className="w-8 h-[2px] bg-emerald-600" /> Premium Wellness
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 italic uppercase">
            Latest <span className="text-emerald-600">Releases</span>
          </h2>
        </div>
        
        <div className="hidden md:block text-slate-400 text-[10px] font-black uppercase tracking-widest">
          Swipe to explore →
        </div>
      </div>

      {/* 1. ATTACH THE REF HERE */}
      <div 
        ref={targetRef} 
        className="flex gap-6 overflow-x-auto px-6 pb-12 no-scrollbar snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-[300px] md:min-w-[350px] snap-start">
             <ProductCard {...product} />
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="w-full h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-emerald-600 origin-left"
            style={{ scaleX: scrollXProgress, width: "100%" }}
          />
        </div>
      </div>
    </section>
  );
};

export default LatestReleases;