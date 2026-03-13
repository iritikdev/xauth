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

    // Product IDs
    const productIds = cartItems.map((item) => item.id);

    // Fetch products from DB
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    let runningTotalAmount = 0;
    let runningTotalBv = 0;

    // Prepare OrderItems
    const orderItemsData = cartItems.map((item) => {
      const dbProduct = dbProducts.find((p) => p.id === item.id);

      if (!dbProduct) {
        throw new Error(`Product ${item.id} not found`);
      }

      const quantity = Number(item.quantity);

      const unitPrice =
        dbProduct.price - (dbProduct.price * (dbProduct.discount || 0)) / 100;

      runningTotalAmount += unitPrice * quantity;
      runningTotalBv += dbProduct.bvAmount * quantity;

      return {
        quantity: quantity,
        price: unitPrice,
        bv: dbProduct.bvAmount,
        product: {
          connect: {
            id: dbProduct.id,
          },
        },
      };
    });

    // Create Order
    const order = await prisma.order.create({
      data: {
        totalAmount: runningTotalAmount,
        totalBv: runningTotalBv,
        status: "PENDING",
        paymentStatus: "UNPAID",
        address: (session.user as any).address || "Default Address",

        user: {
          connect: {
            id: userId,
          },
        },

        items: {
          create: cartItems.map((item: any) => ({
            productName: item.name, // required
            quantity: Number(item.quantity),
            price: Number(item.price),
            bv: Number(item.bv), // required

            product: {
              connect: {
                id: item.id,
              },
            },
          })),
        },
      },
    });

    revalidatePath("/dashboard/orders");

    return {
      success: true,
      orderId: order.id,
    };
  } catch (error) {
    console.error("ORDER_CREATE_ERROR:", error);

    return {
      error: "Failed to create order",
    };
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
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("FETCH_ORDERS_ERROR:", error);
    return [];
  }
}
