// address.ts

import { z } from "zod";

export const addressFormSchema = z.object({
  receiverName: z.string().min(2, "Full name is required"),
  receiverMobile: z.string().regex(/^[0-9]{10}$/, "Must be a valid 10-digit mobile number"),
  addressLine: z.string().min(8, "Flat, House No. or Street details are required"),
  pinCode: z.string().length(6, "Pin code must be exactly 6 digits"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District/City is required"),
  landmark: z.string().optional(),
  addressType: z.enum(["HOME", "WORK", "OTHER"], {
    message: "Please select an address label",
  }),
   isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;