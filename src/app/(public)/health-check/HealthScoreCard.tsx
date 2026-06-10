// components/HealthScoreCard.tsx
import { CategoryScore } from "@/lib/engine"

export default function HealthScoreCard({ category }: { category: CategoryScore }) {
  const getStatusColor = (status: CategoryScore["status"]) => {
    switch (status) {
      case "Optimal": return "bg-emerald-500 text-emerald-950 dark:text-emerald-300"
      case "Moderate Risk": return "bg-amber-500 text-amber-950 dark:text-amber-300"
      case "High Attention": return "bg-rose-500 text-rose-950 dark:text-rose-300"
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 font-sans text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-3">
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider truncate max-w-[140px]">{category.name}</span>
        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${getStatusColor(category.status)}`}>
          {category.status}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black font-mono tracking-tighter">{category.score}</span>
        <span className="text-xs font-bold text-zinc-400">/100</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden dark:bg-zinc-800">
        <div 
          className={`h-full transition-all duration-500 ${
            category.score >= 75 ? "bg-emerald-500" : category.score >= 50 ? "bg-amber-500" : "bg-rose-500"
          }`}
          style={{ width: `${category.score}%` }}
        />
      </div>
    </div>
  )
}