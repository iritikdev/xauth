"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowRightLeft, 
  History, 
  ShieldCheck, 
  TrendingUp,
  Download,
  Filter,
  Plus
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ComingSoon } from "@/components/comming-soon"

const transactions = [
  { id: "#TXN-9921", type: "credit", category: "Level Bonus", amount: 1250.00, date: "05 Mar, 2026", status: "Completed" },
  { id: "#TXN-9854", type: "credit", category: "Direct Referral", amount: 500.00, date: "03 Mar, 2026", status: "Completed" },
  { id: "#TXN-9812", type: "debit", category: "Bank Payout", amount: 5000.00, date: "01 Mar, 2026", status: "Processing" },
  { id: "#TXN-9740", type: "credit", category: "Team Performance", amount: 2100.50, date: "28 Feb, 2026", status: "Completed" },
]

export default function EWalletPage() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <ComingSoon />
    // <div className="max-w-6xl mx-auto p-6 space-y-8">
    //   {/* Header */}
    //   <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    //     <div>
    //       <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial Wallet</h1>
    //       <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Live Payout Gateway • Swadeshi Earnings</p>
    //     </div>
    //     <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 gap-2 font-bold hover:bg-slate-50 shadow-sm">
    //       <Download className="w-4 h-4" /> Download Statement
    //     </Button>
    //   </header>

    //   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
    //     {/* Main Balance Card (Glassmorphism) */}
    //     <Card className="lg:col-span-2 rounded-[3rem] border-none bg-slate-900 text-white p-10 relative overflow-hidden shadow-2xl">
    //       <div className="relative z-10 flex flex-col h-full justify-between">
    //         <div className="flex justify-between items-start">
    //           <div className="space-y-1">
    //             <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">Available Balance</p>
    //             <h2 className="text-5xl font-black tracking-tighter">₹24,850.50</h2>
    //           </div>
    //           <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
    //             <Wallet className="w-7 h-7 text-emerald-400" />
    //           </div>
    //         </div>

    //         <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
    //           <div>
    //             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Earned</p>
    //             <p className="text-xl font-bold">₹1,42,000</p>
    //           </div>
    //           <div>
    //             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Last Payout</p>
    //             <p className="text-xl font-bold">₹5,000</p>
    //           </div>
    //         </div>
    //       </div>
    //       {/* Decorative Circle */}
    //       <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-[80px] -mr-40 -mt-40" />
    //     </Card>

    //     {/* Quick Actions Card */}
    //     <Card className="rounded-[3rem] border-none shadow-xl bg-white p-8">
    //       <h3 className="text-lg font-black text-slate-900 mb-6">Quick Actions</h3>
    //       <div className="grid grid-cols-1 gap-4">
    //         <Button className="h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-lg shadow-emerald-200 gap-3 group">
    //           <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
    //           Request Payout
    //         </Button>
    //         <Button variant="outline" className="h-16 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 gap-3">
    //           <ArrowRightLeft className="w-5 h-5" />
    //           Transfer Funds
    //         </Button>
    //         <div className="mt-4 p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-center gap-4">
    //           <ShieldCheck className="w-6 h-6 text-orange-600" />
    //           <p className="text-[10px] font-bold text-orange-800 uppercase leading-tight">KYC must be verified to process bank withdrawals.</p>
    //         </div>
    //       </div>
    //     </Card>
    //   </div>

    //   {/* Transaction History Section */}
    //   <section className="space-y-6">
    //     <div className="flex items-center justify-between px-4">
    //       <div className="flex items-center gap-3">
    //         <History className="w-5 h-5 text-slate-400" />
    //         <h3 className="text-xl font-black text-slate-900">Recent Transactions</h3>
    //       </div>
    //       <div className="flex gap-2">
    //         {["all", "credit", "debit"].map((tab) => (
    //           <Button 
    //             key={tab}
    //             variant={activeTab === tab ? "default" : "ghost"}
    //             onClick={() => setActiveTab(tab)}
    //             className={cn(
    //               "h-8 rounded-full text-[10px] font-black uppercase tracking-widest",
    //               activeTab === tab ? "bg-slate-900 text-white" : "text-slate-500"
    //             )}
    //           >
    //             {tab}
    //           </Button>
    //         ))}
    //       </div>
    //     </div>

    //     <div className="space-y-3">
    //       {transactions.map((txn, i) => (
    //         <motion.div 
    //           initial={{ opacity: 0, y: 10 }}
    //           animate={{ opacity: 1, y: 0 }}
    //           transition={{ delay: i * 0.1 }}
    //           key={txn.id} 
    //           className="group flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-100 hover:shadow-lg hover:border-emerald-100 transition-all cursor-pointer"
    //         >
    //           <div className="flex items-center gap-4">
    //             <div className={cn(
    //               "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner",
    //               txn.type === "credit" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
    //             )}>
    //               {txn.type === "credit" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
    //             </div>
    //             <div>
    //               <h4 className="font-black text-slate-900 text-sm tracking-tight">{txn.category}</h4>
    //               <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{txn.id} • {txn.date}</p>
    //             </div>
    //           </div>
              
    //           <div className="text-right">
    //             <p className={cn(
    //               "text-lg font-black",
    //               txn.type === "credit" ? "text-emerald-600" : "text-slate-900"
    //             )}>
    //               {txn.type === "credit" ? "+" : "-"} ₹{txn.amount.toLocaleString()}
    //             </p>
    //             <Badge variant="outline" className={cn(
    //               "mt-1 rounded-lg text-[9px] font-black uppercase tracking-tighter",
    //               txn.status === "Processing" ? "border-orange-200 text-orange-600 bg-orange-50" : "border-slate-100 text-slate-400"
    //             )}>
    //               {txn.status}
    //             </Badge>
    //           </div>
    //         </motion.div>
    //       ))}
    //     </div>
    //   </section>
    // </div>
  )
}