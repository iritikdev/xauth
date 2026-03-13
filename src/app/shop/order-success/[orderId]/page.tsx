import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Zap, 
  ArrowRight, 
  FileText,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default async function OrderSuccessPage({ params }: { params: { orderId: string } }) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } }
  });

  if (!order) notFound();

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto text-center space-y-10">
        
        {/* Success Icon & Animation */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-24 w-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center relative">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 relative z-10" />
            <div className="absolute inset-0 bg-emerald-500/20 rounded-[2.5rem] animate-ping opacity-20" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900">
              Order <span className="text-emerald-500">Confirmed!</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Thank you for choosing <span className="font-bold text-slate-900 uppercase">Amaze Ayurveda</span>. 
              Your wellness journey starts here.
            </p>
          </div>
        </div>

        {/* Order Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Details</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase">Order ID</p>
              <p className="font-black text-slate-900 font-mono tracking-tighter">#{order.id.toUpperCase()}</p>
            </div>
            <div className="pt-4 border-t border-slate-200 flex justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Amount</p>
                <p className="font-black text-xl text-slate-900 italic">₹{order.totalAmount}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500 uppercase">Method</p>
                <p className="font-black text-sm text-emerald-600 uppercase italic">Cash on Delivery</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] rounded-[2rem] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Growth Update</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Potential Earnings</p>
                <p className="text-4xl font-black italic tracking-tighter">{order.totalBv} <span className="text-sm not-italic text-emerald-400 uppercase">BV</span></p>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">
                * Points will be added to your business wallet upon successful cash collection.
              </p>
            </div>
            <Zap className="absolute -bottom-8 -right-8 w-32 h-32 text-white/5 rotate-12" />
          </div>
        </div>

        {/* Next Steps / Roadmap */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 space-y-8">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">What's Next?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <p className="text-xs font-black uppercase tracking-tighter">Processing</p>
              <p className="text-[10px] text-slate-500 leading-tight">Our team is verifying your Ayurvedic stock.</p>
            </div>
            <div className="space-y-3">
              <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                <Truck className="w-5 h-5 text-slate-600" />
              </div>
              <p className="text-xs font-black uppercase tracking-tighter">Dispatch</p>
              <p className="text-[10px] text-slate-500 leading-tight">Your package will be handed to our Bihar courier partners.</p>
            </div>
            <div className="space-y-3">
              <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                <Home className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xs font-black uppercase tracking-tighter">Delivery</p>
              <p className="text-[10px] text-slate-500 leading-tight">Pay cash at your doorstep and earn BV instantly.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link href="/dashboard/orders">
            <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-200 font-black uppercase tracking-widest text-[10px] gap-3">
              <FileText className="w-4 h-4" /> View My Orders
            </Button>
          </Link>
          <Link href="/shop">
            <Button className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] gap-3 shadow-xl transition-all">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}