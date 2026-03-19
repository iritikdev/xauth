// app/admin/payouts/page.tsx
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { User, Clock, Landmark, CreditCard, Copy } from "lucide-react";
import PayoutActions from "./payout-actions";
import Image from "next/image";

export default async function AdminPayoutsPage() {
  // PENDING withdrawals fetch karein with User & KYC details
  const pendingPayouts = await prisma.transaction.findMany({
    where: { status: "PENDING", type: "DEBIT" },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        include: {
          kycDocument: true // Ensure aapke schema mein user -> kyc relation hai
        }
      }
    }
  });

  return (
    <div className="p-8 space-y-10 ">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-[1000] tracking-tighter uppercase italic text-slate-900">
          Payout <span className="text-emerald-600">Control</span>
        </h1>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
          Review and process associate withdrawals
        </p>
      </div>

      <div className="grid gap-8">
        {pendingPayouts.length === 0 ? (
          <div className="bg-slate-50 rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200">
             <Clock className="mx-auto h-12 w-12 text-slate-300 mb-4" />
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No pending requests at the moment</p>
          </div>
        ) : (
          pendingPayouts.map((payout: any) => (
            <div key={payout.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row gap-10 items-start lg:items-center">
              
              {/* --- 1. User & Amount Info --- */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center text-white shadow-lg rounded-full">
                    <Image alt="User" src={payout.user.photoUrl} width={32} height={32}/>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tight uppercase italic">
                        {payout.user?.name || "Unknown User"}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        ID: #{payout.user.username} • {format(new Date(payout.createdAt), "dd MMM, hh:mm a")}
                    </p>
                  </div>
                </div>

                <div className="inline-block bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Requested Amount</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{payout.amount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* --- 2. Bank Details Card (The Helper) --- */}
              <div className=" bg-slate-50 rounded-[2rem] p-6 space-y-4 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400">
                    <Landmark size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Bank Credentials</span>
                </div>
                
                {payout.user ? (
                    <div className="space-y-3">
                        <div className="group cursor-pointer">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">A/C Number</p>
                            <div className="flex items-center justify-between">
                                <p className="font-black text-slate-900 tracking-widest">{payout.user.accountNo || "N/A"}</p>
                                <Copy size={12} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                            </div>
                        </div>
                        <div className="group cursor-pointer">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">IFSC Code</p>
                            <div className="flex items-center justify-between">
                                <p className="font-black text-slate-900 tracking-widest uppercase">{payout.user.ifsc || "N/A"}</p>
                                <Copy size={12} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                            </div>
                        </div>
                        <div className="group cursor-pointer">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">UPI</p>
                            <div className="flex items-center justify-between">
                                <p className="font-black text-slate-900 tracking-widest uppercase">{payout.user.upiId || "N/A"}</p>
                                <Copy size={12} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-[10px] font-bold text-red-400 uppercase italic">KYC Details Not Found!</p>
                )}
              </div>

              {/* --- 3. Action Buttons --- */}
              <div className="w-full lg:w-auto">
                <PayoutActions transactionId={payout.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}