import prisma from "@/lib/prisma";
import { DataTable } from "../../../components/data-table";
import { columns } from "./column";
export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const totalUsers = await prisma.user.count();

const users = await prisma.user.findMany({
  include: {
    sponsor: { select: { name: true } },
    kycDocument: { select: { status: true } },
    _count: { select: { downlines: true } },
  },
  orderBy: { createdAt: "desc" },
});

const transformedUsers = users.map(user => ({
  ...user,
  kycDocument: user.kycDocument?.status || null,
}));

return (
  <div className="space-y-8 pb-20 pt-10 px-6">
    <div className="border-b border-slate-100 pb-8">
      <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
        Partner <span className="text-emerald-600">Registry</span>
      </h1>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
        Listing {transformedUsers.length} of {totalUsers} total associates
      </p>
    </div>

    {/* Passing users to the Client Component which will handle the Search */}
    <DataTable data={transformedUsers} columns={columns} />

      {/* Pagination Controls */}
      {/* <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-6">
        <div className="flex items-center gap-8">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Page {currentPage} of {totalPages}
          </div> */}

      {/* <form 
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
         */}

      {/* </div> */}
    </div>
  );
}
