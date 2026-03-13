"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
// 1. Prisma client se generated Enum ko import karein
import { KycStatus } from "@prisma/client"; 

// 2. Status type ko KycStatus se replace karein
export async function updateKycStatus(userId: string, status: KycStatus) {
  try {
    await prisma.user.update({
      where: { id: userId },
      // Note: Ensure 'kycDocument' is a relation in your schema
      data: { 
        kycDocument: { 
          update: { 
            status: status // Ab TypeScript error nahi dega
          } 
        } 
      },
    });

    revalidatePath("/admin/kyc");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update KYC status" };
  }
}