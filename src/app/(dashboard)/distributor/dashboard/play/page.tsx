"use client";

import { useEffect, useState } from "react";
import { getCurrentMonthPurchaseBV } from "@/lib/actions/order";
import { Zap } from "lucide-react";

export default function MonthlyBVWidget() {
  const [bv, setBv] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBV() {
      const res = await getCurrentMonthPurchaseBV();
      if (res.success) {
        setBv(res.currentMonthBV);
      }
      setLoading(false);
    }
    fetchBV();
  }, []);

  return (
    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
          This Month's Purchase BV
        </p>
        <h3 className="text-2xl font-black text-emerald-900 mt-1">
          {loading ? "..." : `${bv} BV`}
        </h3>
      </div>
      <div className="h-10 w-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md">
        <Zap size={20} className="fill-white" />
      </div>
    </div>
  );
}