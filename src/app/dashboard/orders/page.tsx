import { getMyOrders } from "@/lib/actions/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  Zap
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

export default async function MyOrdersPage() {
  const orders = await getMyOrders();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "SHIPPED": return <Truck className="w-4 h-4 text-blue-500" />;
      case "PENDING": return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="p-6 space-y-8 ">
      <div className="flex flex-col gap-2">
        <PageHeader 
            title="My"
            description="Review your past purchases and track current orders in one place."
            highlight="Orders"
        />
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
          <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No orders found yet</p>
          <Link href="/shop">
            <Button className="mt-6 rounded-xl bg-emerald-600">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order: any) => (
            <div 
              key={order.id} 
              className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Package className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Order ID</p>
                    <p className="text-sm font-black text-slate-900 font-mono">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={cn(
                    "rounded-lg font-bold text-[10px] uppercase tracking-widest px-3 py-1",
                    order.status === "DELIVERED" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                  )}>
                    <span className="flex items-center gap-1.5">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </Badge>
                  <Badge variant="outline" className="rounded-lg text-[10px] font-bold border-slate-200">
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>

              {/* Card Content: Products Preview */}
              <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex -space-x-4 overflow-hidden">
                  {order.items.map((item: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="inline-block h-14 w-14 rounded-xl border-2 border-white bg-slate-100 p-2 shadow-sm relative group"
                    >
                      <img 
                        src={item.product.image} 
                        alt="" 
                        className="h-full w-full object-contain group-hover:scale-110 transition-transform" 
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="h-14 w-14 rounded-xl border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                {/* BV and Price Summary */}
                <div className="flex items-center gap-10">
                  <div className="text-center md:text-right">
                    <div className="flex items-center gap-1 text-emerald-600 mb-1 justify-center md:justify-end">
                      <Zap className="w-3 h-3 fill-current" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Business Volume</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 tracking-tighter">{order.totalBv} BV</p>
                  </div>

                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Value</p>
                    <p className="text-xl font-black text-slate-900 italic">₹{order.totalAmount}</p>
                  </div>

                  <Link href={`/shop/order-success/${order.id}`}>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}