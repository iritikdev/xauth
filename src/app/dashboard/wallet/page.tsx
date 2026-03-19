"use client"

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownLeft, History, Plus, Send, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// Import your server actions (Hum ise niche create karenge)
import { getWalletData } from "@/lib/actions/wallet";
import { AddMoneyModal } from "./add-money-modal";
import { WithdrawMoneyModal } from "./withdraw-money-modal";

export default function WalletPage() {
  const [data, setData] = useState<{ balance: number; transactions: any[] } | null | undefined>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    const res = await getWalletData();
    if (res.success) setData(res.data);
    setLoading(false);
};






  useEffect(() => {
  async function fetchData() {
    try {
      const res = await getWalletData();
      
      if (res.success && res.data) {
        // Sirf tab set karein jab data sach mein exist karta ho
        setData(res.data);
      } else {
        toast.error(res.error || "Failed to load wallet data");
        setData({ balance: 0, transactions: [] }); // Fallback data
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  // Monthly stats logic (Simple filter example)
  const earnings = data?.transactions
    .filter(t => t.type === "CREDIT")
    .reduce((acc, curr) => acc + curr.amount, 0) || 0;

  const withdrawals = data?.transactions
    .filter(t => t.type === "DEBIT")
    .reduce((acc, curr) => acc + curr.amount, 0) || 0;

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Balance Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="relative h-64 rounded-[3rem] bg-[#0f172a] overflow-hidden p-10 text-white shadow-2xl shadow-emerald-500/10"
      >
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-1 italic">Amaze Swadeshi Balance</p>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                ₹{data?.balance?.toLocaleString('en-IN') || "0.00"}
              </h2>
            </div>
            <Wallet className="w-12 h-12 text-white/10" />
          </div>
          
          <div className="flex gap-4">
            
            <AddMoneyModal onRefresh={refreshData} />
            {/* <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 h-14 px-8 font-black uppercase tracking-widest text-[10px] gap-2 transition-all active:scale-95">
              <Send className="w-4 h-4" /> Withdraw
            </Button> */}
            <WithdrawMoneyModal balance={data?.balance ?? 0} onRefresh={refreshData}/>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatItem icon={<ArrowUpRight className="text-emerald-500" />} label="This Month Earnings" value={`₹${earnings.toLocaleString('en-IN')}`} />
        <StatItem icon={<ArrowDownLeft className="text-red-500" />} label="Total Withdrawals" value={`₹${withdrawals.toLocaleString('en-IN')}`} />
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Recent Activity</h3>
          </div>
          <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-emerald-600">View All</Button>
        </div>
        
        <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white border border-slate-100">
          <CardContent className="p-0">
            {data?.transactions && data.transactions.length > 0 ? (
                data.transactions.map((t) => (
                    <TransactionRow 
                        key={t.id}
                        title={t.description} 
                        date={new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} 
                        amount={`${t.type === "CREDIT" ? "+" : "-"} ₹${t.amount}`} 
                        type={t.type} 
                        status={t.status}
                    />
                ))
            ) : (
                <div className="p-10 text-center text-slate-400 font-medium">No transactions yet.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Sub-components remains mostly same but added Status Badge
function TransactionRow({ title, date, amount, type, status }: any) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm",
          type === "CREDIT" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {type === "CREDIT" ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
        </div>
        <div>
          <p className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-[9px] font-bold text-slate-400 uppercase">{date}</p>
            <span className={cn(
                "text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase",
                status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : 
                status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
            )}>{status}</span>
          </div>
        </div>
      </div>
      <p className={cn("font-black tracking-tighter text-lg", type === "CREDIT" ? "text-emerald-600" : "text-slate-900")}>
        {amount}
      </p>
    </div>
  );
}

function StatItem({ icon, label, value }: any) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] transition-all hover:shadow-md">
      <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner">{icon}</div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-2xl font-[1000] text-slate-900 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}