"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import ProductCard from "./ProductCard";

/* ── Botanical leaf SVG ── */
const LeafDecor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 170 C60 170 10 120 10 70 C10 30 35 5 60 5 C85 5 110 30 110 70 C110 120 60 170 60 170Z" fill="currentColor" opacity="0.15" />
    <path d="M60 170 L60 5" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <path d="M60 60 C40 50 25 55 15 70" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <path d="M60 90 C80 78 95 82 105 95" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <path d="M60 120 C42 110 30 115 22 128" stroke="currentColor" strokeWidth="1" opacity="0.15" />
  </svg>
);

export const FeaturedProducts = ({ initialProducts }: { initialProducts: any[] }) => {
  const cart    = useCart();
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, [initialProducts]);

  const onAddToCart = (product: any) => {
    cart.addItem(product, 4);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section
      className="relative py-28 bg-[#f5f0e8] overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >

      {/* ── Background decor ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#e8a020]/6 blur-[100px]" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-[#1c3320]/5 blur-[90px]" />
        <LeafDecor className="absolute top-8  right-10 w-28 text-[#1c3320] opacity-[0.05]" />
        <LeafDecor className="absolute bottom-10 left-6 w-20 text-[#c8860a] opacity-[0.06] rotate-[18deg]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-10">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6"
        >
          <div className="space-y-4">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 bg-[#1c3320]/6 border border-[#1c3320]/10 px-4 py-2 rounded-full">
              <Leaf className="w-3.5 h-3.5 text-[#e8a020] fill-[#e8a020]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#1c3320]/55">
                Swadeshi Best Sellers
              </span>
            </div>

            {/* Heading */}
            <h2
              className="text-5xl md:text-6xl font-black text-[#1c3320] tracking-tight leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Amaze{" "}
              <span className="text-[#e8a020] italic">Signature</span>
            </h2>

            {/* Underline rule */}
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-[#e8a020]" />
              <div className="h-px w-4  bg-[#e8a020]/30" />
            </div>
          </div>

          {/* CTA link */}
          <Link href="/shop">
            <button className="group inline-flex items-center gap-2.5 h-12 px-7 rounded-xl border-2 border-[#1c3320]/12 bg-transparent hover:bg-[#1c3320] text-[#1c3320]/60 hover:text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-200">
              Explore Store
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>
        </motion.div>

        {/* ── Draggable slider ── */}
        <motion.div
          ref={carousel}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="cursor-grab active:cursor-grabbing select-none"
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
            className="flex gap-6"
          >
            {initialProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.05 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="min-w-[300px] md:min-w-[340px]"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Drag hint ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex items-center gap-4"
        >
          {/* Animated progress bar */}
          <div className="h-[3px] w-24 bg-[#1c3320]/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full w-10 bg-[#e8a020] rounded-full"
              animate={{ x: [0, 56, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-px w-5 bg-[#1c3320]/15" />
            <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#1c3320]/30">
              Drag to Explore
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};