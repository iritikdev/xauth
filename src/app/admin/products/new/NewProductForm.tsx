"use client";

import React, { useState, useActionState } from "react";
import { createProduct } from "@/lib/actions/product";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Loader2,
  Package,
  Sparkles,
  BarChart3,
  Tag,
  Layers,
  ChevronLeft,
  X,
  PlusCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* ─── design tokens (shared with ProductEditForm) ─────────────── */
const field =
  "w-full h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400 transition-all";

const label =
  "block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1.5";

/* ─── component ───────────────────────────────────────────────── */
export default function NewProductForm({
  categories,
}: {
  categories: any[];
}) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hoverImage, setHoverImage] = useState(false);
  const [state, formAction, isPending] = useActionState(createProduct, null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Page header ── */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-800"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
              Product Catalog
            </p>
            <h1
              className="text-2xl font-black text-zinc-900 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              New Product
            </h1>
          </div>
        </div>

        {/* step indicator */}
        <div className="hidden md:flex items-center gap-2 rounded-2xl bg-zinc-100 border border-zinc-200 px-4 py-2">
          <PlusCircle size={14} className="text-zinc-500" />
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-600">
            Creating New Listing
          </span>
        </div>
      </div>

      {/* ── Main grid ── */}
      <form
        action={formAction}
        className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6"
      >
        {/* ════════════════════════════════
            LEFT — media + BV panel
        ════════════════════════════════ */}
        <div className="flex flex-col gap-5">
          {/* Image upload panel */}
          <div
            className="relative overflow-hidden rounded-[2rem] bg-zinc-950"
            style={{ minHeight: 380 }}
          >
            {/* corner marks */}
            {["tl", "tr", "bl", "br"].map((pos) => (
              <span
                key={pos}
                className={cn(
                  "absolute h-5 w-5 border-emerald-400/40",
                  pos === "tl" && "top-5 left-5 border-t-2 border-l-2 rounded-tl-md",
                  pos === "tr" && "top-5 right-5 border-t-2 border-r-2 rounded-tr-md",
                  pos === "bl" && "bottom-5 left-5 border-b-2 border-l-2 rounded-bl-md",
                  pos === "br" && "bottom-5 right-5 border-b-2 border-r-2 rounded-br-md"
                )}
              />
            ))}

            <AnimatePresence mode="wait">
              {imagePreview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full"
                  style={{ minHeight: 380 }}
                  onMouseEnter={() => setHoverImage(true)}
                  onMouseLeave={() => setHoverImage(false)}
                >
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-[2rem]"
                    style={{
                      filter: hoverImage
                        ? "brightness(0.55)"
                        : "brightness(0.82)",
                      transition: "filter 0.3s ease",
                    }}
                  />
                  <input type="hidden" name="image" value={imagePreview} />

                  <AnimatePresence>
                    {hoverImage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center rounded-[2rem]"
                      >
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="flex items-center gap-2 rounded-2xl bg-red-500/80 backdrop-blur px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl transition hover:bg-red-600"
                        >
                          <X size={13} />
                          Remove
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute bottom-0 left-0 right-0 rounded-b-[2rem] bg-gradient-to-t from-black/70 to-transparent px-6 py-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                      Product Media
                    </p>
                    <p className="text-xs text-white/50 mt-0.5">
                      Hover to remove
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.label
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  htmlFor="product-image-input"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 cursor-pointer group"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/30 bg-emerald-400/10 transition-all duration-300 group-hover:bg-emerald-400/20 group-hover:scale-110">
                    <UploadCloud
                      size={28}
                      className="text-emerald-400 group-hover:text-emerald-300"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">
                      Upload Product Image
                    </p>
                    <p className="mt-1.5 text-[11px] text-zinc-500">
                      JPG · PNG · WEBP
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-700 px-6 py-2 text-[11px] font-bold text-zinc-400 transition group-hover:border-emerald-400/50 group-hover:text-emerald-400">
                    Browse Files
                  </div>
                  <input
                    id="product-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </motion.label>
              )}
            </AnimatePresence>
          </div>

          {/* BV Prestige Card */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-900 p-7 shadow-2xl">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-emerald-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">
                  Business Value Points
                </p>
              </div>
              <input
                name="bvAmount"
                type="number"
                placeholder="0"
                className="w-full bg-transparent text-5xl font-black tracking-tight text-emerald-100 outline-none placeholder:text-emerald-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              />
              <p className="text-[11px] text-emerald-700 font-bold tracking-wide">
                BV redeemable by distributors
              </p>
              <div className="flex items-start gap-3 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 px-4 py-3">
                <BarChart3
                  size={14}
                  className="text-emerald-400 shrink-0 mt-0.5"
                />
                <p className="text-[11px] text-emerald-300/70 leading-snug">
                  Higher BV drives deeper distributor engagement and downline
                  activity
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════
            RIGHT — form fields
        ════════════════════════════════ */}
        <div className="flex flex-col gap-5">
          {/* ── Identity card ── */}
          <SectionCard icon={<Tag size={14} />} title="Product Identity">
            <div className="space-y-5">
              <div>
                <label className={label}>Display Name</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Premium Ashwagandha Drops"
                  className={field}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Category</label>
                  <Select name="categoryId" required>
                    <SelectTrigger
                      className={cn(
                        field,
                        "flex items-center justify-between"
                      )}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl shadow-xl border-zinc-100">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id}
                          className="text-sm font-medium"
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={label}>Stock Level</label>
                  <div className="relative">
                    <Package
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                    <input
                      name="stock"
                      type="number"
                      placeholder="0"
                      className={cn(field, "pl-10")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={label}>Product Description</label>
                <textarea
                  name="description"
                  placeholder="Describe benefits, usage, and why distributors love it…"
                  rows={5}
                  className={cn(
                    field,
                    "h-auto py-3.5 resize-none leading-relaxed"
                  )}
                />
              </div>
            </div>
          </SectionCard>

          {/* ── Pricing card ── */}
          <SectionCard icon={<Layers size={14} />} title="Pricing & Margins">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>MRP (Retail Price)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
                    ₹
                  </span>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className={cn(field, "pl-7 font-bold")}
                  />
                </div>
              </div>

              <div>
                <label className={cn(label, "!text-emerald-600")}>
                  Distributor Discount (%)
                </label>
                <div className="relative">
                  <input
                    name="discount"
                    type="number"
                    defaultValue="0"
                    placeholder="0"
                    className={cn(
                      field,
                      "pr-8 font-bold border-emerald-200 bg-emerald-50/60 text-emerald-800 focus:ring-emerald-400/60 focus:border-emerald-400"
                    )}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-500">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* margin note */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-zinc-50 border border-zinc-100 px-5 py-3.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Net price
              </span>
              <span className="text-[11px] text-zinc-400">
                Calculated automatically based on MRP &times; discount
              </span>
            </div>
          </SectionCard>

          {/* ── Publish checklist ── */}
          <PublishChecklist />

          {/* ── Actions ── */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <SubmitButton />
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 text-[11px] font-black uppercase tracking-widest text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-800 sm:w-auto w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ─── Publish checklist ──────────────────────────────────────── */
const CHECKLIST = [
  "Product name & category assigned",
  "MRP and distributor discount set",
  "BV points configured for MLM payouts",
  "Product image uploaded",
];

function PublishChecklist() {
  return (
    <div className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-4">
        Pre-publish checklist
      </p>
      <ul className="space-y-2.5">
        {CHECKLIST.map((item) => (
          <li key={item} className="flex items-center gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
            </div>
            <span className="text-xs text-zinc-500 font-medium">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Section card ───────────────────────────────────────────── */
function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-zinc-100 bg-white p-7 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
          {icon}
        </div>
        <h2 className="text-sm font-black uppercase tracking-[0.15em] text-zinc-600">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

/* ─── Submit button ──────────────────────────────────────────── */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "flex flex-1 h-14 items-center justify-center gap-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] shadow-lg transition-all",
        pending
          ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
          : "bg-zinc-950 text-white hover:bg-zinc-800 shadow-zinc-900/20 active:scale-[0.98]"
      )}
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Publishing…
        </>
      ) : (
        <>
          <PlusCircle size={15} />
          Publish Product
        </>
      )}
    </button>
  );
}