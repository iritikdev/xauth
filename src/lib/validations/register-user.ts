import { z } from "zod";

export const kycSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name must be under 100 characters" }),

  fatherName: z
    .string()
    .min(2, { message: "Father's name must be at least 2 characters" }),

  motherName: z
    .string()
    .min(2, { message: "Mother's name must be at least 2 characters" }),

  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),

  district: z
    .string()
    .min(2, { message: "District name must be at least 2 characters" }),

  state: z
    .string()
    .min(2, { message: "State name must be at least 2 characters" }),

  pincode: z
    .string()
    .length(6, { message: "Pin code must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "Pin code must contain only digits" }),

  mobile: z
    .string()
    .length(10, { message: "Mobile number must be exactly 10 digits" })
    .regex(/^[6-9]\d{9}$/, { message: "Enter a valid Indian mobile number" }),

  email: z.string().email({ message: "Enter a valid email address" }),

  accountNo: z
    .string()
    .min(9, { message: "Account number is too short" }) // Small banks/co-ops can have 9 digits
    .max(18, { message: "Account number is too long" })
    .regex(/^\d+$/, { message: "Account number must contain only digits" }),

  ifsc: z
    .string()
    .length(11, { message: "IFSC code must be exactly 11 characters" })
    // Use .toUpperCase() here to ensure validation passes regardless of input case
    .transform((val) => val.toUpperCase())
    .pipe(
      z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
        message: "Invalid IFSC format (e.g. SBIN0001234)",
      }),
    ),
  branch: z
    .string()
    .min(2, { message: "Branch name must be at least 2 characters" }),

  // Validates standard UPI formats like name@bank, mobile@upi, etc.
  upiId: z
    .string()
    .min(3, "UPI ID is required")
    .regex(
      /^[\w.-]+@[\w.-]+$/,
      "Please enter a valid UPI ID (e.g., name@bank)",
    ),

  panNumber: z
    .string()
    .length(10, { message: "PAN must be exactly 10 characters" })
    // Pattern: 5 alphabets, 4 digits, 1 alphabet (IT Dept Standard)
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
      message: "Invalid PAN format (e.g. ABCDE1234F)",
    }),

  aadharNo: z
    .string()
    .length(12, { message: "Aadhar must be exactly 12 characters" })
    .regex(/^\d{12}$/, { message: "Aadhar must contain only digits" }),

  nomineeName: z.string().min(3, "Nominee name is required"),
  nomineeRelation: z.enum([
    "Mother",
    "Father",
    "Son",
    "Wife",
    "Daughter",
    "Husband",
  ]),
  nomineeMobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  nomineeAadhaar: z.string().length(12, "Aadhaar must be 12 digits"),
});


export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});