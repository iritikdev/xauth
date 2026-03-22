"use client";

import React, { useState, useActionState, useEffect } from "react";
import { updateProduct } from "@/lib/actions/product";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  UploadCloud,
  Loader2,
  Package,
  Save,
  Trash2,
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

// Interface for type safety
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

export default function ProductEditForm({ 
  product, 
  categories 
}: { 
  product: IProduct, 
  categories: any[] 
}) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(product.image || null);

  // ✅ Fix: useActionState signature mismatch solved
  const [state, formAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await updateProduct(product.id, prevState, formData);
    },
    null
  );

  // Handle Success or Error Toast
  useEffect(() => {
    if (state?.success) {
      toast.success("Product updated successfully!");
      router.push("/admin/products");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

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
      className="space-y-4 pb-20 px-0 md:px-4"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic leading-none">
          Edit <span className="text-emerald-600">Product</span>
        </h1>
      </div>

      <form action={formAction} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Info */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-[2.5rem] p-8 md:p-10 space-y-8 bg-white">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Display Name</Label>
                <Input name="name" defaultValue={product.name} required className="h-14 rounded-2xl bg-slate-50/50 border-slate-100" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</Label>
                  <Select name="categoryId" defaultValue={product.categoryId}>
                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl shadow-xl">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Stock Level</Label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input name="stock" type="number" defaultValue={product.stock} className="h-14 pl-12 rounded-2xl bg-slate-50/50" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Product Story</Label>
                <Textarea name="description" defaultValue={product.description} className="min-h-[160px] rounded-[2rem] bg-slate-50/50 p-5 resize-none" />
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50 grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">MRP (Retail)</Label>
                <Input name="price" type="number" step="0.01" defaultValue={product.price} className="h-14 rounded-2xl bg-slate-50/50 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-emerald-600 ml-1">Discount (%)</Label>
                <Input name="discount" type="number" defaultValue={product.discount} className="h-14 rounded-2xl bg-emerald-50/30 border-emerald-100 font-bold text-emerald-700" />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em]">Business Value (BV)</Label>
              <Input name="bvAmount" type="number" defaultValue={product.bvAmount} className="h-16 rounded-2xl bg-white/5 border-white/10 text-white font-black text-2xl text-center" />
            </div>
          </Card>

          <Card className="p-8 rounded-[2.5rem] bg-white space-y-4 shadow-sm border border-slate-50">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Product Media</Label>
            <div className="relative group aspect-square">
              {imagePreview ? (
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-2 border-slate-100">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <input type="hidden" name="image" value={imagePreview} />
                  <button type="button" onClick={() => setImagePreview(null)} className="absolute top-4 right-4 p-2 bg-white rounded-xl shadow-lg text-red-500"><Trash2 size={16} /></button>
                </div>
              ) : (
                <label className="w-full h-full border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-4 bg-slate-50/50 cursor-pointer">
                  <UploadCloud className="text-slate-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Change Image</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </Card>

          <SubmitButton />
          
          <Button type="button" variant="ghost" onClick={() => router.back()} className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400">
            Cancel
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
        "w-full h-20 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all",
        pending ? "bg-slate-100 text-slate-400" : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20",
      )}
    >
      {pending ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
    </Button>
  );
}