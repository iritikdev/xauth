"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Tag,
  TrendingUp,
  Edit,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import { deleteProduct } from "@/lib/actions/product";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { DeleteProductModal } from "./DeleteProductModal";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ToggleProductStatusModal } from "./ToggleProductStatusModal";

export type ProductColumn = {
  id: string;
  name: string;
  price: number;
  discount: number;
  bvAmount: number;
  image: string;
  stock: number;
  categoryId: string;
  isActive: boolean;
  category?: { name: string };
};

/* ─── shared header label ─────────────────────────────────────── */
const ColHeader = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
    {children}
  </span>
);

/* ─── columns ─────────────────────────────────────────────────── */
export const columns: ColumnDef<ProductColumn>[] = [
  /* ── select ── */
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
        className="rounded-md border-zinc-300"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
        className="rounded-md border-zinc-300"
      />
    ),
  },

  /* ── product details ── */
  {
    accessorKey: "name",
    header: () => <ColHeader>Product</ColHeader>,
    cell: ({ row }) => {
      const p = row.original;
      return (
        <div className="flex items-center gap-3.5">
          <div className="relative h-11 w-11 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 shrink-0">
            <Image src={p.image} alt={p.name} fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[13px] font-black text-zinc-900 tracking-tight truncate capitalize">
              {p.name}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">
              <Tag size={9} strokeWidth={2.5} />
              {p.category?.name || "Uncategorized"}
            </span>
          </div>
        </div>
      );
    },
  },

  /* ── pricing ── */
  {
    accessorKey: "price",
    header: () => <ColHeader>MRP / Net</ColHeader>,
    cell: ({ row }) => {
      const mrp = row.original.price;
      const dp = mrp - (mrp * row.original.discount) / 100;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-black text-zinc-900 tabular-nums">
            ₹{dp.toFixed(2)}
          </span>
          <span className="text-[10px] font-medium text-zinc-400 line-through tabular-nums">
            ₹{mrp.toFixed(2)}
          </span>
        </div>
      );
    },
  },

  /* ── BV ── */
  {
    accessorKey: "bvAmount",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 hover:text-zinc-700 transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        BV Points
        <TrendingUp size={11} strokeWidth={2.5} />
      </button>
    ),
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1 tracking-[0.08em]">
        <Sparkles size={9} strokeWidth={2.5} className="text-emerald-500" />
        {row.getValue("bvAmount")} BV
      </span>
    ),
  },

  /* ── stock ── */
  {
    accessorKey: "stock",
    header: () => <ColHeader>Inventory</ColHeader>,
    cell: ({ row }) => {
      const stock = row.original.stock;
      const isLow = stock < 10;
      const pct = Math.min(stock, 100);
      return (
        <div className="flex flex-col gap-1.5 w-20">
          <span
            className={cn(
              "text-[13px] font-black tabular-nums",
              isLow ? "text-red-500" : "text-zinc-900"
            )}
          >
            {stock}
            <span className="text-[10px] font-medium text-zinc-400 ml-1">
              units
            </span>
          </span>
          <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isLow ? "bg-red-400" : "bg-emerald-400"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      );
    },
  },

  /* ── actions ── */
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded-xl border border-transparent text-zinc-300 hover:text-zinc-700 hover:bg-zinc-100 hover:border-zinc-200 transition-all duration-150">
              <MoreHorizontal size={15} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 rounded-2xl border-zinc-100 p-1.5 shadow-xl bg-white"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 px-3 py-2">
              Operations
            </DropdownMenuLabel>

            <DropdownMenuItem
              asChild
              className="rounded-xl text-[11px] font-bold uppercase tracking-widest px-3 py-2.5 cursor-pointer gap-2 text-zinc-700 focus:bg-zinc-50 focus:text-zinc-900"
            >
              <Link
                href={`/admin/dashboard/products/${product.id}/edit`}
                className="flex items-center gap-2"
              >
                <Edit size={13} strokeWidth={2} />
                Edit Details
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-zinc-50" />

            <ToggleProductStatusModal
  productId={product.id}
  productName={product.name}
  isActive={product.isActive} // Pass true/false status from db
/>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];