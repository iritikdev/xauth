// app/page.tsx
import MultiStepForm from "./MultiStepForm"
import { ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-900 py-10 px-4 md:py-16 selection:bg-emerald-500/10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Main Branding Navigation Element */}
        <div className="text-center space-y-2 select-none">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-md dark:bg-white dark:text-zinc-950">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600">Amaze Diagnostics</p>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Systemic Wellness Assessment</h1>
          <p className="text-xs font-medium text-zinc-400 max-w-sm mx-auto leading-normal">
            Analyze your goals, metabolic habits, and symptom history to extract optimized botanical supplement protocols.
          </p>
        </div>

        {/* Wizard MultiStep Context Trigger */}
        <MultiStepForm />

      </div>
    </div>
  )
}