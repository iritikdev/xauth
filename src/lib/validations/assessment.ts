// schemas/assessment.ts
import { z } from "zod"

export const Step1Schema = z.object({
  age: z.coerce.number().min(12, "Must be at least 12 years old").max(110, "Invalid age"),
  gender: z.enum(["male", "female", "other"], ),
  height: z.coerce.number().min(100, "Minimum height is 100 cm").max(250, "Maximum height is 250 cm"),
  weight: z.coerce.number().min(30, "Minimum weight is 30 kg").max(300, "Maximum weight is 300 kg"),
  activityLevel: z.enum(["sedentary", "lightly_active", "moderately_active", "very_active"]),
})

export const Step2Schema = z.object({
  goals: z.array(z.string()).min(1, "Please choose at least one core health goal"),
})

export const Step3Schema = z.object({
  sleepHours: z.coerce.number().min(3, "Minimum hours is 3").max(16, "Maximum hours is 16"),
  waterIntake: z.coerce.number().min(1, "Minimum intake is 1 Litre").max(10, "Maximum intake is 10 Litres"),
  exerciseFrequency: z.enum(["none", "1-2_days", "3-4_days", "5+_days"]),
  stressLevel: z.coerce.number().min(1).max(5),
  screenTime: z.coerce.number().min(0, "Cannot be negative").max(24, "Maximum 24 hours"),
})

export const Step4Schema = z.object({
  symptoms: z.array(z.string()),
})

export const Step5Schema = z.object({
  conditions: z.array(z.string()),
})

export const AssessmentMasterSchema = z.object({
  ...Step1Schema.shape,
  ...Step2Schema.shape,
  ...Step3Schema.shape,
  ...Step4Schema.shape,
  ...Step5Schema.shape,
})

export type AssessmentData = z.infer<typeof AssessmentMasterSchema>