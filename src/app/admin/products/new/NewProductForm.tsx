"use client";

import React, { useState } from "react";
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
  Package,
  Image as ImageIcon,
  X,
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
import Image from "next/image";
import { useActionState } from "react";

export default function NewProductForm({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(createProduct, null);

  // Handle local image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className=" space-y-4 pb-20 px-4 pt-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
        <div className="flex items-center gap-5">
          
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
              Create <span className="text-emerald-600">Product</span>
            </h1>
          </div>
        </div>
      </div>

      <form
        action={formAction}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2rem] p-8 md:p-10 space-y-8 bg-white">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700 ml-1">
                  Display Name
                </Label>
                <Input
                  name="name"
                  placeholder="e.g. Premium Ashwagandha Drops"
                  required
                  className="h-14 rounded-2xl bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 ml-1">
                    Category
                  </Label>
                  <Select name="categoryId" required>
                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
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
                  placeholder="Describe benefits..."
                  className="min-h-[160px] rounded-2xl bg-slate-50/50"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700 ml-1">
                  MRP (Retail)
                </Label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  className="h-14 rounded-2xl bg-slate-50/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-emerald-600 ml-1">
                  Discount (%)
                </Label>
                <Input
                  name="discount"
                  type="number"
                  defaultValue="0"
                  className="h-14 rounded-2xl bg-emerald-50/30 border-emerald-100"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-[2rem] bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <Label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-1">
                BV Points
              </Label>
              <Input
                name="bvAmount"
                type="number"
                className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-black text-xl"
                placeholder="0"
              />
              <p className="text-[10px] text-slate-500 font-bold">
                * Used for MLM commissions.
              </p>
            </div>
          </Card>

          {/* DYNAMIC IMAGE UPLOAD FEATURE */}
          <Card className="p-8 rounded-[2rem] border-none shadow-xl bg-white space-y-4">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block ml-1">
              Product Image
            </Label>

            <div className="relative group">
              {imagePreview ? (
                <div className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-emerald-500">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />

                  {/* THIS IS THE CRITICAL PART: The hidden input that sends data to Server Action */}
                  <input type="hidden" name="image" value={imagePreview} />

                  <button
                    type="button" // Important: specify type="button" so it doesn't submit the form
                    onClick={() => setImagePreview(null)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg text-red-500 hover:scale-110 transition-transform"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="aspect-square border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-200 transition-all cursor-pointer group">
                  <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <UploadCloud className="text-slate-400 group-hover:text-emerald-500" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Upload Media
                  </p>

                  {/* Standard file input that triggers the preview logic */}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </Card>

          <SubmitButton />
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
        "w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all",
        pending
          ? "bg-slate-100 text-slate-400"
          : "bg-emerald-600 hover:bg-emerald-700 text-white",
      )}
    >
      {pending ? <Loader2 className="animate-spin" /> : "Publish Product"}
    </Button>
  );
}
