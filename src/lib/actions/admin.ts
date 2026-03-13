"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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