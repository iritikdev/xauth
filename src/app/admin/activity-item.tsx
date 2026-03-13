export default function ActivityItem({ title, subtitle, time, icon }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-black uppercase tracking-tight text-slate-900">{title}</h4>
        <p className="text-[10px] font-bold text-slate-400">{subtitle}</p>
      </div>
      <span className="text-[9px] font-black text-slate-300 uppercase">{time}</span>
    </div>
  );
}