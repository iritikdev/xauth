import prisma from "@/lib/prisma";
import { Layers, FolderTree } from "lucide-react";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryList from "@/components/admin/CategoryList";
import { PageHeader } from "@/components/admin/page-header";

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
        <PageHeader 
        title="Manage"
        highlight="Categories"
        description="Create, edit, and organize product categories to structure your catalog effectively."
      />
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