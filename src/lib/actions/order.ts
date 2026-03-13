"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

export async function createOrder(cartItems: any[]) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { error: "Please login to place an order", status: 401 };
    }

    const userId = session.user.id;

    // 1. Fresh data fetch
    const productIds = cartItems.map(item => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    let runningTotalAmount = 0;
    let runningTotalBv = 0;

    // 2. Map data for OrderItems
    const orderItemsData = cartItems.map((item) => {
      const dbProduct = dbProducts.find(p => p.id === item.id);
      if (!dbProduct) throw new Error(`Product ${item.name} not found`);

      const unitPrice = dbProduct.price - (dbProduct.price * (dbProduct.discount / 100));
      runningTotalAmount += unitPrice * item.quantity;
      runningTotalBv += dbProduct.bvAmount * item.quantity;

      return {
        quantity: Number(item.quantity),
        price: unitPrice, 
        bv: dbProduct.bvAmount, 
        product: {
          connect: { id: dbProduct.id }
        }
      };
    });

    // 3. Create Order
    const order = await prisma.order.create({
      data: {
        totalAmount: runningTotalAmount,
        totalBv: runningTotalBv, 
        status: "PENDING",
        paymentStatus: "UNPAID",
        address: (session.user as any).address || "Default Address", 
        user: {
          connect: { id: userId }
        },
        items: {
          create: orderItemsData,
        },
      },
    });

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("ORDER_CREATE_ERROR:", error);
    return { error: "Failed to initialize order. Please check your schema." };
  }
}


export async function confirmCodOrder(orderId: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PROCESSING", // Moves from PENDING to PROCESSING
        paymentStatus: "COD_PENDING", // Indicates cash will be collected later
      },
    });

    revalidatePath(`/checkout/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("CONFIRM_ORDER_ERROR:", error);
    return { success: false, error: "Failed to confirm order" };
  }
}



export async function getMyOrders() {
  try {
    const session = await auth();
    if (!session || !session.user) return [];

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("FETCH_ORDERS_ERROR:", error);
    return [];
  }
}