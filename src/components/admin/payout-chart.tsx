"use client";

import { 
  AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { format, subDays, isSameDay } from "date-fns";
import { useMemo } from "react";

export function PayoutChart({ transactions }: { transactions: any[] }) {
  // Last 7 days ka data process karein
  const chartData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), i);
      const dayTotal = transactions
        .filter(t => isSameDay(new Date(t.createdAt), date))
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        name: format(date, "EEE"), // Mon, Tue...
        amount: dayTotal,
      };
    }).reverse();
  }, [transactions]);

  return (
    <div className="h-[300px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
            dy={10}
          />
          <YAxis 
            hide 
            domain={['auto', 'auto']}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900 px-4 py-2 rounded-xl shadow-xl border border-slate-800">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                      {payload[0].payload.name} Total
                    </p>
                    <p className="text-lg font-black text-white italic">
                      ₹{payload[0].value?.toLocaleString()}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#10b981" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorAmt)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}