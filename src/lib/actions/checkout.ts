"use server"

import prisma from "@/lib/prisma";
import { distributeCommissions } from "./payments";

export async function createOrder(userId: string, cartItems: any[], address: string) {
  try {

    const totalAmount = cartItems.reduce(
      (acc, item) => acc + (item.price * item.quantity),
      0
    );

    const totalBv = cartItems.reduce(
      (acc, item) => acc + (item.bvAmount * item.quantity),
      0
    );

    const order = await prisma.$transaction(async (tx) => {

      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          totalBv,
          address,
          status: "PENDING",

          items: {
            create: cartItems.map((item: any) => ({
              productName: item.name,   // required
              quantity: item.quantity,
              price: item.price,
              bv: item.bvAmount,        // required

              product: {
                connect: {
                  id: item.id
                }
              }
            }))
          }
        }
      });

      // Reduce Stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });

    // MLM Commission Distribution
    await distributeCommissions(order.id);

    return { success: true, orderId: order.id };

  } catch (error: any) {
    return { error: error.message };
  }
}