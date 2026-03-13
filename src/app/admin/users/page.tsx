import prisma from "@/lib/prisma";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { PageHeader } from "@/components/admin/page-header";
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

  const transformedUsers = users.map((user) => ({
    ...user,
    kycDocument: user.kycDocument?.status || null,
  }));

  return (
    <div className="space-y-8 pb-20 pt-10 px-6">
      <PageHeader
        title="Partners "
        highlight="Registry"
        description={`Total Users: ${totalUsers}`}
      />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <DataTable data={transformedUsers} columns={columns} />
      </div>
    </div>
  );
}
