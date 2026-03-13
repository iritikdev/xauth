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

    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: { address: true, district: true, state: true, pincode: true },
    });

    const address = `${user?.address || "No Address"}, ${user?.district || ""}, ${user?.state || ""} - ${user?.pincode || ""}`;

    // 1. Get Product IDs
    const productIds = cartItems.map((item) => item.id);

    // 2. Fetch products from DB (To get real price and BV)
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    let runningTotalAmount = 0;
    let runningTotalBv = 0;

    // 3. Prepare OrderItems (Correct Server-side mapping)
    const orderItemsData = cartItems.map((item) => {
      const dbProduct = dbProducts.find((p) => p.id === item.id);

      if (!dbProduct) {
        throw new Error(`Product ${item.id} not found`);
      }

      const quantity = Number(item.quantity);
      const unitPrice = dbProduct.price - (dbProduct.price * (dbProduct.discount || 0)) / 100;

      runningTotalAmount += unitPrice * quantity;
      runningTotalBv += dbProduct.bvAmount * quantity;

      return {
        quantity: quantity,
        price: unitPrice,
        bv: dbProduct.bvAmount, // Ye exact schema field se match kar raha hai
        productName: dbProduct.name,
        product: {
          connect: {
            id: dbProduct.id,
          },
        },
      };
    });

    // 4. Create Order using the ALREADY PREPARED orderItemsData
    const order = await prisma.order.create({
      data: {
        totalAmount: runningTotalAmount,
        totalBv: runningTotalBv,
        status: "PENDING",
        paymentStatus: "UNPAID",
        address: address,

        user: {
          connect: {
            id: userId,
          },
        },

        items: {
          create: orderItemsData, // 👈 Yahan change hai! Naya map mat lagaiye
        },
      },
    });

    console.log("ORDER_CREATED:", order);

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
