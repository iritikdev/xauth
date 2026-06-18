import prisma from "@/lib/prisma";
import { DataTable } from "@/components/data-table";
import { columns, UserRegistry } from "./columns"; // ✅ Import the type
import { PageHeader } from "@/components/admin/page-header";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // ✅ Correctly await searchParams for Next.js 15
  const { page } = await searchParams;
  
  const users = await prisma.user.findMany({
    include: {
      kycDocument: {
        select: {
          status: true,
        },
      },
      _count: {
        select: { downlines: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // ✅ Transform data to match your UserRegistry type perfectly
  const transformedUsers: UserRegistry[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    mobile: user.mobile,
    photoUrl: user.photoUrl,
    district: user.district,
    state: user.state,
    sponsorId: user.sponsorId,
    // Ensure kycDocument matches the expected { status: string } | null
    kycDocument: user.kycDocument ? { status: user.kycDocument.status } : null,
    _count: {
      downlines: user._count.downlines,
    },
    createdAt: user.createdAt,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Partners"
        highlight=" Registry"
        subtitle="Live Directory"
        description="Manage and track your global associate network and their performance."
        showBackButton={true}
      />
      {/* ✅ Pass transformedUsers instead of raw Prisma output */}
      <DataTable data={transformedUsers} columns={columns} />
    </div>
  );
}