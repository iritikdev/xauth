"use client";

import React, { startTransition, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deactivateProduct, deleteProduct } from "@/lib/actions/product";
import { toast } from "sonner";

interface DeleteProductModalProps {
  productId: string;
  productName: string;
}

export function DeleteProductModal({ productId, productName }: DeleteProductModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeactivate = () => {
    
    startTransition(async () => {
      const res = await deactivateProduct(productId);

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer">
          <Trash2 size={14} /> Deactived Product
        </button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="rounded-[2.5rem] border-none bg-white p-10 shadow-2xl sm:max-w-[450px]">
        <AlertDialogHeader className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 mb-2">
            <AlertTriangle size={32} />
          </div>
          <AlertDialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">
            Confirm <span className="text-red-600">Deactivation</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 font-medium leading-relaxed">
            You are about to remove <span className="font-black text-slate-900">"{productName}"</span>. 
            This will deactivate the entry from the inventory and purge the image from Cloudinary.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
          <AlertDialogCancel className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 flex-1">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Prevent default close to handle async logic
              handleDeactivate();
            }}
            disabled={isDeleting}
            className="h-14 rounded-2xl bg-red-600 font-black uppercase text-[10px] tracking-widest text-white hover:bg-red-700 shadow-xl shadow-red-200 flex-1"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Deactivate Product"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}