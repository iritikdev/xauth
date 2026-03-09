"use server"

import prisma from "@/lib/prisma";
import { distributeCommissions } from "./payments";


export async function createOrder(userId: string, cartItems: any[], address: string) {
  try {
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalBV = cartItems.reduce((acc, item) => acc + (item.bvAmount * item.quantity), 0);

    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          totalBV,
          address,
          status: "PAID", // Assuming payment is confirmed
          items: {
            create: cartItems.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });

      // 2. Reduce Stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return newOrder;
    });

    // 3. Trigger MLM Commission Distribution
    // We pass totalBV here instead of totalAmount to match your plan
    await distributeCommissions(order.id);

    return { success: true, orderId: order.id };
  } catch (error: any) {
    return { error: error.message };
  }
}