"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
 
  Zap, 
  User as UserIcon, 
  Loader2
} from "lucide-react";
import { markOrderAsDelivered } from "@/lib/actions/admin"; // Import action
import { toast } from "sonner";
import { useState } from "react";
import { distributeLevelIncome } from "@/lib/actions/commission";

export const orderColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <span className="font-mono text-[10px] font-bold">#{row.original.id.slice(-6).toUpperCase()}</span>,
  },
  {
    accessorKey: "user",
    header: "Customer",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
            <UserIcon size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-900 leading-none">{user?.name}</span>
            <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">@{user?.username}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalBv",
    header: "BV Points",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-emerald-600">
        <Zap size={12} className="fill-current" />
        <span className="text-xs font-black">{row.original.totalBv} BV</span>
      </div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => <span className="text-xs font-black text-slate-900 tracking-tighter italic">₹{row.original.totalAmount.toLocaleString()}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className={cn(
          "rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border-none",
          status === "DELIVERED" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
        )}>
          {status}
        </Badge>
      );
    },
  },
  // {
  //   id: "actions",
  //   header: "Action",
  //   cell: ({ row }) => {
  //     const order = row.original;
  //     const [loading, setLoading] = useState(false);

  //     const onDeliver = async () => {
  //       if (!confirm("क्या आप वाकई इस ऑर्डर को Delivered मार्क करना चाहते हैं? इससे यूजर के वॉलेट में BV क्रेडिट हो जाएगा।")) return;
        
  //       setLoading(true);
  //       const res = await markOrderAsDelivered(order.id);
  //       if (res.success) {
  //         if (order.status === "PAID") distributeLevelIncome(order.userId, 500)
  //         toast.success("Order Delivered", { description: "BV points have been credited to user wallet." });
  //       } else {
  //         toast.error("Error", { description: res.error });
  //       }
  //       setLoading(false);
  //     };

  //     return (
  //       <div className="flex items-center gap-2">
  //         {order.status !== "DELIVERED" ? (
  //           <Button 
  //             size="sm" 
  //             onClick={onDeliver}
  //             disabled={loading}
  //             className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase tracking-widest gap-2"
  //           >
  //             {loading ? "Processing..." : <><CheckCircle2 size={14} /> Deliver</>}
  //           </Button>
  //         ) : (
  //           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
  //             <CheckCircle2 size={12} /> Completed
  //           </span>
  //         )}
  //       </div>
  //     );
  //   },
  // },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const order = row.original;
      const [isProcessing, setIsProcessing] = useState(false);

      const onDeliver = async () => {
        // Confirm before processing
        const confirmMsg = "क्या आप इस ऑर्डर को Delivered मार्क करना चाहते हैं? इससे 15 लेवल्स तक इनकम डिस्ट्रीब्यूट हो जाएगी।";
        if (!window.confirm(confirmMsg)) return;
        
        setIsProcessing(true);
        try {
          // 1. Mark Order as Delivered in DB
          const res = await markOrderAsDelivered(order.id);
          
          if (res.success) {
            // 2. Trigger Level Income Distribution
            // Hum order ka totalAmount pass karenge (ya jitne par commission banna hai)
            const incomeRes = await distributeLevelIncome(order.userId, order.totalBv,order.id);
            console.log(".........",incomeRes)
            if (incomeRes.success) {
              toast.success("Success!", { 
                description: `Order delivered and level income distributed to ${incomeRes.success || 0} levels.` 
              });
            } else {
              toast.warning("Partial Success", { 
                description: "Order marked delivered, but income distribution failed. Please check logs." 
              });
            }
          } else {
            toast.error("Error", { description: res.error });
          }
        } catch (error) {
          toast.error("Critical Error", { description: "Something went wrong during the process." });
        } finally {
          setIsProcessing(false);
        }
      };

      return (
        <div className="flex items-center gap-2">
          {order.status !== "DELIVERED" ? (
            <Button 
              size="sm" 
              onClick={onDeliver}
              disabled={isProcessing}
              className="h-8 rounded-xl bg-slate-900 hover:bg-emerald-600 text-[10px] font-black uppercase tracking-widest gap-2 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} /> Deliver
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                    Dispatched
                </span>
            </div>
          )}
        </div>
      );
    },
  }
];

// Utility function (agar utils mein nahi hai toh yahan define kar dein)
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}