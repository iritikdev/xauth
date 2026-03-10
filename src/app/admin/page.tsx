"use client";

import React from "react";
import { 
  Users, 
  Package, 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2,
  AlertCircle
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
  ResponsiveContainer 
} from 'recharts';

// Mock Data for the Sales Chart
const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-10 mx-10 my-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Company Overview</p>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">
            Amaze <span className="text-emerald-500">Analytics</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest px-6 h-12">
            Download Report
          </Button>
          <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs uppercase tracking-widest px-6 h-12 shadow-lg shadow-emerald-600/20">
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="₹4,25,900" icon={<IndianRupee />} trend="+12.5%" color="emerald" />
        <StatCard title="New Partners" value="142" icon={<Users />} trend="+18%" color="blue" />
        <StatCard title="Orders Today" value="28" icon={<Package />} trend="+5%" color="orange" />
        <StatCard title="Pending Payouts" value="₹12,400" icon={<Clock />} trend="Critical" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Graph */}
        <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Weekly Revenue Flow</CardTitle>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <ActivityItem 
                title="New Order" 
                subtitle="Ritik Kumar - ₹1,250" 
                time="2m ago" 
                icon={<CheckCircle2 className="text-emerald-500" />} 
              />
              <ActivityItem 
                title="Withdrawal Req" 
                subtitle="Sumit Singh - ₹5,000" 
                time="14m ago" 
                icon={<AlertCircle className="text-orange-500" />} 
              />
              <ActivityItem 
                title="Rank Upgrade" 
                subtitle="Neha S. reached 'Star'" 
                time="1h ago" 
                icon={<TrendingUp className="text-blue-500" />} 
              />
            </div>
            <Button variant="ghost" className="w-full mt-8 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-emerald-600">
              View All Logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, icon, trend, color }: any) {
  const colors: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden group hover:scale-[1.02] transition-transform">
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl ${colors[color]}`}>
            {React.cloneElement(icon, { size: 24 })}
          </div>
          <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${colors[color]}`}>
            {trend}
          </span>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ title, subtitle, time, icon }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-black uppercase tracking-tight text-slate-900">{title}</h4>
        <p className="text-[10px] font-bold text-slate-400">{subtitle}</p>
      </div>
      <span className="text-[9px] font-black text-slate-300 uppercase">{time}</span>
    </div>
  );
}