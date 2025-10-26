// lib/validations/auth.ts
import { z } from "zod"

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().regex(/^\d{10}$/, "Mobile must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type SignUpFormData = z.infer<typeof signUpSchema>