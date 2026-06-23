import { z } from "zod";

export const franchiseSignupSchema = z.object({
  // Step 1: Basic Profile
  franchiseType: z.string().min(1, "Select Franchise Type"),
  name: z.string().min(3, "Franchise Name is required"),
  ownerName: z.string().min(3, "Owner Name is required"),
  mobile: z
    .string()
    .regex(/^[0-9]{10}$/, "Must be a valid 10-digit mobile number"),
  email: z.string().email("Invalid email address"),
  panNo: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number format"),
  gstNo: z.string().optional(),

  // Step 2: Location & Credentials
  address: z.string().min(10, "Full address is required"),
  pinCode: z.string().length(6, "Pin code must be 6 digits"),
  state: z.string().min(1, "Select State"),
  district: z.string().min(1, "Select District"),
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  // Step 3: Banking Assets (From image_736505.png)
  // bankName: z.string().min(1, "Select Bank"),
  branch: z.string().min(2, "Branch name is required"),
  accountNo: z.string().min(9, "Invalid Account Number"),
  ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),

  // Terms check
  agreeTerms: z.literal(true, {
    message: "You must accept the terms & conditions",
  }),
});

export type FranchiseSignupValues = z.infer<typeof franchiseSignupSchema>;
