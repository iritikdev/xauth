"use client";

import React, { useState, useActionState, useEffect } from "react";
import { updateProduct } from "@/lib/actions/product";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  UploadCloud,
  Loader2,
  Package,
  Save,
  Trash2,
  ChevronLeft,
  Sparkles,
  Tag,
  BarChart3,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { CldUploadWidget } from "next-cloudinary";

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  bvAmount: number;
  image: string;
  stock: number;
  categoryId: string;
}

/* ─── tiny design tokens ──────────────────────────────────────── */
const field =
  "h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 transition-all";

const label =
  "block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1.5";

/* ─── component ───────────────────────────────────────────────── */
export default function ProductEditForm({
  product,
  categories,
}: {
  product: IProduct;
  categories: any[];
}) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(
    product.image || null
  );
  const [hoverImage, setHoverImage] = useState(false);

  const [state, formAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await updateProduct(product.id, prevState, formData);
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Product updated successfully!");
      router.push("/admin/products");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

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
              Edit Product
            </h1>
          </div>
        </div>

        {/* live BV badge in header */}
        <div className="hidden md:flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2">
          <Sparkles size={14} className="text-amber-500" />
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-700">
            BV&nbsp;
          </span>
          <span className="text-sm font-black text-amber-900">
            {product.bvAmount} pts
          </span>
        </div>
      </div>

      {/* ── Main grid ── */}
      <form
        action={formAction}
        className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-6"
      >
        {/* ════════════════════════════════
            LEFT — media panel (dark luxury)
        ════════════════════════════════ */}
        <div className="flex flex-col gap-5">
          {/* Image card */}
          <div
            className="relative overflow-hidden rounded-[2rem] bg-zinc-950"
            style={{ minHeight: 420 }}
          >
            {/* decorative corner marks */}
            <span className="absolute top-5 left-5 h-5 w-5 border-t-2 border-l-2 border-amber-400/40 rounded-tl-md" />
            <span className="absolute top-5 right-5 h-5 w-5 border-t-2 border-r-2 border-amber-400/40 rounded-tr-md" />
            <span className="absolute bottom-5 left-5 h-5 w-5 border-b-2 border-l-2 border-amber-400/40 rounded-bl-md" />
            <span className="absolute bottom-5 right-5 h-5 w-5 border-b-2 border-r-2 border-amber-400/40 rounded-br-md" />

            <AnimatePresence mode="wait">
              {imageUrl ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35 }}
                  className="relative w-full h-full"
                  style={{ minHeight: 420 }}
                  onMouseEnter={() => setHoverImage(true)}
                  onMouseLeave={() => setHoverImage(false)}
                >
                  <Image
                    src={imageUrl}
                    alt="Product"
                    fill
                    className="object-cover rounded-[2rem]"
                    style={{
                      filter: hoverImage
                        ? "brightness(0.6)"
                        : "brightness(0.85)",
                      transition: "filter 0.3s ease",
                    }}
                  />
                  <input type="hidden" name="image" value={imageUrl} />

                  {/* overlay controls */}
                  <AnimatePresence>
                    {hoverImage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[2rem]"
                      >
                        <CldUploadWidget
                          uploadPreset="amaze_kyc_preset"
                          onSuccess={(result: any) => {
                            if (result?.info?.secure_url) {
                              setImageUrl(result.info.secure_url);
                              toast.success("Image replaced!");
                            }
                          }}
                          options={{
                            maxFiles: 1,
                            clientAllowedFormats: ["jpg", "png", "webp"],
                          }}
                        >
                          {({ open }) => (
                            <button
                              type="button"
                              onClick={() => open()}
                              className="flex items-center gap-2 rounded-2xl bg-white/90 backdrop-blur px-5 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-800 shadow-xl transition hover:bg-white"
                            >
                              <UploadCloud size={14} />
                              Replace
                            </button>
                          )}
                        </CldUploadWidget>

                        <button
                          type="button"
                          onClick={() => setImageUrl(null)}
                          className="flex items-center gap-2 rounded-2xl bg-red-500/80 backdrop-blur px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl transition hover:bg-red-600"
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* bottom label strip */}
                  <div className="absolute bottom-0 left-0 right-0 rounded-b-[2rem] bg-gradient-to-t from-black/70 to-transparent px-6 py-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">
                      Product Media
                    </p>
                    <p className="text-xs text-white/60 mt-0.5">
                      Hover to change or remove
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8"
                >
                  <CldUploadWidget
                    uploadPreset="amaze_kyc_preset"
                    onSuccess={(result: any) => {
                      if (result?.info?.secure_url) {
                        setImageUrl(result.info.secure_url);
                        toast.success("Image uploaded!");
                      }
                    }}
                    options={{
                      maxFiles: 1,
                      clientAllowedFormats: ["jpg", "png", "webp"],
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="group flex flex-col items-center gap-5 text-center"
                      >
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-400/30 bg-amber-400/10 transition-all duration-300 group-hover:bg-amber-400/20 group-hover:scale-110">
                          <UploadCloud
                            size={28}
                            className="text-amber-400 group-hover:text-amber-300"
                          />
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400">
                            Upload Product Image
                          </p>
                          <p className="mt-1 text-[11px] text-zinc-500">
                            JPG · PNG · WEBP · Cloudinary CDN
                          </p>
                        </div>
                        <div className="rounded-2xl border border-zinc-700 px-6 py-2 text-[11px] font-bold text-zinc-400 transition group-hover:border-amber-400/50 group-hover:text-amber-400">
                          Browse Files
                        </div>
                      </button>
                    )}
                  </CldUploadWidget>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BV Prestige Card */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-950 via-amber-900 to-zinc-900 p-7 shadow-2xl">
            {/* bg orb */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-amber-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-400">
                  Business Value Points
                </p>
              </div>

              <div className="space-y-1">
                <input
                  name="bvAmount"
                  type="number"
                  defaultValue={product.bvAmount}
                  className="w-full bg-transparent text-5xl font-black tracking-tight text-amber-100 outline-none focus:text-amber-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  placeholder="0"
                />
                <p className="text-[11px] text-amber-700 font-bold tracking-wide">
                  BV redeemable by distributors
                </p>
              </div>

              <div className="mt-2 flex items-center gap-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 px-4 py-3">
                <BarChart3 size={14} className="text-amber-400 shrink-0" />
                <p className="text-[11px] text-amber-300/80 leading-snug">
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
                  defaultValue={product.name}
                  required
                  placeholder="Enter product name…"
                  className={field}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Category</label>
                  <Select
                    name="categoryId"
                    defaultValue={product.categoryId}
                  >
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
                      defaultValue={product.stock}
                      className={cn(field, "pl-10")}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={label}>Product Description</label>
                <textarea
                  name="description"
                  defaultValue={product.description}
                  placeholder="Tell the story of your product…"
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
              {/* MRP */}
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
                    defaultValue={product.price}
                    className={cn(field, "pl-7 font-bold")}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Discount */}
              <div>
                <label
                  className={cn(
                    label,
                    "!text-emerald-600"
                  )}
                >
                  Distributor Discount (%)
                </label>
                <div className="relative">
                  <input
                    name="discount"
                    type="number"
                    defaultValue={product.discount}
                    className={cn(
                      field,
                      "pr-8 font-bold border-emerald-200 bg-emerald-50/60 text-emerald-800 focus:ring-emerald-400/60 focus:border-emerald-400"
                    )}
                    placeholder="0"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-500">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Calculated net price hint */}
            <NetPriceHint product={product} />
          </SectionCard>

          {/* ── Action row ── */}
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

/* ─── Net price hint ────────────────────────────────────────── */
function NetPriceHint({ product }: { product: IProduct }) {
  const net =
    product.price - (product.price * product.discount) / 100;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-zinc-50 border border-zinc-100 px-5 py-3.5">
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
        Net distributor price
      </span>
      <span className="text-sm font-black text-zinc-800">
        ₹{net.toFixed(2)}
      </span>
      <span className="ml-auto text-[10px] text-zinc-400">
        Based on current values — updates on save
      </span>
    </div>
  );
}

/* ─── Section card wrapper ──────────────────────────────────── */
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
        <h2
          className="text-sm font-black uppercase tracking-[0.15em] text-zinc-600"
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

/* ─── Submit button ─────────────────────────────────────────── */
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
          Saving…
        </>
      ) : (
        <>
          <Save size={15} />
          Save Changes
        </>
      )}
    </button>
  );
}