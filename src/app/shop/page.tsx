"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Loader2, ArrowUpDown, 
  ChevronDown, FilterX, ListFilter,
  LayoutGrid, X, SlidersHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // Mobile categories ke liye
import { cn } from "@/lib/utils";
import ProductCard from "@/components/ecommerce/ProductCard";
import { getAllProducts,  } from "@/lib/actions/product"; 
import { getAllCategories } from "@/lib/actions/category";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";

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
        toast.error("Failed to load inventory");
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

  // Categories Sidebar Content (Shared between Desktop & Mobile)
  const CategoryList = () => (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={() => setActiveCategory("All")}
        className={cn(
          "flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all",
          activeCategory === "All" 
            ? "bg-[#1c3320] text-white shadow-lg shadow-emerald-900/20" 
            : "text-slate-500 hover:bg-emerald-50"
        )}
      >
        All Formulations
        <span className="text-[10px] opacity-60 bg-white/10 px-2 py-0.5 rounded-full">{products.length}</span>
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.name)}
          className={cn(
            "flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all",
            activeCategory === cat.name 
              ? "bg-[#1c3320] text-white shadow-lg" 
              : "text-slate-500 hover:bg-emerald-50"
          )}
        >
          {cat.name}
          <ChevronDown className={cn("w-3 h-3 opacity-20", activeCategory === cat.name && "-rotate-90 opacity-100")} />
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fcfdfc]">
        
        

        <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-10">
          
          {/* ══════════════ DESKTOP SIDEBAR (Fixed Position) ══════════════ */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-6 px-1">
                  <ListFilter className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Categories</h3>
                </div>
                <CategoryList />
              </div>
              
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2rem] p-6">
                <p className="text-[11px] text-emerald-800/70 font-medium leading-relaxed">
                  Earn extra <strong>BV points</strong> on Immunity booster packs this month!
                </p>
              </div>
            </div>
          </aside>

          {/* ══════════════ MAIN CONTENT ══════════════ */}
          <main className="flex-1 space-y-6">
            
            {/* Search & Sort & Mobile Filter Row */}
            <div className="flex gap-3 items-center sticky top-20 lg:static z-40 bg-[#fcfdfc] py-2">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-11 rounded-xl bg-white border-slate-100 shadow-sm text-sm focus:ring-emerald-500/10"
                />
              </div>

              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden h-12 w-12 rounded-xl border-slate-100 bg-white shadow-sm p-0">
                    <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-[2.5rem] h-[70vh] bg-white border-none p-0 overflow-hidden">
                  <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />
                  <SheetHeader className="px-6 py-4 border-b border-slate-50 text-left">
                    <SheetTitle className="text-xl font-black uppercase italic tracking-tight">Filter Categories</SheetTitle>
                  </SheetHeader>
                  <div className="p-6 overflow-y-auto h-full pb-20">
                    <CategoryList />
                  </div>
                </SheetContent>
              </Sheet>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 px-4 rounded-xl border-slate-100 bg-white gap-2 text-xs font-bold text-slate-600 shadow-sm">
                    <ArrowUpDown className="w-4 h-4 text-emerald-600" />
                    <span className="hidden sm:inline">Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[180px] shadow-2xl border-slate-100">
                  <DropdownMenuItem onClick={() => setSortBy("newest")} className="rounded-xl font-bold text-[11px] uppercase py-3">Newest</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-low")} className="rounded-xl font-bold text-[11px] uppercase py-3">Price: Low-High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("bv-high")} className="rounded-xl font-bold text-[11px] uppercase py-3 text-emerald-600">Highest BV</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Category Badge (Mobile Only) */}
            {activeCategory !== "All" && (
               <div className="flex lg:hidden items-center gap-2 px-1">
                 <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded-lg px-3 py-1 text-[10px] font-black uppercase">
                   Category: {activeCategory}
                   <X size={12} className="ml-2 cursor-pointer" onClick={() => setActiveCategory("All")} />
                 </Badge>
               </div>
            )}

            {/* Grid Area */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 opacity-20">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
                <AnimatePresence mode="popLayout">
                  {processedProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: idx * 0.01 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {!isLoading && processedProducts.length === 0 && (
              <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <FilterX className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No matches found</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}