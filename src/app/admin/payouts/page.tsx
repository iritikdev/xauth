// app/admin/payouts/page.tsx
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { User, Clock, Landmark, CreditCard, Copy, History, ListFilter, AlertCircle } from "lucide-react";
import PayoutActions from "./payout-actions";
import Image from "next/image";
import { getTransactions } from "@/lib/actions/transaction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default async function AdminPayoutsPage() {
  const allRes = await getTransactions();
  const allTransactions = allRes.data || [];

  // Data Segregation
  const pendingPayouts = allTransactions.filter(t => t.status === "PENDING" && t.type === "DEBIT");
  const historyTransactions = allTransactions.filter(t => t.status !== "PENDING");

  return (
    <div className="min-h-screen pb-20">
      {/* --- PREMIUM HEADER --- */}
      <div className="">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-6xl font-[1000] tracking-tighter uppercase italic text-slate-900 leading-none">
              Payout
            </h1>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] ml-1">
              Command Center • {allTransactions.length} Total Records
            </p>
          </div>
          
          {/* Quick Stats on Mobile */}
          <div className="flex gap-4">
            <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
               <span className="block text-[8px] font-black text-emerald-600 uppercase">Pending</span>
               <span className="text-lg font-black text-slate-900">{pendingPayouts.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className=" mt-8">
        <Tabs defaultValue="pending" className="space-y-8">
          {/* --- TABS NAVIGATION --- */}
          <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl w-full max-w-md mx-auto grid grid-cols-2 border border-slate-200">
            <TabsTrigger value="pending" className="rounded-xl font-black uppercase text-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Clock size={12} className="mr-2" /> Pending Requests
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl font-black uppercase text-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <History size={12} className="mr-2" /> All History
            </TabsTrigger>
          </TabsList>

          {/* --- PENDING REQUESTS CONTENT --- */}
          <TabsContent value="pending" className="space-y-6">
            {pendingPayouts.length === 0 ? (
              <EmptyState message="No pending requests at the moment" />
            ) : (
              pendingPayouts.map((payout: any) => (
                <PayoutCard key={payout.id} payout={payout} isPending={true} />
              ))
            )}
          </TabsContent>

          {/* --- ALL HISTORY CONTENT --- */}
          <TabsContent value="history" className="space-y-6">
            {historyTransactions.length === 0 ? (
              <EmptyState message="No transaction history found" />
            ) : (
              historyTransactions.map((payout: any) => (
                <PayoutCard key={payout.id} payout={payout} isPending={false} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS FOR CLEANER CODE ---

function PayoutCard({ payout, isPending }: { payout: any; isPending: boolean }) {
  return (
    <div className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 p-6 md:p-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
        
        {/* 1. Profile & Primary Info */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 rounded-[1.2rem] bg-slate-50 border border-slate-100 overflow-hidden shadow-inner">
               <Image 
                alt="User" 
                src={payout.user.photoUrl || "/placeholder-user.png"} 
                fill 
                className="object-cover"
               />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic truncate">
                {payout.user?.name || "Anonymous Partner"}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  ID: {payout.user.username}
                </span>
                <div className="h-1 w-1 bg-slate-300 rounded-full" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {format(new Date(payout.createdAt), "dd MMM, yy")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 bg-slate-50 rounded-2xl px-5 py-3 border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Amount to Process</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter italic">₹{payout.amount.toLocaleString('en-IN')}</p>
            </div>
            {!isPending && (
              <div className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                payout.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
              )}>
                {payout.status}
              </div>
            )}
          </div>
        </div>

        {/* 2. Bank Credentials (Bento Style) */}
        <div className="w-full lg:max-w-sm bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl" />
           
           <div className="flex items-center gap-2 mb-4">
              <Landmark size={12} className="text-emerald-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Transfer Credentials</span>
           </div>

           <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <BankItem label="Account No" value={payout.user.accountNo} />
              <BankItem label="IFSC Code" value={payout.user.ifsc} />
              <div className="col-span-2">
                <BankItem label="UPI Virtual ID" value={payout.user.upiId} />
              </div>
           </div>
        </div>

        {/* 3. Action Buttons */}
        {isPending && (
          <div className="w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
            <PayoutActions transactionId={payout.id} />
          </div>
        )}
      </div>
    </div>
  );
}

function BankItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5 group cursor-pointer">
      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs font-black tracking-widest font-mono text-emerald-50 truncate max-w-[120px]">
          {value || "---"}
        </p>
        <Copy size={10} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-[3rem] py-20 px-6 text-center border border-slate-100 shadow-sm">
      <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
        <Clock className="h-8 w-8 text-slate-200" />
      </div>
      <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">{message}</p>
    </div>
  );
}