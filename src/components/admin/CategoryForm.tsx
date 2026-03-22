"use client";

import { useFormStatus } from "react-dom";
import { createCategory } from "@/lib/actions/category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FolderPlus, Loader2, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── shared tokens ───────────────────────────────────────────── */
const field =
  "w-full h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400 transition-all";

const label =
  "block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1.5";

/* ─── component ───────────────────────────────────────────────── */
export default function CategoryForm({
  categories,
}: {
  categories: any[];
}) {
  return (
    <div
      className="rounded-[2rem] border border-zinc-100 bg-white p-7 shadow-sm"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-7">
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
          <FolderPlus size={14} strokeWidth={2} />
        </div>
        <h2 className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600">
          Add Category
        </h2>
      </div>

      <form
        action={async (formData) => {
          const res = await createCategory(formData);
          if (res?.error) toast.error(res.error);
          else {
            toast.success("Category created!");
            (document.getElementById("cat-form") as HTMLFormElement)?.reset();
          }
        }}
        id="cat-form"
        className="space-y-5"
      >
        {/* Title */}
        <div>
          <label className={label}>Title</label>
          <input
            name="name"
            placeholder="e.g. Health Care"
            required
            className={field}
          />
        </div>

        {/* Parent */}
        <div>
          <label className={cn(label, "flex items-center gap-1.5")}>
            <GitBranch size={10} className="text-zinc-400" />
            Parent Category
          </label>
          <Select name="parentId" defaultValue="none">
            <SelectTrigger className={cn(field, "flex items-center justify-between")}>
              <SelectValue placeholder="Root Category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-xl border-zinc-100">
              <SelectItem value="none" className="text-sm font-medium">
                Root Category
              </SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-sm font-medium">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div>
          <label className={label}>Description</label>
          <textarea
            name="description"
            placeholder="Briefly describe this category…"
            rows={3}
            className={cn(field, "h-auto py-3 resize-none leading-relaxed")}
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}

/* ─── submit button ──────────────────────────────────────────── */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.22em] transition-all flex items-center justify-center gap-2",
        pending
          ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
          : "bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm shadow-zinc-900/20 active:scale-[0.98]"
      )}
    >
      {pending ? (
        <>
          <Loader2 size={13} className="animate-spin" />
          Creating…
        </>
      ) : (
        <>
          <FolderPlus size={13} />
          Create Category
        </>
      )}
    </button>
  );
}