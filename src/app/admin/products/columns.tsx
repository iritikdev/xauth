"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  Package,
  Tag,
  TrendingUp,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";
import { DeleteProductModal } from "./DeleteProductModal";

export type ProductColumn = {
  id: string;
  name: string;
  price: number;
  discount: number;
  bvAmount: number;
  image: string;
  stock: number;
  category?: {
    name: string;
  };
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Product Details",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 relative rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 uppercase italic text-xs tracking-tight">
              {product.name}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Tag size={10} /> {product.category?.name || "Uncategorized"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Pricing (MRP/DP)",
    cell: ({ row }) => {
      const mrp = row.original.price;
      const discount = row.original.discount;
      const dp = mrp - (mrp * discount) / 100; // Distributor Price

      return (
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-900 italic tracking-tighter">
            ₹{dp.toFixed(2)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 line-through">
            MRP: ₹{mrp}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "bvAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        BV Value <TrendingUp className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] px-3 py-1">
        {row.getValue("bvAmount")} BV
      </Badge>
    ),
  },
  {
    accessorKey: "stock",
    header: "Inventory",
    cell: ({ row }) => {
      const stock = row.original.stock;
      const isLow = stock < 10;
      return (
        <div className="flex flex-col gap-1">
          <span
            className={`text-xs font-black italic ${isLow ? "text-red-500" : "text-slate-900"}`}
          >
            {stock} Units
          </span>
          <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${isLow ? "bg-red-500" : "bg-emerald-500"}`}
              style={{ width: `${Math.min(stock, 100)}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
    const product = row.original;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-slate-100 transition-colors">
            <MoreHorizontal className="h-4 w-4 text-slate-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-100 p-2 shadow-2xl bg-white">
          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">
            Operations
          </DropdownMenuLabel>
          
          <DropdownMenuItem className="rounded-xl font-bold text-xs uppercase tracking-widest px-3 py-2.5 cursor-pointer gap-2">
            <Edit size={14} /> Edit Details
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 bg-slate-50" />

          {/* Use the Custom Modal Component here */}
          <DeleteProductModal 
            productId={product.id} 
            productName={product.name} 
          />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
  },
];
