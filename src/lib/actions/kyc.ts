"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { KycStatus } from "@prisma/client"; 

export async function updateKycStatus(userId: string, status: KycStatus) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { 
        kycDocument: { 
          update: { 
            status: status 
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






export async function submitKycAction(formData: any) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    console.log(formData)

    // MongoDB mein Upsert (Create if not exists, else Update)
    const kyc = await prisma.kycDocument.upsert({
      where: { userId: userId },
      update: {
        aadharFrontUrl: formData.aadharFrontUrl,
        aadharBackUrl: formData.aadharBackUrl,
        panUrl: formData.panUrl,
        panNumber: formData.panNumber,
        passbookUrl: formData.passbookUrl,
        aadharNo:formData.aadharNo,
        photoUrl: formData.photoUrl,
        status: KycStatus.PENDING, // Re-submit par wapas pending ho jaye
      },
      create: {
        userId: userId,
        aadharFrontUrl: formData.aadharFrontUrl,
        aadharBackUrl: formData.aadharBackUrl,
        panUrl: formData.panUrl,
        panNumber: formData.panNumber,
        passbookUrl: formData.passbookUrl,
        photoUrl: formData.photoUrl,
        aadharNo:formData.aadharNo,
        status: KycStatus.PENDING,
      },
    });

    // Admin panel aur Dashboard ko refresh karne ke liye
    revalidatePath("/dashboard/kyc");
    revalidatePath("/admin/kyc-approvals");

    return { success: true, data: kyc };
  } catch (error) {
    console.error("KYC_SUBMIT_ERROR", error);
    return { success: false, error: "Database update failed" };
  }
}

export async function updateKycStatus2(userId: string, status: KycStatus) {
  try {
    const session = await auth();
    // Yahan role check zaroor karein (kyunki humne role hataya hai, toh isey session base rakhein)
    if (!session) return { success: false, error: "Unauthorized" };

    await prisma.kycDocument.update({
      where: { userId: userId },
      data: { status: status },
    });

    revalidatePath("/admin/kyc-approvals");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}