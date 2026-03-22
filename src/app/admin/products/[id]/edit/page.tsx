import prisma from "@/lib/prisma";
import ProductEditForm from "../../ProductEditForm";
import { notFound } from "next/navigation";

interface Props {
  // Update: params ab ek Promise return karta hai
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: Props) {
  // ✅ Fix: params ko pehle await karein
  const { id } = await params;

  // 1. Fetch Product and Categories in Parallel
  const [product, categories] = await Promise.all([
    prisma.product.findFirst({
      where: { id },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound(); 
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
          Edit <span className="text-emerald-600">Product</span>
        </h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          Update details for: {product.name}
        </p>
      </div>

      <ProductEditForm product={product} categories={categories} />
    </div>
  );
}