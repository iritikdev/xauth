"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateCategory } from "@/lib/actions/category";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

export default function EditCategoryDialog({ category }: { category: any }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
          <Edit2 size={14} /> Edit Category
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] border-none bg-white p-10 shadow-2xl sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">
            Edit <span className="text-emerald-600">Category</span>
          </DialogTitle>
        </DialogHeader>

        <form
          action={async (formData) => {
            const res = await updateCategory(category.id, formData);
            if (res.success) {
              toast.success("Category updated successfully");
              setOpen(false);
            } else {
              toast.error(res.error);
            }
          }}
          className="space-y-6 pt-4"
        >
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Category Name
            </Label>
            <Input
              name="name"
              defaultValue={category.name}
              className="h-14 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500/20 font-bold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Description
            </Label>
            <Textarea
              name="description"
              defaultValue={category.description}
              className="min-h-[120px] rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 p-4 resize-none"
            />
          </div>

          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      className="w-full h-16 rounded-2xl bg-[#0f172a] hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-slate-900/10"
    >
      {pending ? "Saving Changes..." : "Save Changes"}
    </Button>
  );
}