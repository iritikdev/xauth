"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Leaf, Zap, Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import ProductCard from "@/components/ecommerce/ProductCard";
import { getAllProducts } from "@/lib/actions/product"; // Action import karein
import { toast } from "sonner";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

const CATEGORIES = ["All", "Health Care", "Personal Care", "Agriculture", "Home Care", "Food"];

export default function ProductListPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch products on load
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  // 2. Client-side filtering logic
  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category?.name === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-[#0f172a] pt-20 pb-32 px-6 relative overflow-hidden">
        <div className="container mx-auto relative z-10 text-center space-y-4">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">
            Swadeshi Marketplace
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">
            Amaze <span className="text-emerald-500">Ayurveda</span> Shop
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm font-medium">
            High-quality Ayurvedic formulations designed for wellness and financial growth. 
            Earn BV points on every purchase.
          </p>
        </div>
        <Zap className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
      </div>

      {/* Filter & Search Bar */}
      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border border-slate-100 flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar w-full lg:w-auto">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "ghost"}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-xl h-12 px-6 font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap",
                  activeCategory === cat ? "bg-emerald-600 hover:bg-emerald-700" : "text-slate-500 hover:bg-slate-100"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>

          <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-200 hidden lg:flex">
            <SlidersHorizontal className="w-5 h-5 text-slate-500" />
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-6 mt-16">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
              {isLoading ? "Fetching Products..." : `Showing ${filteredProducts.length} Products`}
            </h3>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory is loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  
                    <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Leaf className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No products found in this category</p>
          </div>
        )}
      </div>
      <CartDrawer open={false} setOpen={() => {}} />
    </div>
    </>
  );
}