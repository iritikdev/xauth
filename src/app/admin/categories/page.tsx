import prisma from "@/lib/prisma";
import { Layers, FolderTree } from "lucide-react";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryList from "@/components/admin/CategoryList";

export default async function CategoryPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="py-10 px-6 space-y-10">
      <div className="border-b border-slate-100 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">
            Product <span className="text-emerald-600">Categories</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            Organize Swadeshi Catalog Hierarchy
          </p>
        </div>
        <FolderTree className="text-slate-200 w-12 h-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          {/* This is the Client Component with the hook */}
          <CategoryForm categories={categories} />
        </div>

        <div className="lg:col-span-8">
          {/* This can be a simple display component */}
          <CategoryList categories={categories} />
        </div>
      </div>
    </div>
  );
}