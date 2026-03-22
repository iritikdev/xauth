"use client";

import {
  Layers,
  Tag,
  MoreHorizontal,
  Trash2,
  AlertTriangle,
  GitBranch,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCategory } from "@/lib/actions/category";
import { toast } from "sonner";
import EditCategoryDialog from "./EditCategoryDialog";
import { cn } from "@/lib/utils";

export default function CategoryList({
  categories,
}: {
  categories: any[];
}) {
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      const res = await deleteCategory(id);
      if (res.error) toast.error(res.error);
      else toast.success("Category removed from registry");
    }
  };

  return (
    <div
      className="rounded-[2rem] border border-zinc-100 bg-white overflow-hidden shadow-sm"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-100 bg-zinc-50/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-400">
            <Layers size={13} strokeWidth={2} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Live Categories
          </span>
        </div>
        <span className="text-[10px] font-black text-zinc-400 bg-white border border-zinc-200 rounded-2xl px-3 py-1">
          {categories.length} total
        </span>
      </div>

      {/* List */}
      <div className="divide-y divide-zinc-50">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="px-6 py-4 flex items-center justify-between group hover:bg-zinc-50/60 transition-colors duration-150"
          >
            {/* Left — icon + info */}
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "h-10 w-10 rounded-2xl flex items-center justify-center border shrink-0 transition-all duration-150",
                  cat.parent
                    ? "bg-zinc-50 border-zinc-200 text-zinc-400"
                    : "bg-emerald-50 border-emerald-200 text-emerald-500"
                )}
              >
                {cat.parent ? (
                  <GitBranch size={15} strokeWidth={2} />
                ) : (
                  <Tag size={15} strokeWidth={2} />
                )}
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-zinc-900 tracking-tight">
                    {cat.name}
                  </span>
                  {cat.parent && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.12em] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                      <GitBranch size={8} />
                      Sub
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-zinc-400">
                  /{cat.slug}
                </span>
              </div>
            </div>

            {/* Right — product count + actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end pr-4 border-r border-zinc-100">
                <span className="text-sm font-black text-zinc-900 tabular-nums">
                  {cat._count.products}
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-400">
                  Items
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-9 w-9 rounded-xl flex items-center justify-center border border-transparent text-zinc-300 hover:text-zinc-700 hover:bg-zinc-100 hover:border-zinc-200 transition-all duration-150">
                    <MoreHorizontal size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-44 rounded-2xl border-zinc-100 p-1.5 shadow-xl"
                >
                  <EditCategoryDialog category={cat} />
                  <DropdownMenuItem
                    className="rounded-xl gap-2.5 font-bold text-[11px] uppercase tracking-widest text-red-500 focus:text-red-600 focus:bg-red-50 py-2.5 cursor-pointer"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <Trash2 size={13} />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {categories.length === 0 && (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="h-14 w-14 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-zinc-300" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              No categories found in system
            </p>
          </div>
        )}
      </div>
    </div>
  );
}