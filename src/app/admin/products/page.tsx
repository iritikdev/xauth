import prisma from "@/lib/prisma";
import { Plus, Box, AlertTriangle, TrendingUp, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { Card } from "@/components/ui/card";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Business Analytics for SaaS Header
  const totalStock = products.reduce((acc, curr) => acc + curr.stock, 0);
  const lowStockItems = products.filter(p => p.stock < 10).length;
  const totalValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);

  return (
    <div className="space-y-10 pb-20 pt-10 px-6">
      {/* 1. SaaS Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Live Inventory System</span>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
            Product <span className="text-emerald-600">Vault</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-3 flex items-center gap-2">
            Cataloging {products.length} Swadeshi SKUs
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button className="h-16 px-10 rounded-[2rem] bg-[#0f172a] hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] gap-4 shadow-2xl shadow-emerald-900/20 transition-all active:scale-95 border-b-4 border-emerald-800">
            <Plus className="w-6 h-6" /> Create New Entry
          </Button>
        </Link>
      </div>

      {/* 2. Quick Insight Cards (The "SaaS" touch) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-[2.5rem] border-none bg-white shadow-sm ring-1 ring-slate-100 flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
             <Box size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Inventory</p>
            <p className="text-2xl font-black text-slate-900 italic tracking-tighter">{totalStock} Units</p>
          </div>
        </Card>

        <Card className="p-6 rounded-[2.5rem] border-none bg-white shadow-sm ring-1 ring-slate-100 flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
             <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Low Stock Alerts</p>
            <p className="text-2xl font-black text-orange-600 italic tracking-tighter">{lowStockItems} Items</p>
          </div>
        </Card>

        <Card className="p-6 rounded-[2.5rem] border-none bg-emerald-600 shadow-xl shadow-emerald-900/10 flex items-center gap-5 text-white">
          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
             <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-emerald-100 tracking-widest">Asset Valuation</p>
            <p className="text-2xl font-black italic tracking-tighter">₹{totalValue.toLocaleString('en-IN')}</p>
          </div>
        </Card>
      </div>

      {/* 3. The Data Table Container */}
        <DataTable data={products} columns={columns} />
    </div>
  );
}