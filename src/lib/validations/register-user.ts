import { z } from "zod"

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

    email: z
        .string()
        .email({ message: "Enter a valid email address" }),

    accountNo: z
        .string()
        .min(10, { message: "Account number must be at least 10 digits" })
        .regex(/^\d+$/, { message: "Account number must contain only digits" }),

    ifsc: z
        .string()
        .length(11, { message: "IFSC code must be exactly 11 characters" }),


    branch: z
        .string()
        .min(2, { message: "Branch name must be at least 2 characters" }),

    panNumber: z
        .string()
        .length(10, { message: "PAN must be exactly 10 characters" }),
    aadharNo: z
        .string()
        .length(12, { message: "Aadhar must be exactly 12 characters" })

})