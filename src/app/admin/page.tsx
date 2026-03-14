import prisma from "@/lib/prisma";
import AdminDashboardClient from "./dashboard-client";
import { useSession } from "next-auth/react";

export const dynamic = "force-dynamic"; // Prerender error se bachne ke liye

export default async function AdminDashboardPage() {
  const {data: session} = useSession()
  // 1. Fetch Real Stats
  const [revenueData, userCount, ordersToday, pendingKycCount] = await Promise.all([
    // Aapke schema mein 'totalAmount' hai, 'total' nahi
    prisma.order.aggregate({ 
      _sum: { totalAmount: true }, 
      where: { status: "DELIVERED" } // Amaze Ayurveda mein DELIVERED hi completed hai
    }),
    prisma.user.count(),
    prisma.order.count({
      where: {
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }
    }),
    // FIX: Yahan sirf count lijiye, poora object array nahi
    prisma.user.count({ 
       where: { kycDocument: {status : "PENDING"} } // Schema field check karein (kycStatus ya kycDocument)
    })
  ]);

  // 2. Fetch Recent Activity
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { 
      user: { 
        select: { name: true } 
      } 
    }
  });

  // 3. Prepare Chart Data (Static for now)
  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  console.log(session?.user.role, "-> Admin Dashboard Access Attempt");
  return (
    <AdminDashboardClient 
      stats={{
        revenue: revenueData._sum.totalAmount || 0,
        users: userCount,
        orders: ordersToday,
        // FIX: Object ki jagah number/string bhej rahe hain
        pending: pendingKycCount.toString() 
      }}
      chartData={chartData}
      // Ensure karein recentActivity mein sirf zaroori strings hon
      recentActivity={recentOrders.map(order => ({
        id: order.id,
        userName: order.user.name || "Unknown",
        amount: order.totalAmount,
        status: order.status
      }))}
    />
  );
}