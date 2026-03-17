export const InsightItem = ({ item }: { item: any }) => (
  <div className="flex items-center gap-4 py-4 border-b border-slate-50">
    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
      <item.icon className="h-5 w-5 text-slate-400" />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        {item.label}
      </p>
      <p className="text-sm font-bold text-slate-900">{item.value}</p>
    </div>
  </div>
);