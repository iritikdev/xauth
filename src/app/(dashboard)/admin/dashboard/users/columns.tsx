"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  User,
  MapPin,
  Network,
  ShieldCheck,
  Copy,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { console } from "inspector";
import { cn } from "@/lib/utils";

// Define the type based on your Prisma Model
export type UserRegistry = {
  id: string;
  name: string | null;
  username: string;
  email: string;
  mobile: string;
  photoUrl: string | null;
  district: string | null;
  state: string | null;
  sponsorId: string | null;
  kycDocument: {
    status: string;
  } | null;
  _count?: {
    downlines: number;
  };
  createdAt: Date;
};

export const columns: ColumnDef<UserRegistry>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Associate",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            {user.photoUrl ? (
              <Image
                src={user.photoUrl}
                alt={user.name || ""}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <User size={20} />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 uppercase italic text-xs tracking-tight">
              {user.name || "Unnamed Associate"}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
              @{user.username}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "mobile",
    header: "Contact",
    cell: ({ row }) => {
      const mobile = row.original.mobile;
      const email = row.original.email;

      return (
        <div className="flex flex-col gap-1.5">
          {/* Mobile Link */}
          <a 
            href={`tel:${mobile}`}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-600 transition-colors group/phone w-fit"
          >
            <Phone size={12} className="text-slate-400 group-hover/phone:text-emerald-500 transition-colors" />
            {mobile}
          </a>

          {/* Email Link */}
          <a 
            href={`mailto:${email}`}
            className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 hover:text-emerald-500 lowercase italic transition-colors group/email w-fit"
          >
             <div className="h-1 w-1 rounded-full bg-slate-200 group-hover/email:bg-emerald-400 transition-colors" />
             {email}
          </a>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "location",
  //   header: "Region",
  //   cell: ({ row }) => {
  //     const district = row.original.district;
  //     const state = row.original.state;
  //     return (
  //       <div className="flex items-center gap-2 text-slate-600 italic">
  //         <MapPin size={14} className="text-slate-300" />
  //         <span className="text-xs font-bold uppercase tracking-tighter">
  //           {district ? `${district}, ${state}` : "Location Unset"}
  //         </span>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "sponsorId",
    header: "Sponsor",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="rounded-lg border-slate-200 bg-slate-50 text-[10px] font-black uppercase text-slate-500"
      >
        ID: {row.getValue("sponsorId") || "DIRECT"}
      </Badge>
    ),
  },
 {
    accessorKey: "kycDocument",
    header: "KYC Status",
    cell: ({ row }) => {
      // ✅ Type-safe status extraction
      const kyc = row.original.kycDocument;
      const status = kyc?.status || "NOT_SUBMITTED";

      return (
        <Badge
          variant="outline"
          className={cn(
            "rounded-lg border-slate-200 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 shadow-sm",
            status === "VERIFIED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
            status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-100" :
            status === "REJECTED" ? "bg-rose-50 text-rose-600 border-rose-100" :
            "bg-slate-50 text-slate-400"
          )}
        >
          {status}
        </Badge>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="rounded-lg border-slate-200 bg-slate-50 text-[10px] font-black uppercase text-slate-500"
      >
        {row.getValue("createdAt")
          ? new Date(row.getValue("createdAt")).toLocaleDateString()
          : "Date Unset"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 rounded-xl hover:bg-slate-100"
              >
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 rounded-2xl border-slate-100 p-2 shadow-2xl bg-white"
            >
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">
                Partner Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="rounded-xl font-bold text-xs uppercase tracking-widest px-3 py-2.5 cursor-pointer gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(user.username);
                  toast.success("Username copied");
                }}
              >
                <Copy size={14} /> Copy Username
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-50" />
              <DropdownMenuItem
                className="rounded-xl font-bold text-xs uppercase tracking-widest px-3 py-2.5 cursor-pointer"
                asChild
              >
                <Link href={`/admin/users/${user.username}`}>View Full Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl font-bold text-xs uppercase tracking-widest px-3 py-2.5 cursor-pointer"
                asChild
              >
                <Link href={`/admin/users/${user.username}/edit`}>Edit Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl font-bold text-xs uppercase tracking-widest px-3 py-2.5 cursor-pointer">
                Network Genealogy
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl font-bold text-xs uppercase tracking-widest px-3 py-2.5 cursor-pointer text-emerald-600 focus:bg-emerald-50 focus:text-emerald-600">
                Audit Wallet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
