// components/ProgressIndicator.tsx
interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="w-full space-y-2 select-none">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <span>Step {currentStep} of {totalSteps}</span>
        <span className="font-mono text-zinc-900 dark:text-zinc-100">{percentage}% Complete</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}