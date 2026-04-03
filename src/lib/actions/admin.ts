"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import bcrypt from "bcryptjs";

export async function markOrderAsDelivered(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.status === "DELIVERED") return { success: false, error: "Invalid Order" };

    await prisma.$transaction([
      // 1. Update Order
      prisma.order.update({
        where: { id: orderId },
        data: { status: "DELIVERED", paymentStatus: "PAID" }
      }),
      // // 2. Credit BV to User Wallet
      // prisma.user.update({
      //   where: { id: order.userId },
      //   data: { personalBv: { increment: order.totalBv } }
      // })
    ]);

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Update failed" };
  }
}


export async function updatePayoutStatus(transactionId: string, status: "COMPLETED" | "FAILED") {
  try {
    const session = await auth();
    // Ensure only ADMIN can access this (Check your user role logic)
    if (!session?.user ) { //|| session.user.role !== "ADMIN"
      return { success: false, error: "Unauthorized Access" };
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Transaction fetch karein
      const transaction = await tx.transaction.findUnique({
        where: { id: transactionId }
      });

      if (!transaction || transaction.status !== "PENDING") {
        throw new Error("Invalid Transaction");
      }

      // 2. Status Update karein
      const updatedTx = await tx.transaction.update({
        where: { id: transactionId },
        data: { status }
      });

      // 3. AGAR REJECT (FAILED) HUA TO REFUND KAREIN
      if (status === "FAILED") {
        await tx.wallet.update({
          where: { userId: transaction.userId },
          data: { balance: { increment: transaction.amount } }
        });

        // Ek naya credit log bhi create kar sakte hain 'Refund' ke naam se
        await tx.transaction.create({
          data: {
            userId: transaction.userId,
            amount: transaction.amount,
            type: "CREDIT",
            status: "COMPLETED",
            description: `Refund for Rejected Withdrawal #${transactionId.slice(-5)}`
          }
        });
      }

      return updatedTx;
    });

    revalidatePath("/admin/payouts");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


export async function changeUserSponsor(userId: string, newSponsorUsername: string) {
  try {
    // 1. Check if new sponsor exists
    const newSponsor = await prisma.user.findUnique({
      where: { username: newSponsorUsername }
    });

    if (!newSponsor) throw new Error("New sponsor not found.");

    // 2. Prevent Circular Reference (User cannot be their own sponsor or their downline's)
    // Simple check: user != newSponsor
    if (userId === newSponsor.id) {
      throw new Error("A user cannot be their own sponsor.");
    }

    // 3. Update the User
    await prisma.user.update({
      where: { id: userId },
      data: {
        sponsorId: newSponsor.username, // Hamare schema mein username reference hai
      }
    });

    revalidatePath("/admin/users");
    return { success: true, message: "Sponsorship updated successfully!" };

  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getUsernameInfo(username: string) {
  if (!username || username.length < 3) return null;
  const user = await prisma.user.findUnique({
    where: { username },
    select: { name: true }
  });
  return user;
}



export async function updateUserDetails(userId: string, formData: any) {
  try {
    const { kycData, ...userData } = formData;

    await prisma.$transaction([
      // Update User Main Table
      prisma.user.update({
        where: { id: userId },
        data: userData,
      }),
      // Update KYC Table
      prisma.kycDocument.upsert({
        where: { userId: userId },
        update: kycData,
        create: { ...kycData, userId: userId },
      }),
    ]);

    revalidatePath(`/admin/users/${userData.username}`);
    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}





export async function updateUserPassword(userId: string, newPassword: string) {
  try {
    // 1. Password ko hash karna zaroori hai
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword.trim(), salt);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }, 
    });

    return { success: true, message: "Password updated & encrypted!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}