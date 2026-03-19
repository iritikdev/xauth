"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";

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
      // 2. Credit BV to User Wallet
      prisma.user.update({
        where: { id: order.userId },
        data: { totalBv: { increment: order.totalBv } }
      })
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