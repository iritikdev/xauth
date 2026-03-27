"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Leaf, Search, 
  Loader2, ArrowUpDown, 
  ChevronDown, FilterX, 
  LayoutGrid, ListFilter,
  Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/ecommerce/ProductCard";
import { getAllProducts } from "@/lib/actions/product"; 
import { getAllCategories } from "@/lib/actions/category";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";

type SortOption = "newest" | "price-low" | "price-high" | "bv-high";

export default function ProductListPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        toast.error("Failed to load store data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const processedProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category?.name === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    switch (sortBy) {
      case "price-low": return [...filtered].sort((a, b) => a.price - b.price);
      case "price-high": return [...filtered].sort((a, b) => b.price - a.price);
      case "bv-high": return [...filtered].sort((a, b) => b.bvAmount - a.bvAmount);
      default: return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fcfdfc]">
        
      
        <div className="container mx-auto px-4 md:px-6 py-10 flex flex-col lg:flex-row gap-10">
          
          {/* ══════════════ SIDEBAR (Categories) ══════════════ */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-6 px-1">
                <ListFilter className="w-4 h-4 text-emerald-600" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Filter By Category</h3>
              </div>
              
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={cn(
                    "flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                    activeCategory === "All" 
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                      : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                  )}
                >
                  All Formulations
                  <span className={cn("text-[10px] opacity-40", activeCategory === "All" && "opacity-100")}>{products.length}</span>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={cn(
                      "flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-bold transition-all",
                      activeCategory === cat.name 
                        ? "bg-[#1c3320] text-white shadow-lg shadow-emerald-900/20" 
                        : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                    )}
                  >
                    {cat.name}
                    <ChevronDown className={cn("w-3 h-3 opacity-20", activeCategory === cat.name && "opacity-100 -rotate-90")} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats / Info Widget */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2rem] p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">Business Boost</span>
              </div>
              <p className="text-[11px] text-emerald-700/70 font-medium leading-relaxed">
                Purchasing items with higher <strong>BV points</strong> helps you reach your next rank faster.
              </p>
            </div>
          </aside>

          {/* ══════════════ MAIN CONTENT AREA ══════════════ */}
          <main className="flex-1 space-y-8">
            
            {/* Search & Sort Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                <Input 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-14 rounded-2xl bg-white border-slate-100 focus:border-emerald-200 focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-700 shadow-sm"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-100 bg-white gap-3 font-black uppercase tracking-widest text-[10px] text-slate-600 shadow-sm">
                    <ArrowUpDown className="w-4 h-4 text-emerald-600" />
                    Sort: {sortBy.replace("-", " ")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-2xl p-2 min-w-[200px] shadow-2xl border-slate-100">
                  <DropdownMenuItem onClick={() => setSortBy("newest")} className="rounded-xl font-bold text-xs uppercase py-3">Newest First</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-low")} className="rounded-xl font-bold text-xs uppercase py-3">Price: Low to High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-high")} className="rounded-xl font-bold text-xs uppercase py-3">Price: High to Low</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("bv-high")} className="rounded-xl font-bold text-xs uppercase py-3 text-emerald-600 font-black">Highest BV Points</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Grid Status */}
            <div className="flex items-center gap-3 px-2">
              <LayoutGrid className="w-4 h-4 text-slate-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                {isLoading ? "Loading Inventory..." : `${processedProducts.length} Results in ${activeCategory}`}
              </span>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 opacity-20" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                <AnimatePresence mode="popLayout">
                  {processedProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: idx * 0.02 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && processedProducts.length === 0 && (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center">
                <FilterX className="w-12 h-12 text-slate-200 mb-4" />
                <h4 className="text-lg font-black text-slate-900 uppercase italic">No matches found</h4>
                <p className="text-slate-400 text-sm mt-1">Try changing category or search terms.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}