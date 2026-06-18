"use client";

import { useState, useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, X, Leaf, ChevronDown,
  Sparkles, Package, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/ecommerce/ProductCard"; // ← your existing component

/* ─── types ───────────────────────────────────────────────────── */
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  bvAmount: number;
  image: string;
  stock: number;
  categoryId: string;
  categoryName: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

interface StoreClientProps {
  initialProducts: Product[];
  categories: Category[];
}

/* ─── sort options ────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: "newest",    label: "Newest"         },
  { value: "popular",   label: "Most Popular"   },
  { value: "price_asc", label: "Price: Low–High" },
  { value: "price_desc", label: "Price: High–Low" },
  { value: "bv_desc",   label: "Highest BV"     },
];

/* ─── component ───────────────────────────────────────────────── */
export function StoreClient({ initialProducts, categories }: StoreClientProps) {
  const [search, setSearch]           = useState("");
  const [activeCat, setActiveCat]     = useState<string | null>(null);
  const [sort, setSort]               = useState("newest");
  const [sortOpen, setSortOpen]       = useState(false);
  const [mobileFilter, setMobileFilter] = useState(false);
  const [, startTransition]           = useTransition();

  /* ── derived product list ── */
  const filtered = useMemo(() => {
    let list = [...initialProducts];

    // category
    if (activeCat) list = list.filter((p) => p.categoryId === activeCat);

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    // sort
    switch (sort) {
      case "price_asc":  list.sort((a, b) => a.price - b.price);   break;
      case "price_desc": list.sort((a, b) => b.price - a.price);   break;
      case "bv_desc":    list.sort((a, b) => b.bvAmount - a.bvAmount); break;
      case "popular":    list.sort((a, b) => b.stock - a.stock);   break;
      // newest: default DB order
    }

    return list;
  }, [initialProducts, activeCat, search, sort]);

  const activeCatName = categories.find((c) => c.id === activeCat)?.name;
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label;

  /* ── category sidebar ── */
  const CategoryList = (
    <div className="space-y-1">
      <button
        onClick={() => { startTransition(() => setActiveCat(null)); }}
        className={cn(
          "w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all duration-150",
          !activeCat
            ? "bg-zinc-950 text-white font-black"
            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium"
        )}
      >
        <span>All Products</span>
        <span className={cn(
          "text-[10px] font-black rounded-full px-2 py-0.5",
          !activeCat ? "bg-white/10 text-white/70" : "bg-zinc-100 text-zinc-400"
        )}>
          {initialProducts.length}
        </span>
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => { startTransition(() => setActiveCat(cat.id === activeCat ? null : cat.id)); }}
          className={cn(
            "w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all duration-150",
            activeCat === cat.id
              ? "bg-emerald-50 text-emerald-900 font-black border border-emerald-200"
              : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium"
          )}
        >
          <span>{cat.name}</span>
          <span className={cn(
            "text-[10px] font-black rounded-full px-2 py-0.5",
            activeCat === cat.id ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-400"
          )}>
            {cat.count.toString().padStart(2, "0")}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div
      className="min-h-screen pb-20"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── Page header ── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">
            Amaze Ayurveda
          </p>
          <h1
            className="text-2xl sm:text-3xl font-black text-zinc-900 leading-tight"
            style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
          >
            Browse Store
          </h1>
          <p className="mt-1 text-sm font-medium text-zinc-400">
            Discover premium Ayurvedic wellness tailored for your journey.
          </p>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              strokeWidth={2}
            />
            <input
              value={search}
              onChange={(e) => startTransition(() => setSearch(e.target.value))}
              placeholder="Search products…"
              className="w-full h-11 pl-9 pr-9 rounded-2xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="h-11 flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-all whitespace-nowrap"
            >
              <SlidersHorizontal size={13} strokeWidth={2} />
              <span className="hidden sm:inline">{sortLabel}</span>
              <ChevronDown size={12} className={cn("transition-transform", sortOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-13 mt-1 w-48 rounded-2xl border border-zinc-100 bg-white shadow-xl p-1.5 z-50"
                >
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => { setSort(o.value); setSortOpen(false); }}
                      className={cn(
                        "w-full text-left rounded-xl px-3 py-2.5 text-[12px] font-medium transition-colors",
                        sort === o.value
                          ? "bg-zinc-950 text-white font-black"
                          : "text-zinc-600 hover:bg-zinc-50"
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFilter((v) => !v)}
            className="lg:hidden h-11 w-11 flex items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-all"
          >
            <SlidersHorizontal size={15} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ── Active filter chips ── */}
      <AnimatePresence>
        {(activeCat || search) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-5 overflow-hidden"
          >
            {activeCat && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-[11px] font-black text-emerald-700">
                {activeCatName}
                <button onClick={() => setActiveCat(null)}>
                  <X size={10} strokeWidth={3} />
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1.5 text-[11px] font-black text-zinc-600">
                "{search}"
                <button onClick={() => setSearch("")}>
                  <X size={10} strokeWidth={3} />
                </button>
              </span>
            )}
            <button
              onClick={() => { setActiveCat(null); setSearch(""); }}
              className="text-[11px] font-black text-zinc-400 hover:text-zinc-700 underline underline-offset-2"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile filter drawer ── */}
      <AnimatePresence>
        {mobileFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mb-5 rounded-[2rem] border border-zinc-100 bg-white p-5 overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
                Categories
              </p>
              <button
                onClick={() => setMobileFilter(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X size={14} />
              </button>
            </div>
            {CategoryList}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main layout ── */}
      <div className="flex gap-6">

        {/* ── Desktop sidebar ── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="rounded-[2rem] border border-zinc-100 bg-white p-5 shadow-sm sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                <SlidersHorizontal size={11} strokeWidth={2} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
                Categories
              </p>
            </div>
            {CategoryList}
          </div>

          {/* BV hint card */}
          <div className="mt-4 rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-900 p-5 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={11} className="text-emerald-400" />
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-400">
                  Earn BV Points
                </p>
              </div>
              <p className="text-xs font-medium text-emerald-300/70 leading-relaxed">
                Every purchase adds BV to your account for MLM commissions.
              </p>
            </div>
          </div>
        </aside>

        {/* ── Product grid + special offer ── */}
        <div className="flex-1 min-w-0">
          {/* result count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-medium text-zinc-400">
              {filtered.length === 0
                ? "No products found"
                : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
              {activeCatName && (
                <span className="font-black text-emerald-700"> in {activeCatName}</span>
              )}
            </p>
          </div>

          {/* ── Empty state ── */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="h-16 w-16 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                <Package size={22} className="text-zinc-300" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-zinc-500">No products found</p>
                <p className="text-[11px] text-zinc-400 mt-1">Try a different search or category</p>
              </div>
              <button
                onClick={() => { setSearch(""); setActiveCat(null); }}
                className="text-[11px] font-black text-emerald-700 underline underline-offset-2"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* ── Product grid ── */}
          {filtered.length > 0 && (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22, delay: i < 6 ? i * 0.04 : 0 }}
                  >
                    {/* ↓ Pass straight to your ProductCard */}
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── Special offer banner ── */}
          <div className="mt-10 relative overflow-hidden rounded-[2rem] bg-zinc-950 p-8 sm:p-10">
            {/* corner marks */}
            {["tl","tr","bl","br"].map((p) => (
              <span
                key={p}
                className={cn(
                  "absolute h-5 w-5 border-emerald-400/30",
                  p==="tl"&&"top-4 left-4 border-t-2 border-l-2 rounded-tl",
                  p==="tr"&&"top-4 right-4 border-t-2 border-r-2 rounded-tr",
                  p==="bl"&&"bottom-4 left-4 border-b-2 border-l-2 rounded-bl",
                  p==="br"&&"bottom-4 right-4 border-b-2 border-r-2 rounded-br"
                )}
              />
            ))}
            <div className="absolute -top-10 right-1/4 h-48 w-48 rounded-full bg-emerald-400/8 blur-3xl pointer-events-none" />
            <Leaf size={120} className="absolute -bottom-6 -right-6 text-white/[0.03] rotate-12 pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">
                  Special Offer
                </p>
                <h2
                  className="text-xl sm:text-2xl font-black text-white mb-3 leading-tight"
                  style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                >
                  Elite Practitioner's<br className="sm:hidden" /> Wellness Pack
                </h2>
                <p className="text-sm font-medium text-white/40 max-w-sm leading-relaxed">
                  Save 20% on our curated selection of immunity and digestion powerhouses. Perfect for bulk orders.
                </p>
              </div>
              <button className="flex items-center gap-2.5 shrink-0 rounded-2xl bg-emerald-400 hover:bg-emerald-300 px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-950 transition-all shadow-lg shadow-emerald-400/20 active:scale-[0.98] group">
                Bundle & Save
                <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}