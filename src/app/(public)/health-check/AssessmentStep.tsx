// components/AssessmentStep.tsx
"use client"

import { UseFormReturn } from "react-hook-form"
import { AssessmentData } from "@/lib/validations/assessment"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface AssessmentStepProps {
  stepIndex: number
  form: UseFormReturn<AssessmentData>
}

export default function AssessmentStep({ stepIndex, form }: AssessmentStepProps) {
  const { register, formState: { errors }, setValue, watch } = form

  const selectedGoals = watch("goals") || []
  const selectedSymptoms = watch("symptoms") || []
  const selectedConditions = watch("conditions") || []
  const stressValue = watch("stressLevel") || 3

  const handleCheckboxGroup = (fieldName: "goals" | "symptoms" | "conditions", val: string, checked: boolean) => {
    const currentArray: string[] = watch(fieldName) || []
    if (checked) {
      setValue(fieldName, [...currentArray, val], { shouldValidate: true })
    } else {
      setValue(fieldName, currentArray.filter((x) => x !== val), { shouldValidate: true })
    }
  }

  switch (stepIndex) {
    case 0:
      return (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Basic Information</h2>
            <p className="text-xs text-muted-foreground">Provide baseline metabolic metrics.</p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="age">Age (Years)</Label>
              <Input id="age" type="number" {...register("age")} placeholder="e.g. 28" />
              {errors.age && <p className="text-xs font-semibold text-rose-500">{errors.age.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gender">Assigned Gender</Label>
              <select
                id="gender"
                {...register("gender")}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-xs font-semibold text-rose-500">{errors.gender.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" {...register("height")} placeholder="e.g. 174" />
              {errors.height && <p className="text-xs font-semibold text-rose-500">{errors.height.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" {...register("weight")} placeholder="e.g. 68" />
              {errors.weight && <p className="text-xs font-semibold text-rose-500">{errors.weight.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="activityLevel">Daily Activity Level</Label>
            <select
              id="activityLevel"
              {...register("activityLevel")}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select Activity Profile</option>
              <option value="sedentary">Sedentary (Little or no exercise)</option>
              <option value="lightly_active">Lightly Active (1-3 days/week regular movement)</option>
              <option value="moderately_active">Moderately Active (3-5 days/week intentional exercise)</option>
              <option value="very_active">Very Active (6-7 days/week intense workload)</option>
            </select>
            {errors.activityLevel && <p className="text-xs font-semibold text-rose-500">{errors.activityLevel.message}</p>}
          </div>
        </div>
      )

    case 1:
      const totalGoalsAvailable = [
        "More Energy", "Better Sleep", "Stress Management", "Weight Loss",
        "Weight Gain", "Better Digestion", "Stronger Immunity", "Hair Health",
        "Skin Health", "Joint Health"
      ]
      return (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Select Health Goals</h2>
            <p className="text-xs text-muted-foreground">Select all targets applicable to your lifestyle.</p>
          </div>

          <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2">
            {totalGoalsAvailable.map((goal) => {
              const isChecked = selectedGoals.includes(goal)
              return (
                <label
                  key={goal}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-sm font-semibold transition-all cursor-pointer ${
                    isChecked 
                      ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-400 shadow-sm" 
                      : "border-zinc-200/80 bg-white dark:bg-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => handleCheckboxGroup("goals", goal, !!checked)}
                    className="border-zinc-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <span>{goal}</span>
                </label>
              )
            })}
          </div>
          {errors.goals && <p className="text-xs font-semibold text-rose-500">{errors.goals.message}</p>}
        </div>
      )

    case 2:
      return (
        <div className="space-y-5 animate-fadeIn">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Lifestyle Architecture</h2>
            <p className="text-xs text-muted-foreground">Quantify your dynamic habits parameters.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="sleepHours">Sleep per Night (Hours)</Label>
              <Input id="sleepHours" type="number" {...register("sleepHours")} placeholder="e.g. 7" />
              {errors.sleepHours && <p className="text-xs font-semibold text-rose-500">{errors.sleepHours.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="waterIntake">Daily Water Intake (Litres)</Label>
              <Input id="waterIntake" type="number" step="0.1" {...register("waterIntake")} placeholder="e.g. 2.5" />
              {errors.waterIntake && <p className="text-xs font-semibold text-rose-500">{errors.waterIntake.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
              <select
                id="exerciseFrequency"
                {...register("exerciseFrequency")}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select Frequency</option>
                <option value="none">No functional training</option>
                <option value="1-2_days">1-2 days per week</option>
                <option value="3-4_days">3-4 days per week</option>
                <option value="5+_days">5+ days per week</option>
              </select>
              {errors.exerciseFrequency && <p className="text-xs font-semibold text-rose-500">{errors.exerciseFrequency.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="screenTime">Daily Screen Time (Hours)</Label>
              <Input id="screenTime" type="number" {...register("screenTime")} placeholder="e.g. 6" />
              {errors.screenTime && <p className="text-xs font-semibold text-rose-500">{errors.screenTime.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <Label>Perceived Stress Scale</Label>
              <span className="font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs dark:bg-emerald-950/50">Level {stressValue} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-emerald-500 dark:bg-zinc-800"
              value={stressValue}
              onChange={(e) => setValue("stressLevel", Number(e.target.value), { shouldValidate: true })}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              <span>Calm</span>
              <span>Moderate</span>
              <span>Severe Strain</span>
            </div>
          </div>
        </div>
      )

    case 3:
      const baselineSymptoms = [
        { id: "fatigue", label: "Chronic Fatigue" },
        { id: "brain_fog", label: "Cognitive Brain Fog" },
        { id: "poor_sleep", label: "Fragmented / Poor Sleep" },
        { id: "anxiety", label: "Anxiety / Nervous Tension" },
        { id: "acidity", label: "Hyper Acidity" },
        { id: "bloating", label: "Abdominal Bloating" },
        { id: "constipation", label: "Bowel Constipation" },
        { id: "gas", label: "Flatulence / Gas" },
        { id: "frequent_illness", label: "Frequent Infections / Illness" },
        { id: "hair_fall", label: "Acute Hair Fall" },
        { id: "dry_skin", label: "Epidermal Dry Skin" },
      ]
      return (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Symptom Assessment Matrix</h2>
            <p className="text-xs text-muted-foreground">Check all symptoms experienced consistently over the last 30 days.</p>
          </div>

          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
            {baselineSymptoms.map((sym) => {
              const isChecked = selectedSymptoms.includes(sym.id)
              return (
                <label
                  key={sym.id}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-xs font-semibold transition-all cursor-pointer ${
                    isChecked 
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10 text-emerald-950 dark:text-emerald-400" 
                      : "border-zinc-200/60 bg-white dark:bg-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => handleCheckboxGroup("symptoms", sym.id, !!checked)}
                    className="border-zinc-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <span>{sym.label}</span>
                </label>
              )
            })}
          </div>
        </div>
      )

    case 4:
      const baselineConditions = [
        { id: "pregnant", label: "Currently Pregnant / Lactating" },
        { id: "diabetes", label: "Diagnosed Diabetes Mellitus" },
        { id: "high_blood_pressure", label: "Chronic High Blood Pressure" },
        { id: "heart_disease", label: "Cardiovascular / Heart Disease" },
        { id: "taking_medications", label: "Taking Prescription Medications Daily" },
      ]
      return (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-rose-950 dark:text-rose-400">Clinical Safety Screen</h2>
            <p className="text-xs text-muted-foreground">Identify underlying physiological parameters to prevent contraindications.</p>
          </div>

          <div className="space-y-2">
            {baselineConditions.map((cond) => {
              const isChecked = selectedConditions.includes(cond.id)
              return (
                <label
                  key={cond.id}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-xs font-bold transition-all cursor-pointer ${
                    isChecked 
                      ? "border-rose-500 bg-rose-50/40 dark:bg-rose-950/10 text-rose-900 dark:text-rose-400" 
                      : "border-zinc-200/80 bg-white dark:bg-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => handleCheckboxGroup("conditions", cond.id, !!checked)}
                    className="border-zinc-300 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                  />
                  <span>{cond.label}</span>
                </label>
              )
            })}
          </div>
        </div>
      )

    default:
      return null
  }
}