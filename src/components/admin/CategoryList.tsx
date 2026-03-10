import { Layers, Tag, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CategoryList({ categories }: { categories: any[] }) {
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
                       <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] px-2 h-4">Sub of {cat.parent.name}</Badge>
                     )}
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 tracking-tight">/{cat.slug}</span>
                </div>
             </div>
             <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-emerald-600">
                <MoreHorizontal size={18} />
             </Button>
          </div>
        ))}
      </div>
    </div>
  );
}