"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { KycStatus } from "@prisma/client";
import { KycCellAction } from "./cell-action"; // Same folder se import

export const kycColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Associate Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-slate-900">{row.original.name}</span>
        <span className="text-xs text-slate-400">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "kycDocument.panNumber",
    header: "PAN Number",
    cell: ({ row }) => (
      <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">
        {row.original.kycDocument?.panNumber || "N/A"}
      </code>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.kycStatus as KycStatus;
      return (
        <Badge 
          className={
            status === "PENDING" ? "bg-amber-100 text-amber-700" : 
            status === "VERIFIED" ? "bg-emerald-100 text-emerald-700" : 
            "bg-red-100 text-red-700"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Review Actions",
    cell: ({ row }) => (
      <KycCellAction 
        userId={row.original.id} 
        docUrl={row.original.kycDocument?.documentUrl} 
      />
    ),
  },
];