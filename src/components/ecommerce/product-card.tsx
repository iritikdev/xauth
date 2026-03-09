"use client";

import Link from "next/link";
import { ShoppingCart, Zap, Eye } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductProps {
  id: string; // This ID is used for the URL
  name: string;
  price: number;
  bvAmount: number;
  image: string;
}

export function ProductCard({ id, name, price, bvAmount, image }: ProductProps) {
  return (
    <Card className="group border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white hover:shadow-2xl transition-all duration-500">
      {/* WRAP THE IMAGE IN A LINK */}
      <Link href={`/shop/${id}`} className="block relative aspect-square overflow-hidden bg-slate-100">
        <img 
          src={image} 
          alt={name} 
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
                <Eye className="w-6 h-6 text-white" />
            </div>
        </div>
        <Badge className="absolute top-4 left-4 bg-emerald-500 text-white border-none font-black text-[10px] px-3 py-1">
          {bvAmount} BV Points
        </Badge>
      </Link>
      
      <CardContent className="p-6">
        {/* WRAP THE TITLE IN A LINK */}
        <Link href={`/shop/${id}`}>
          <h3 className="text-lg font-black text-slate-900 tracking-tight italic hover:text-emerald-600 transition-colors cursor-pointer">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl font-black text-slate-900">₹{price}</span>
          <span className="text-[10px] text-slate-400 line-through font-bold">₹{price + 200}</span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button className="flex-1 h-12 rounded-2xl bg-[#0f172a] hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] gap-2">
          <ShoppingCart className="w-4 h-4" /> Add
        </Button>
        <Link href={`/shop/${id}`}>
            <Button variant="outline" className="h-12 w-12 rounded-2xl border-slate-200 text-slate-400 hover:text-emerald-500">
            <Zap className="w-4 h-4" />
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}