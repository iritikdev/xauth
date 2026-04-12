"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { KycCellAction } from "./cell-action"; // Same folder se import
import {  Eye, FileText, CreditCard, Landmark } from "lucide-react";
import Link from "next/link";

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
    header: "Verify Documents",
    id: "documents",
    cell: ({ row }) => {
      const doc = row.original.kycDocument;
      
      // Helper component for document links
      const DocLink = ({ url, label, icon: Icon }: any) => (
        url ? (
          <Link 
            href={url} 
            target="_blank" 
            className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg transition-colors border border-emerald-100"
          >
            <Icon size={12} />
            {label}
            <Eye size={10} className="ml-0.5 opacity-50" />
          </Link>
        ) : (
          <span className="text-[10px] font-bold text-slate-300 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 flex items-center gap-1.5">
            <Icon size={12} />
            {label} (N/A)
          </span>
        )
      );

      return (
        <div className="flex flex-wrap gap-2">
          <DocLink url={doc?.aadharFrontUrl} label="Aadhar Front" icon={FileText} />
          <DocLink url={doc?.aadharBackUrl} label="Aadhar Back" icon={FileText} />
          <DocLink url={doc?.panUrl} label="PAN Card" icon={CreditCard} />
          <DocLink url={doc?.passbookUrl} label="Bank/Passbook" icon={Landmark} />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.kycDocument.status;
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
    <KycCellAction data={row.original} /> 
  ),
},
];