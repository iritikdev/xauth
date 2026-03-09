"use client"

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownLeft, History, Plus, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WalletPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Balance Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 rounded-[3rem] bg-[#0f172a] overflow-hidden p-10 text-white shadow-2xl shadow-emerald-500/10"
      >
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-1">Available Balance</p>
              <h2 className="text-5xl font-black  tracking-tighter">₹45,280.00</h2>
            </div>
            <Wallet className="w-10 h-10 text-white/20" />
          </div>
          
          <div className="flex gap-4">
            <Button className="rounded-2xl bg-emerald-500 hover:bg-emerald-600 h-14 px-8 font-black uppercase tracking-widest text-[10px] gap-2">
              <Plus className="w-4 h-4" /> Add Money
            </Button>
            <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 h-14 px-8 font-black uppercase tracking-widest text-[10px] gap-2">
              <Send className="w-4 h-4" /> Withdraw
            </Button>
          </div>
        </div>
        
        {/* Background Decorative Rings */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatItem icon={<ArrowUpRight className="text-emerald-500" />} label="This Month Earnings" value="₹12,400" />
        <StatItem icon={<ArrowDownLeft className="text-red-500" />} label="Total Withdrawals" value="₹5,000" />
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <History className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Recent Activity</h3>
        </div>
        
        <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="p-0">
            <TransactionRow title="Level 3 Commission" date="Mar 08, 2026" amount="+ ₹450" type="CREDIT" />
            <TransactionRow title="Bank Withdrawal" date="Mar 05, 2026" amount="- ₹2,000" type="DEBIT" />
            <TransactionRow title="Level 1 Referral Bonus" date="Mar 01, 2026" amount="+ ₹1,200" type="CREDIT" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-sm">
      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function TransactionRow({ title, date, amount, type }: any) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center",
          type === "CREDIT" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {type === "CREDIT" ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="text-[10px] font-medium text-slate-400 uppercase">{date}</p>
        </div>
      </div>
      <p className={cn("font-black tracking-tight", type === "CREDIT" ? "text-emerald-600" : "text-slate-900")}>
        {amount}
      </p>
    </div>
  );
}