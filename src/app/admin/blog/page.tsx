import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { blogColumns } from "./columns";
import { PageHeader } from "@/components/admin/page-header";
export default async function AdminBlogPage() {
  // Database se fresh posts fetch karna
  const posts = await prisma.post.findMany();

  return (
    <div className="p-6 space-y-6">


      <PageHeader
        title="Blog"
        buttonLink="/admin/blog/create"
        buttonText="Write New Post"
        description="Manage your Ayurveda training and business success stories."
        highlight="Articles"
        icon={<Plus size={18} />}
        
        
      />

      {/* Aapka DataTable Component */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <DataTable columns={blogColumns} data={posts} />
      </div>
    </div>
  );
}
