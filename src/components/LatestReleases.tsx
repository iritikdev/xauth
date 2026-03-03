"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Flame, Zap, Leaf, Star } from "lucide-react";

const products = [
  {
    name: "SlimExpert",
    category: "Health & Fitness",
    tag: "Bestseller",
    price: "₹1,499",
    icon: <Flame className="w-6 h-6 text-orange-500" />,
    description: "Smart, sustainable weight management powered by Ayurvedic wisdom.",
    color: "from-orange-500/10 to-transparent",
    image: "https://images.unsplash.com/photo-1611073123044-c576d19171ed?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Josh Vital",
    category: "Vitality",
    tag: "New Launch",
    price: "₹999",
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    description: "Boost stamina and daily energy with timeless Ayurvedic herbs.",
    color: "from-amber-500/10 to-transparent",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Ashwagandha Pure",
    category: "Stress Relief",
    tag: "Organic",
    price: "₹599",
    icon: <Leaf className="w-6 h-6 text-emerald-500" />,
    description: "Pure roots for mental clarity and emotional balance.",
    color: "from-emerald-500/10 to-transparent",
    image: "https://images.unsplash.com/photo-1622067424246-1594f8089408?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Tulsi Drops",
    category: "Immunity",
    tag: "Must Have",
    price: "₹299",
    icon: <Star className="w-6 h-6 text-blue-500" />,
    description: "The 'Queen of Herbs' in its most potent liquid form.",
    color: "from-blue-500/10 to-transparent",
    image: "https://images.unsplash.com/photo-1540439867341-0f41068ca456?auto=format&fit=crop&q=80&w=400"
  }
];

const LatestReleases = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({
    target: targetRef,
  });

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-xs">
            <span className="w-8 h-[2px] bg-emerald-600" /> Premium Wellness
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">
            Latest <span className="text-emerald-600">Releases</span>
          </h2>
        </div>
        
        <div className="hidden md:block text-slate-400 text-sm font-medium">
          Drag or scroll to explore →
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div 
        ref={targetRef}
        className="flex gap-8 overflow-x-auto pb-12 px-6 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
      >
        {products.map((product, idx) => (
          <motion.div
            key={idx}
            className="flex-none w-[320px] md:w-[400px] snap-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="group relative overflow-hidden border-none shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 rounded-[2.5rem] bg-white">
              {/* Background Accent */}
              <div className={`absolute inset-0 bg-gradient-to-b ${product.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-none shadow-sm font-bold uppercase text-[10px] tracking-widest px-3 py-1">
                      {product.tag}
                    </Badge>
                  </div>
                </div>

                <div className="p-8 space-y-4 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-emerald-600 text-xs font-black uppercase tracking-widest mb-1">
                        {product.category}
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900">{product.name}</h3>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                      {product.icon}
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-900">{product.price}</span>
                    <Button className="rounded-xl bg-slate-900 hover:bg-emerald-600 group/btn">
                      <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="w-full h-1 bg-slate-100 rounded-full relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-emerald-600"
            style={{ width: "25%", scaleX: scrollXProgress }}
          />
        </div>
      </div>
    </section>
  );
};

export default LatestReleases;