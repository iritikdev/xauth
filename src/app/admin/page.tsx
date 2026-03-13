import prisma from "@/lib/prisma";
import AdminDashboardClient from "./dashboard-client";

export default async function AdminDashboardPage() {
  // 1. Fetch Real Stats
  const [totalRevenue, userCount, ordersToday, 
    // pendingPayouts
  
  ] = await Promise.all([
    // prisma.order.aggregate({ _sum: { total: true }, where: { status: "COMPLETED" } }),
    prisma.user.count(),
    prisma.order.count({
      where: {
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }
    }),
    prisma.user.findMany({ // Dummy logic for example
       where: { kycDocument:{status: "PENDING"} } 
    })
  ]);

  // 2. Fetch Recent Activity
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true } } }
  });

  // 3. Mock Chart Data (In real app, group by date)
  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <AdminDashboardClient 
      stats={{
        revenue:  0,
        users: userCount,
        orders: ordersToday,
        pending: "0"
      }}
      chartData={chartData}
      recentActivity={recentOrders}
    />
  );
}