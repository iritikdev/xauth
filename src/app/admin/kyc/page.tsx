import prisma from "@/lib/prisma";
import { DataTable } from "@/components/data-table";
import { kycColumns } from "./columns";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function KycApprovalsPage() {
  // 1. Fetching ALL users who have a KYC document
  // Agar aapko sirf wahi users chahiye jinhone KYC submit kiya hai
  const usersWithKyc = await prisma.user.findMany({
    where: {
      kycDocument: {
        isNot: null // Sirf wahi dikhao jinhone KYC form bhara hai
      }
    },
    include: {
      kycDocument: true
    },
    orderBy: { 
      // Latest submissions pehle dikhane ke liye
      createdAt: "desc" 
    },
  });

  // Debugging: Check status counts
  console.log("Fetched", usersWithKyc);

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      
      <PageHeader 
        title="KYC"
        highlight="Management"
        description="Review and manage all KYC submissions (Pending, Verified, and Rejected)."
      />

      {/* Stats Summary (Optional but good for Admin) */}
      <div className="grid grid-cols-3 gap-4 mb-4">
         <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
            <p className="text-xl font-bold text-amber-600">
               {usersWithKyc.filter(u => u.kycDocument?.status === "PENDING").length}
            </p>
         </div>
         <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified</p>
            <p className="text-xl font-bold text-emerald-600">
               {usersWithKyc.filter(u => u.kycDocument?.status === "VERIFIED").length}
            </p>
         </div>
         <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rejected</p>
            <p className="text-xl font-bold text-red-600">
               {usersWithKyc.filter(u => u.kycDocument?.status === "REJECTED").length}
            </p>
         </div>
      </div>

        <DataTable 
          columns={kycColumns} 
          data={usersWithKyc} 
        />
    </div>
  );
}