import { Card, CardContent } from "@/components/ui/card";
import React from "react";
export default function StatCard({ title, value, icon, trend, color }: any) {
  const colors: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden group hover:scale-[1.02] transition-transform">
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl ${colors[color]}`}>
            {React.cloneElement(icon, { size: 24 })}
          </div>
          <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${colors[color]}`}>
            {trend}
          </span>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}