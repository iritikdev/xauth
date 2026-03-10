import prisma from "@/lib/prisma";
import { ShoppingBag, Truck, CheckCircle, Clock } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { orderColumns } from "./columns"; // You'll create this file in the same folder
import { Card } from "@/components/ui/card";

export default async function AdminOrdersPage() {
  // Fetch orders with associated User data
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          username: true,
          mobile: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Analytics for the SaaS Header
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const revenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-10 pb-10 pt-10 px-6">
      {/* SaaS Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Order Management</span>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
            Fulfillment <span className="text-blue-600">Hub</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-3">
            Tracking {orders.length} orders across the Swadeshi network
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-[2.5rem] border-none bg-white shadow-sm ring-1 ring-slate-100 flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
             <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Awaiting Action</p>
            <p className="text-2xl font-black text-slate-900 italic tracking-tighter">{pendingOrders} Pending</p>
          </div>
        </Card>

        <Card className="p-6 rounded-[2.5rem] border-none bg-blue-600 shadow-xl shadow-blue-900/10 flex items-center gap-5 text-white">
          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
             <Truck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-blue-100 tracking-widest">In Transit</p>
            <p className="text-2xl font-black italic tracking-tighter">
              {orders.filter(o => o.status === "SHIPPED").length} Dispatched
            </p>
          </div>
        </Card>

        <Card className="p-6 rounded-[2.5rem] border-none bg-white shadow-sm ring-1 ring-slate-100 flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
             <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Sales</p>
            <p className="text-2xl font-black text-slate-900 italic tracking-tighter">₹{revenue.toLocaleString('en-IN')}</p>
          </div>
        </Card>
      </div>

      {/* Order Table */}
        <DataTable data={orders} columns={orderColumns} />
    </div>
  );
}