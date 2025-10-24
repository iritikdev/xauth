import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().length(12, { message: "Username must be 12 characters long" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters" }),
})