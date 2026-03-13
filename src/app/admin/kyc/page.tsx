import prisma from "@/lib/prisma";
import { DataTable } from "@/components/data-table";
import { kycColumns } from "./columns";
import { PageHeader } from "@/components/admin/page-header";
export default async function KycApprovalsPage() {
  const pendingUsers = await prisma.user.findMany({
    where: { 
        kycDocument: {
            status: "PENDING"
        },
     },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6">
      
      <PageHeader 
        title="KYC"
        highlight="Approvals"
        description="Review and manage pending KYC documents submitted by associates."
      />

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
        <DataTable 
          columns={kycColumns} 
          data={pendingUsers} 
        />
      </div>
    </div>
  );
}