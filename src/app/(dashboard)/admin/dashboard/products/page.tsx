import prisma from "@/lib/prisma";
import {
  Plus,
  Box,
  AlertTriangle,
  IndianRupee,
  Sparkles,
  Package,
} from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    where: {
      // isActive: true,
      category: { is: { id: { not: undefined } } },
    },
    include: {
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockItems = products.filter((p) => p.stock < 10).length;
  const totalValue = products.reduce(
    (acc, p) => acc + p.price * p.stock,
    0
  );
  const totalBV = products.reduce((acc, p) => acc + p.bvAmount * p.stock, 0);

  return (
    <div
      className="space-y-8"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Page header ── */}
      <PageHeader 
        title="Product Management"
        subtitle="Admin Console"
        description="Manage your catalog, track inventory, and configure BV points for
            every listing."

      />
    
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total inventory */}
        <StatCard
          icon={<Box size={18} strokeWidth={2} />}
          label="Total Inventory"
          value={`${totalStock.toLocaleString("en-IN")} units`}
          iconClass="bg-zinc-100 text-zinc-500"
        />

        {/* Low stock */}
        <StatCard
          icon={<AlertTriangle size={18} strokeWidth={2} />}
          label="Low Stock Alerts"
          value={`${lowStockItems} items`}
          valueClass={lowStockItems > 0 ? "text-red-500" : "text-zinc-900"}
          iconClass={
            lowStockItems > 0
              ? "bg-red-50 text-red-400 border-red-100"
              : "bg-zinc-100 text-zinc-400"
          }
        />

        {/* Asset value */}
        <StatCard
          icon={<IndianRupee size={18} strokeWidth={2} />}
          label="Asset Valuation"
          value={`₹${totalValue.toLocaleString("en-IN")}`}
          iconClass="bg-zinc-100 text-zinc-500"
        />

        {/* Total BV — emerald prestige card */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-900 p-6 shadow-xl">
          <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={13} className="text-emerald-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                Total BV in Stock
              </p>
            </div>
            <p
              className="text-3xl font-black text-emerald-100 leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {totalBV.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] font-bold text-emerald-700 mt-1.5 tracking-wide">
              Business Value Points
            </p>
          </div>
        </div>
      </div>

      {/* ── Data table ── */}
      {/* ── Data table ── */}
      {/* <div className="rounded-[2rem] border border-zinc-100 bg-white overflow-hidden shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-100 bg-zinc-50/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-400">
              <Package size={13} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Live Catalog
            </span>
          </div>
          <span className="text-[10px] font-black text-zinc-400 bg-white border border-zinc-200 rounded-2xl px-3 py-1">
            {products.length} products
          </span>
        </div>
      */}

        <DataTable data={products} columns={columns} />
        </div>
      // </div>
  );
}

/* ─── Stat card ──────────────────────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  iconClass = "",
  valueClass = "text-zinc-900",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconClass?: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm flex items-center gap-4">
      <div
        className={cn(
          "h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border border-transparent",
          iconClass
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1">
          {label}
        </p>
        <p className={cn("text-xl font-black leading-tight truncate", valueClass)}>
          {value}
        </p>
      </div>
    </div>
  );
}