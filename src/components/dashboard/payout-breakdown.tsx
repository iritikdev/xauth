import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, UserCheck } from "lucide-react";
import { COMMISSION_PLAN } from "@/lib/commissions";

export function PayoutBreakdown({ purchaseAmount }: { purchaseAmount: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
        <div>
          <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Order Amount</p>
          <h3 className="text-2xl font-black text-slate-900">₹{purchaseAmount.toLocaleString()}</h3>
        </div>
        <TrendingUp className="text-emerald-500 w-8 h-8" />
      </div>

      <div className="rounded-[2rem] border border-slate-100 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-[10px] font-black uppercase">Level</TableHead>
              <TableHead className="text-[10px] font-black uppercase">Rate</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-right">Commission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {COMMISSION_PLAN.slice(0, 6).map((plan) => (
              <TableRow key={plan.level}>
                <TableCell className="font-bold text-slate-700">
                  {plan.level === 0 ? "Self (Cashback)" : `Level ${plan.level}`}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-100">
                    {(plan.percentage * 100)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-black text-slate-900">
                  ₹{(purchaseAmount * plan.percentage).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}