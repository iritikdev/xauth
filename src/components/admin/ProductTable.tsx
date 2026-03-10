"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit3, Trash2, MoreHorizontal, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductTable({ products }: { products: any[] }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="border-slate-100 hover:bg-transparent">
            <TableHead className="w-[400px] text-[10px] font-black uppercase tracking-widest text-slate-400 pl-8 h-16">Product Details</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Financials</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
              <TableCell className="pl-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 uppercase italic tracking-tight">{product.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BV: {product.bvAmount} Points</span>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase px-3 py-1">
                  {product.category?.name || "Uncategorized"}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900">₹{product.price}</span>
                  <span className="text-[10px] text-slate-400 line-through font-bold">MRP ₹{product.mrp}</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-orange-500 animate-pulse'}`} />
                  <span className="text-xs font-black text-slate-700">{product.stock} In Stock</span>
                </div>
              </TableCell>

              <TableCell className="text-right pr-8">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 hover:text-emerald-600 hover:border-emerald-200">
                    <Edit3 size={16} />
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 hover:text-red-500 hover:border-red-200">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {products.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
            <Package className="text-slate-200 w-8 h-8" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic">No products found in database</p>
        </div>
      )}
    </div>
  );
}