"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Post } from "@prisma/client";
import { CellAction } from "./cell-action"; // Edit/Delete menu yahan hoga

export const blogColumns: ColumnDef<Post>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[300px]">
        <span className="font-bold text-slate-900 truncate">{row.original.title}</span>
        <span className="text-[10px] text-slate-400 font-mono tracking-tighter italic">
          {row.original.slug}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-[10px] uppercase font-black">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "published",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={row.original.published ? "bg-emerald-100 text-emerald-700 border-none" : "bg-slate-100 text-slate-600 border-none"}>
        {row.original.published ? "Live" : "Draft"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];