"use client";

import { Layers, Tag, MoreHorizontal, Edit2, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCategory } from "@/lib/actions/category";
import { toast } from "sonner";
import EditCategoryDialog from "./EditCategoryDialog";

export default function CategoryList({ categories }: { categories: any[] }) {
  
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      const res = await deleteCategory(id);
      if (res.error) toast.error(res.error);
      else toast.success("Category removed from registry");
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Live Categories</span>
        <Layers className="w-4 h-4 text-slate-300" />
      </div>
      
      <div className="divide-y divide-slate-50">
        {categories.map((cat) => (
          <div key={cat.id} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                   <Tag size={18} className="text-slate-400" />
                </div>
                <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                     <span className="font-black text-slate-900 uppercase italic text-sm">{cat.name}</span>
                     {cat.parent && (
                       <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] px-2 h-4 uppercase font-bold">Sub-Category</Badge>
                     )}
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 tracking-tight">/{cat.slug}</span>
                </div>
             </div>

             <div className="flex items-center gap-4">
                {/* Visual indicator for products count */}
                <div className="hidden md:flex flex-col items-end px-4 border-r border-slate-100">
                  <span className="text-xs font-black text-slate-900">{cat._count.products}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Items</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-emerald-600 transition-all">
                       <MoreHorizontal size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl border-slate-100 p-2 shadow-2xl">
                    <EditCategoryDialog category={cat} />
                    <DropdownMenuItem 
                      className="rounded-xl gap-3 font-bold text-xs uppercase tracking-widest text-red-500 focus:text-red-600 focus:bg-red-50 py-3 cursor-pointer"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <Trash2 size={14} /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
             </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="bg-slate-50 h-16 w-16 rounded-3xl flex items-center justify-center mx-auto">
              <AlertTriangle className="text-slate-200" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">No Categories found in system</p>
          </div>
        )}
      </div>
    </div>
  );
}