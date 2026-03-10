"use client";

import { useFormStatus } from "react-dom";
import { createCategory } from "@/lib/actions/category";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FolderPlus } from "lucide-react";

export default function CategoryForm({ categories }: { categories: any[] }) {
  return (
    <Card className="p-8 rounded-[2.5rem] border-none shadow-2xl bg-white space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <FolderPlus className="text-emerald-500 w-5 h-5" />
        <h2 className="font-black uppercase text-sm tracking-tight italic">Add Category</h2>
      </div>
      
      <form action={async (formData) => {
        const res = await createCategory(formData);
        if (res?.error) toast.error(res.error);
        else {
          toast.success("Category Created");
          (document.getElementById("cat-form") as HTMLFormElement)?.reset();
        }
      }} id="cat-form" className="space-y-5">
        
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-slate-400">Title</Label>
          <Input name="name" placeholder="Health Care" required className="h-12 rounded-xl bg-slate-50" />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-slate-400">Parent</Label>
          <Select name="parentId" defaultValue="none">
            <SelectTrigger className="h-12 rounded-xl bg-slate-50">
              <SelectValue placeholder="Root" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="none">Root Category</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-slate-400">Description</Label>
          <Textarea name="description" className="min-h-[100px] rounded-xl bg-slate-50" />
        </div>

        <SubmitButton />
      </form>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      disabled={pending}
      className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px]"
    >
      {pending ? "Syncing..." : "Create Category"}
    </Button>
  );
}