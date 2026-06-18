import prisma from "@/lib/prisma";
import AdminDashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [revenueData, userCount, ordersToday, pendingKycCount] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: "DELIVERED" },
      }),
      prisma.user.count(),
      prisma.order.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.user.count({
        where: { kycDocument: { status: "PENDING" } },
      }),
    ]);

  const recentOrders = await prisma.order.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  // Top products by order volume
  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const chartData = [
    { name: "Mon", sales: 4000 },
    { name: "Tue", sales: 3000 },
    { name: "Wed", sales: 5000 },
    { name: "Thu", sales: 2780 },
    { name: "Fri", sales: 1890 },
    { name: "Sat", sales: 2390 },
    { name: "Sun", sales: 3490 },
  ];

  return (
    <AdminDashboardClient
      stats={{
        revenue: revenueData._sum.totalAmount || 0,
        users: userCount,
        orders: ordersToday,
        pending: pendingKycCount,
      }}
      chartData={chartData}
      recentActivity={recentOrders.map((o) => ({
        id: o.id,
        userName: o.user.name || "Unknown",
        amount: o.totalAmount,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
      }))}
    />
  );
}