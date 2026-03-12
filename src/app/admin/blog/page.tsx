import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// Aapka existing DataTable import karein (path adjust karlein)
import { DataTable } from "@/components/data-table"; 
import { blogColumns } from "./columns";
export default async function AdminBlogPage() {
  // Database se fresh posts fetch karna
  const posts = await prisma.post.findMany();

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Blog <span className="text-emerald-600">Articles</span>
          </h1>
          <p className="text-slate-500 text-sm">
            Manage your Ayurveda training and business success stories.
          </p>
        </div>
        <Button asChild className="bg-[#0f172a] hover:bg-emerald-600 rounded-xl px-6 h-12 transition-all">
          <Link href="/admin/blog/create">
            <Plus className="mr-2 h-5 w-5" /> Write New Post
          </Link>
        </Button>
      </div>

      {/* Aapka DataTable Component */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <DataTable 
          columns={blogColumns} 
          data={posts} 
        />
      </div>
    </div>
  );
}