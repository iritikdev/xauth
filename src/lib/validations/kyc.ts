import { z } from "zod";

export const kycSchema = z.object({
  aadharFrontUrl: z.string().min(1, "Aadhaar front required"),
  aadharBackUrl: z.string().min(1, "Aadhaar back required"),
  panUrl: z.string().min(1, "PAN card required"),
  passbookUrl: z.string().min(1, "Passbook required"),
  photoUrl: z.string().min(1, "Profile photo required"),

  aadharNo: z
    .string()
    .regex(/^\d{12}$/, "Aadhaar must be 12 digits"),

  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
});