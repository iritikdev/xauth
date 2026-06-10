// components/ResultsDashboard.tsx
import { AssessmentResults } from "@/lib/engine"
import HealthScoreCard from "./HealthScoreCard"
import RecommendationCard from "./RecommendationCard"
import { AlertTriangle, RotateCcw, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResultsDashboardProps {
  results: AssessmentResults
  onReset: () => void
}

export default function ResultsDashboard({ results, onReset }: ResultsDashboardProps) {
  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto text-zinc-900 dark:text-zinc-100 select-none">
      
      {/* Disclaimer Box */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:bg-amber-950/20 dark:border-amber-900/60 flex gap-3 items-start">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-normal font-medium text-amber-900 dark:text-amber-400">
          <strong>Medical Disclaimer:</strong> This health-tech tool is strictly informational and does not constitute clinical diagnosis or prescriptive medical advice. Recommendations contain natural and dietary herbal products. Always consult a healthcare professional before altering dietary protocols.
        </div>
      </div>

      {/* Hero Core Overall Display */}
      <div className="rounded-[32px] border-0 bg-zinc-950 text-white p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_45%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">Wellness Analytics</span>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">Your Assessment Blueprint</h1>
            <p className="text-xs text-zinc-400 font-medium max-w-md">Consolidated index tracking baseline systemic data matrices.</p>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl min-w-[200px]">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Overall Score</span>
              <span className="text-4xl font-black font-mono tracking-tighter text-emerald-400 mt-1">{results.overallScore}</span>
            </div>
            <div className="text-xs font-semibold leading-tight text-zinc-300 border-l border-zinc-800 pl-4 py-1">
              {results.overallScore >= 75 ? "Excellent Systemic Vigor" : results.overallScore >= 50 ? "Balanced Functional Baseline" : "Targeted Alignment Critical"}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Matrix Warning Conditional Block */}
      {results.triggerSafetyWarning && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 dark:bg-rose-950/20 dark:border-rose-900/60 flex gap-3 items-start animate-pulse">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-normal font-bold text-rose-950 dark:text-rose-400">
            Safety Warning: You indicated active underlying clinical conditions or pregnancy. Natural herbal active principles like Ashwagandha, Brahmi, or Triphala can heavily alter pharmaceutical mechanisms or uterine metrics. Secure formal expert validation before usage.
          </div>
        </div>
      )}

      {/* Category Grid Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400">Functional Category Vectors</h3>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
          {results.categories.map((cat) => (
            <HealthScoreCard key={cat.slug} category={cat} />
          ))}
        </div>
      </div>

      {/* Twin Dynamic Component Matrix Breakdown Rows */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column Suggestions List */}
        <div className="md:col-span-1 space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400">Lifestyle Corrections</h3>
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-3.5 h-full">
            {results.suggestions.map((sug, i) => (
              <div key={i} className="flex gap-2.5 items-start text-xs font-medium leading-relaxed">
                <Lightbulb className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{sug}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column Supplement Recommendation Catalog Grid */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400">Targeted Botanical Supplements</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {results.recommendations.map((prod) => (
              <RecommendationCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </div>

      {/* Reset Action Area */}
      <div className="pt-4 flex justify-center">
        <Button onClick={onReset} variant="outline" className="h-10 rounded-xl text-xs font-bold uppercase tracking-wider border-zinc-200">
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Retake Assessment
        </Button>
      </div>

    </div>
  )
}