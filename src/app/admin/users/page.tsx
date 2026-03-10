import prisma from "@/lib/prisma";
import { ChevronLeft, ChevronRight, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserTable from "@/components/admin/UserTable";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const pageSize = 10;

  const totalUsers = await prisma.user.count();
  const totalPages = Math.ceil(totalUsers / pageSize);

  const users = await prisma.user.findMany({
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    include: {
      sponsor: { select: { name: true } },
      _count: { select: { downlines: true } }
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 pt-10 px-6">
      <div className="border-b border-slate-100 pb-8">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
          Partner <span className="text-emerald-600">Registry</span>
        </h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
          Listing {users.length} of {totalUsers} total associates
        </p>
      </div>

      {/* Passing users to the Client Component which will handle the Search */}
      <UserTable initialUsers={users} />

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-6">
        <div className="flex items-center gap-8">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Page {currentPage} of {totalPages}
          </div>
          
          <form 
            action={async (formData) => {
              "use server";
              const page = formData.get("jumpPage");
              if (page) redirect(`/admin/users?page=${page}`);
            }}
            className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"
          >
            <Hash size={12} className="text-slate-400" />
            <input 
              name="jumpPage"
              type="number" 
              min={1}
              max={totalPages}
              placeholder="Jump..."
              className="w-16 bg-transparent border-none focus:ring-0 text-sm font-black text-slate-900" 
            />
          </form>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/admin/users?page=${Math.max(1, currentPage - 1)}`}>
            <Button variant="outline" disabled={currentPage <= 1} className="h-12 rounded-xl border-slate-200 font-bold px-6">
              Prev
            </Button>
          </Link>
          <Link href={`/admin/users?page=${Math.min(totalPages, currentPage + 1)}`}>
            <Button variant="outline" disabled={currentPage >= totalPages} className="h-12 rounded-xl border-slate-200 font-bold px-6">
              Next
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}