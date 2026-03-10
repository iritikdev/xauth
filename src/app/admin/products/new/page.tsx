"use client";

import React from "react";
import { createProduct } from "@/lib/actions/product";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  UploadCloud,
  Check,
  Zap,
  Loader2,
  Info,
  DollarSign,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8 pb-20 px-4 pt-10"
    >
      {/* SaaS Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
        <div className="flex items-center gap-5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-11 w-11 rounded-xl border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
              Create <span className="text-emerald-600">Product</span>
            </h1>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
              Admin Inventory Management Portal
            </p>
          </div>
        </div>
      </div>

      <form
        action={createProduct}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* LEFT COLUMN - Primary Details */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2rem] p-8 md:p-10 space-y-8 bg-white">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-5 w-1 bg-emerald-500 rounded-full" />
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Core Information
                </Label>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700 ml-1">
                  Display Name
                </Label>
                <Input
                  name="name"
                  placeholder="e.g. Premium Ashwagandha Drops"
                  required
                  className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 ml-1">
                    Category
                  </Label>
                  <Select name="categoryId">
                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white">
                      <SelectValue placeholder="Categorize item" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100">
                      <SelectItem value="65f1a2b3c4d5e6f7a8b9c0d1">
                        Health Care
                      </SelectItem>
                      <SelectItem value="65f1a2b3c4d5e6f7a8b9c0d2">
                        Personal Care
                      </SelectItem>
                      <SelectItem value="65f1a2b3c4d5e6f7a8b9c0d3">
                        Agriculture
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 ml-1">
                    Stock Level
                  </Label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      name="stock"
                      type="number"
                      placeholder="0"
                      className="h-14 pl-12 rounded-2xl bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700 ml-1">
                  Product Story
                </Label>
                <Textarea
                  name="description"
                  placeholder="Describe benefits, usage, and ingredients..."
                  className="min-h-[160px] rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white p-5 resize-none font-medium leading-relaxed"
                />
              </div>
            </div>

            {/* FINANCIALS */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <span className="h-5 w-1 bg-emerald-500 rounded-full" />
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Pricing Matrix
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-2">
                    MRP <Info size={12} className="text-slate-300" />
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      ₹
                    </span>
                    <Input
                      name="mrp"
                      type="number"
                      required
                      className="h-14 pl-10 rounded-2xl bg-slate-50/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-emerald-600 ml-1 flex items-center gap-2">
                    Partner Price <Zap size={12} fill="currentColor" />
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">
                      ₹
                    </span>
                    <Input
                      name="price"
                      type="number"
                      required
                      className="h-14 pl-10 rounded-2xl border-emerald-100 bg-emerald-50/30 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN - Business & Media */}
        <div className="lg:col-span-4 space-y-8">
          {/* MLM Card */}
          <Card className="rounded-[2rem] bg-slate-900 p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                  <Zap
                    className="text-emerald-400 h-5 w-5"
                    fill="currentColor"
                  />
                </div>
                <h2 className="font-black uppercase tracking-tight italic">
                  Business Volume
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-1">
                    BV Points for Network
                  </Label>
                  <Input
                    name="bvAmount"
                    type="number"
                    className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-black text-xl focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed px-1">
                  * This BV will be used to calculate commissions across your
                  16-level genealogy.
                </p>
              </div>
            </div>
            {/* Background Decorative Mesh */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
          </Card>

          {/* Media Upload */}
          <Card className="p-8 rounded-[2rem] border-none shadow-xl bg-white space-y-4">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block ml-1">
              Primary Media
            </Label>
            <div className="aspect-square border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-200 transition-all cursor-pointer group">
              <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <UploadCloud className="text-slate-400 group-hover:text-emerald-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Upload 1000x1000
              </p>
              <input type="hidden" name="image" value="/products/default.png" />
            </div>
          </Card>

          {/* Actions */}
          <SubmitButton />

          <Button
            variant="ghost"
            type="button"
            className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-slate-400 hover:text-red-500"
          >
            Save as Draft
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all active:scale-[0.98]",
        pending
          ? "bg-slate-100 text-slate-400"
          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20",
      )}
    >
      {pending ? (
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin h-5 w-5" />
          <span>Synchronizing...</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span>Publish Product</span>
          <Check size={18} />
        </div>
      )}
    </Button>
  );
}
