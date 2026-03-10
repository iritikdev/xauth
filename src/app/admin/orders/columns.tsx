"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Truck, Clock, XCircle, MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// / 1. Define the status type to match your Prisma Enum
export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

// 2. Define the nested User structure (from the .findMany include)
export interface OrderUser {
  name: string | null;
  username: string;
  mobile: string;
}

// 3. The Main Order Interface
export interface OrderColumn {
  id: string;
  totalAmount: number;
  totalBv: number;
  status: OrderStatus;
  paymentStatus: string;
  address: string;
  createdAt: Date;
  // This represents the "include: { user: true }" part of your query
  user: OrderUser; 
  // Optional: if you plan to show item counts in the table
  _count?: {
    items: number;
  };
}

export const orderColumns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    // cell: ({ row }) => <span className="font-mono font-bold text-xs">#{row.getValue("id").toString().slice(-6).toUpperCase()}</span>,
  },
  {
    accessorKey: "user.name",
    header: "Associate",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-black uppercase italic text-[11px] text-slate-900">{row.original.user?.name}</span>
        <span className="text-[10px] text-slate-400 font-bold">@{row.original.user?.username}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const config: any = {
        PENDING: { color: "bg-orange-50 text-orange-600 border-orange-100", icon: Clock },
        SHIPPED: { color: "bg-blue-50 text-blue-600 border-blue-100", icon: Truck },
        DELIVERED: { color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle2 },
        CANCELLED: { color: "bg-red-50 text-red-600 border-red-100", icon: XCircle },
      };
      const { color, icon: Icon } = config[status] || config.PENDING;
      return (
        <Badge className={`rounded-lg border px-2 py-0.5 font-black uppercase text-[9px] gap-1.5 shadow-none ${color}`}>
          <Icon size={10} /> {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => <span className="font-black text-slate-900">₹{row.original.totalAmount}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => <span className="text-[10px] font-bold text-slate-400">{format(new Object(row.getValue("createdAt")) as Date, "dd MMM yyyy")}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal size={16}/></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2">
          <DropdownMenuItem className="rounded-xl font-bold text-xs uppercase gap-2">
            <Eye size={14}/> View Details
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl font-bold text-xs uppercase gap-2 text-blue-600">
             Update to Shipped
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];