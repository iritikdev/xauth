// components/MultiStepForm.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMultistepForm } from "@/hooks/useMultistepForm"
import { 
  AssessmentData, 
  Step1Schema, 
  Step2Schema, 
  Step3Schema, 
  Step4Schema, 
  Step5Schema 
} from "@/lib/validations/assessment"
import { calculateAssessment, AssessmentResults } from "@/lib/engine"
import ProgressIndicator from "./ProgressIndicator"
import AssessmentStep from "./AssessmentStep"
import ResultsDashboard from "./ResultsDashboard"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"

const STEP_SCHEMAS = [Step1Schema, Step2Schema, Step3Schema, Step4Schema, Step5Schema]

export default function MultiStepForm() {
  const [results, setResults] = useState<AssessmentResults | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AssessmentData>({
    mode: "all",
    defaultValues: {
      age: undefined,
      gender: undefined,
      height: undefined,
      weight: undefined,
      activityLevel: undefined,
      goals: [],
      sleepHours: undefined,
      waterIntake: undefined,
      exerciseFrequency: undefined,
      stressLevel: 3,
      screenTime: undefined,
      symptoms: [],
      conditions: [],
    },
  })

  const { currentStepIndex, step, isFirstStep, isLastStep, next, back, goTo } = useMultistepForm(STEP_SCHEMAS.length)

  const handleNextStep = async () => {
    // Dynamically target only keys matching current boundary schemas to trigger deep inline validations
    const currentSchema = STEP_SCHEMAS[currentStepIndex]
    const currentFields = Object.keys(currentSchema.shape) as Array<keyof AssessmentData>
    
    const isStepValid = await form.trigger(currentFields)
    if (isStepValid) {
      if (isLastStep) {
        form.handleSubmit(onFinalSubmit)()
      } else {
        next()
      }
    }
  }

  const onFinalSubmit = async (data: AssessmentData) => {
    setIsSubmitting(true)
    // Simulating deterministic network delay
    setTimeout(() => {
      const scoringCalculation = calculateAssessment(data)
      setResults(scoringCalculation)
      setIsSubmitting(false)
    }, 1500)
  }

  const handleResetQuiz = () => {
    form.reset()
    setResults(null)
    goTo(0)
  }

  if (results) {
    return <ResultsDashboard results={results} onReset={handleResetQuiz} />
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 px-2 sm:px-0 select-none">
      
      {/* Progress Matrix Tracking */}
      <ProgressIndicator currentStep={step} totalSteps={STEP_SCHEMAS.length} />

      {/* Main Structural Input Panel Card */}
      <Card className="rounded-[28px] border border-zinc-200/80 bg-white/90 backdrop-blur-xl shadow-xl overflow-hidden dark:bg-zinc-950 dark:border-zinc-800">
        <CardContent className="p-5 sm:p-7">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            
            {/* Contextual Input Boundary Mapping Layer */}
            <AssessmentStep stepIndex={currentStepIndex} form={form} />

            {/* Form Steering Navigation Interface Block Footer */}
            <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              {!isFirstStep && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={back}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 px-4"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                </Button>
              )}

              <Button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="h-11 flex-1 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 ml-auto min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Calculating Metrics...
                  </>
                ) : isLastStep ? (
                  "Generate Results"
                ) : (
                  <>
                    Continue <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}