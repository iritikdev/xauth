// app/admin/blog/cell-action.tsx
"use client";

import { Edit, MoreHorizontal, Trash, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/lib/actions/blog";

export const CellAction = ({ data }: { data: any }) => {
  const router = useRouter();

  const onDelete = async () => {
    const confirm = window.confirm("Are you sure? This action is permanent.");
    if (!confirm) return;

    const res = await deletePost(data.id);
    if (res.success) {
      toast.success("Article deleted successfully.");
      router.refresh();
    } else {
      toast.error("Something went wrong.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl">
        <DropdownMenuLabel className="text-[10px] uppercase text-slate-400">Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => window.open(`/blog/${data.slug}`, "_blank")}>
          <ExternalLink className="mr-2 h-4 w-4 text-emerald-600" /> View Live
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/blog/edit/${data.id}`)}>
          <Edit className="mr-2 h-4 w-4 text-blue-600" /> Edit Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash className="mr-2 h-4 w-4" /> Delete Post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};