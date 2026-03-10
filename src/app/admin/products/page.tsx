import prisma from "@/lib/prisma";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import ProductTable from "@/components/admin/ProductTable";

export default async function AdminProductsPage() {
  // Fetch all products from Prisma
  const products = await prisma.product.findMany();

  return (
    <div className="space-y-10 pb-20 pt-10 px-6">
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">
            Inventory <span className="text-emerald-600">Control</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Managing {products.length} active products in catalog
          </p>
        </div>
        
        <Link href="/admin/products/new">
          <Button className="h-14 px-8 rounded-2xl bg-[#0f172a] hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] gap-3 shadow-xl transition-all active:scale-95">
            <Plus className="w-5 h-5" /> Add New Product
          </Button>
        </Link>
      </div>

      {/* Global Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by SKU, name or category..." 
            className="h-14 pl-12 rounded-2xl bg-white border-none shadow-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <Button variant="outline" className="h-14 rounded-2xl border-slate-200 px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-white">
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>

      {/* The Product Table Component */}
      <ProductTable products={products} />
    </div>
  );
}