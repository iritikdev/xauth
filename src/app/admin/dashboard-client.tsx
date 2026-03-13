"use client";
import React from "react";
import {
  Users,
  Package,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import StatCard from "./stats-card";
import ActivityItem from "./activity-item";
import { PageHeader } from "@/components/admin/page-header";

export default function AdminDashboardClient({
  stats,
  chartData,
  recentActivity,
}: any) {
  const router = useRouter();

  return (
    <div className="space-y-10 mx-10 my-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <PageHeader
          title="Welcome Back"
          highlight="Admin!"
          subtitle="Dashboard Overview"
          description="Here's a snapshot of your Swadeshi ecosystem's performance and insights."
        
        />
        <div className="flex gap-3">
          <Button
            onClick={() => router.refresh()}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold px-6 h-12"
          >
            <RefreshCw className="mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          icon={<IndianRupee />}
          color="emerald"
        />
        <StatCard
          title="Total Partners"
          value={stats.users}
          icon={<Users />}
          color="blue"
        />
        <StatCard
          title="Orders Today"
          value={stats.orders}
          icon={<Package />}
          color="orange"
        />
        <StatCard
          title="KYC Pending"
          value={stats.pending}
          icon={<Clock />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] bg-white">
          <CardHeader className="p-8 border-b">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 text-sm">
              Revenue Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#10b981"
                  strokeWidth={4}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white">
          <CardHeader className="p-8 border-b">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 text-sm">
              Live Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {recentActivity.map((order: any) => (
              <ActivityItem
                key={order.id}
                title="New Order"
                subtitle={`${order.user?.name} - ₹${order.total}`}
                time="Just now"
                icon={<CheckCircle2 className="text-emerald-500" />}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
