// components/RecommendationCard.tsx
import { Product } from "@/data/product"
import { ShieldCheck, ArrowRight } from "lucide-react"

export default function RecommendationCard({ product }: { product: Product }) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded dark:bg-emerald-950/30">
            {product.category}
          </span>
          <span className="text-[11px] font-medium text-zinc-400 font-mono">Supplement Core</span>
        </div>
        <h3 className="text-base font-black tracking-tight text-zinc-900 dark:text-zinc-100">{product.name}</h3>
        <p className="text-xs font-medium text-zinc-500 leading-normal">{product.description}</p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {product.ingredients.map((ing) => (
            <span key={ing} className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md dark:bg-zinc-800 dark:text-zinc-400">
              {ing}
            </span>
          ))}
        </div>
        <button className="h-9 w-full rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors">
          View Details <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}