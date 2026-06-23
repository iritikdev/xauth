import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { blogColumns } from "./columns";
import { PageHeader } from "@/components/admin/page-header";
import { baseAdminUrl } from "@/lib/constants";
export default async function AdminBlogPage() {
  // Database se fresh posts fetch karna
  const posts = await prisma.post.findMany();

  return (
    <div className="space-y-6">


      <PageHeader
        title="Blog"
        buttonLink={`${baseAdminUrl}/blog/create`}
        buttonText="Write New Post"
        description="Manage your Ayurveda training and business success stories."
        highlight="Articles"
        icon={<Plus size={18} />}
        
        
      />

      {/* Aapka DataTable Component */}
        <DataTable columns={blogColumns} data={posts} />
    </div>
  );
}
