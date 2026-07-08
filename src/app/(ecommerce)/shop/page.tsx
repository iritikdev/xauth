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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // Mobile categories ke liye
import { cn } from "@/lib/utils";
import ProductCard from "./ProductCard";
import { getAllProducts } from "@/lib/actions/product";
import { getAllCategories } from "@/lib/actions/category";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/ui/badge";

type SortOption = "newest" | "price-low" | "price-high" | "bv-high";

export default function ProductListPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false); // ✅ New: Mobile search toggle
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

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

  const sortOptions = [
    { key: "newest", label: "Newest" },
    { key: "price-low", label: "Price: Low-High" },
    { key: "price-high", label: "Price: High-Low" },
    { key: "bv-high", label: "Highest BV" },
  ];

  const getSortLabel = (key: SortOption) => {
    return sortOptions.find(opt => opt.key === key)?.label;
  };

  // Categories List (Shared logic)
  const CategoryList = ({ closeSheet }: { closeSheet?: () => void }) => (
    <div className="flex flex-col gap-1.5 pb-20 lg:pb-0">
      <button
        onClick={() => { setActiveCategory("All"); closeSheet?.(); }}
        className={cn(
          "flex items-center justify-between px-5 py-4 rounded-2xl text-sm transition-all",
          activeCategory === "All"
            ? "bg-[#1c3320] text-white shadow-lg font-black italic"
            : "text-slate-500 hover:bg-emerald-50 font-semibold"
        )}
      >
        All Formulations
        <span className="text-[10px] opacity-60 bg-white/10 px-2 py-0.5 rounded-full">{products.length}</span>
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => { setActiveCategory(cat.name); closeSheet?.(); }}
          className={cn(
            "flex items-center justify-between px-5 py-4 rounded-2xl text-sm transition-all",
            activeCategory === cat.name
              ? "bg-[#1c3320] text-white shadow-lg font-black italic"
              : "text-slate-500 hover:bg-emerald-50 font-semibold"
          )}
        >
          {cat.name}
          <ChevronDown className={cn("w-3.5 h-3.5 opacity-20 transition-transform", activeCategory === cat.name && "-rotate-90 opacity-100")} />
        </button>
      ))}
    </div>
  );

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-[#fcfdfc] pb-10">

        {/* ══════════════ 1. MOBILE HEADER (Search Toggle) ══════════════ */}
        <header className="sticky top-0 z-50 bg-[#fcfdfc] border-b border-slate-50 lg:hidden px-4 py-3 flex items-center justify-between gap-4">
          {!isSearchVisible && (
            <h1 className="text-lg font-[1000] tracking-tighter uppercase italic text-slate-900">
              Products
            </h1>
          )}

          <AnimatePresence>
            {isSearchVisible && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                exit={{ opacity: 0, width: 0 }}
                className="relative flex-1"
              >
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 pl-10 rounded-lg bg-white border-slate-100 shadow-inner text-sm focus:ring-emerald-500/10"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <Button variant="ghost" className="absolute right-1 top-1 h-8 w-8 p-0" onClick={() => { setSearchQuery(""); setIsSearchVisible(false); }}>
                  <X size={16} className="text-slate-400" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSearchVisible && (
            <Button variant="outline" className="h-10 w-10 p-0 rounded-lg border-slate-100 shadow-sm" onClick={() => setIsSearchVisible(true)}>
              <Search size={18} className="text-emerald-700" />
            </Button>
          )}
        </header>


        <div className="container mx-auto px-4 md:px-6 py-6 lg:py-8 flex flex-col lg:flex-row gap-10">

          {/* ══════════════ 2. DESKTOP SIDEBAR (Static) ══════════════ */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-6 px-1">
                  <ListFilter className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Categories</h3>
                </div>
                <CategoryList />
              </div>
            </div>
          </aside>

          {/* ══════════════ 3. MAIN CONTENT (Grid) ══════════════ */}
          <main className="flex-1 space-y-6">

            {/* Desktop Search Bar (Collapsed on Mobile) */}
            <div className="relative hidden lg:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search formulations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-11 rounded-xl bg-white border-slate-100 shadow-sm text-sm focus:ring-emerald-500/10"
              />
            </div>

            {/* Product Stats */}
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
                Showing {processedProducts.length} results
              </p>
              {activeCategory !== "All" && (
                <Badge className="lg:hidden bg-emerald-50 text-emerald-700 border-emerald-100 rounded-lg px-3 py-1 text-[10px] font-black uppercase gap-1.5">
                  {activeCategory}
                  <X size={12} className="cursor-pointer" onClick={() => setActiveCategory("All")} />
                </Badge>
              )}
            </div>

            {/* Grid Area */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 opacity-20">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6">
                <AnimatePresence mode="popLayout">
                  {processedProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: idx * 0.01 }}
                      className="group"
                    >
                      {/* Ritik, ProductCard component mobile ke liye clean aur focused hona chahiye */}
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

      {/* ══════════════ 4. MOBILE STICKY BOTTOM BAR (Like Myntra) ══════════════ */}
      <footer className="fixed bottom-0 left-0 w-full h-13 bg-white border-t border-slate-100 z-50 flex lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
        {/* SORT BUTTON (Dropdown) */}
        <Sheet open={isSortSheetOpen} onOpenChange={setIsSortSheetOpen}>
          <SheetTrigger asChild>
            <button className="flex-1 flex items-center justify-center gap-3 text-sm font-black uppercase italic tracking-tight text-slate-800 border-r border-slate-100 active:bg-slate-50">
              <ArrowUpDown size={16} className="text-emerald-700" />
              Sort By
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-[2rem] p-0 border-none bg-white outline-none">
            {/* Handle bar for better UX */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />

            <SheetHeader className="px-6 py-4 border-b border-slate-50">
              <SheetTitle className="text-left text-sm font-[1000] uppercase italic tracking-tight text-slate-900">
                Sort Options
              </SheetTitle>
            </SheetHeader>

            <div className="p-4 space-y-1 pb-10">
              {sortOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    setSortBy(opt.key as SortOption);
                    setTimeout(() => setIsSortSheetOpen(false), 300);
                    // Tip: Agar sheet ko automatic close karna hai toh state ya trigger ref use karein
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                    sortBy === opt.key
                      ? "bg-emerald-50 text-emerald-700 italic border border-emerald-100"
                      : "text-slate-500 hover:bg-slate-50 border border-transparent"
                  )}
                >
                  {opt.label}
                  {sortBy === opt.key && (
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  )}
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* FILTER BUTTON (Sheet) */}
        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild className="">
            <button className="flex-1 bg-transparent flex items-center justify-center gap-3 text-sm font-black uppercase italic tracking-tight text-slate-800 active:bg-slate-50">
              <SlidersHorizontal size={16} className="text-emerald-700" />
              Filter
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-[2.5rem] h-[70vh] bg-white border-none p-0 overflow-hidden">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />
            <SheetHeader className="px-6 py-4 border-b border-slate-50 text-left">
              <SheetTitle className="text-xl font-black uppercase italic tracking-tight">Filter Categories</SheetTitle>
            </SheetHeader>
            <div className="p-6 overflow-y-auto h-full">
              
              {/* Ritik, closeSheet function mobile category button click hone par sheet band karega */}
              <CategoryList />
            </div>
          </SheetContent>
        </Sheet>
      </footer>
    </>
  );
}