"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import { baseDashboardUrl } from "../constants";

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
        isActive: true,
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

    revalidatePath(`${baseDashboardUrl}/orders`);

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

interface ConfirmOnlineOrderResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function confirmOnlinePaidOrder(
  orderId: string, 
  transactionId?: string
): Promise<ConfirmOnlineOrderResult> {
  try {
    // 1. Authenticate user session
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized access. Please login again." };
    }

    if (!orderId) {
      return { success: false, error: "Order ID is mandatory." };
    }

    // 2. Fetch order with nested products inside a transactional execution context
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order parameters not found." };
    }

    // Avoid reprocessing if already paid or verified
    if (order.paymentStatus === "PAID" || order.status === "PROCESSING") {
      return { success: true, message: "Order is already under processing." };
    }

    // 3. Atomicity Guard: Verify stock availability across all formulations before mutation
    for (const item of order.items) {
      if (item.product.stock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for: ${item.product.name}. Stock available: ${item.product.stock}`,
        };
      }
    }

    // 4. Multi-document safe atomic mutation pool
    await prisma.$transaction(async (tx) => {
      
      // A. Loop & loop-level safe decrement parameters execution
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // B. Shift order state engine parameters
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "PROCESSING", // Shift state safely from PENDING
          paymentStatus: "PAID", // Marks immediate settlement parameters
          // Option to log custom runtime tracking parameters if you add them to order schema later:
          // txnReference: transactionId || null
        },
      });
    });

    // 5. Instantly clear Next.js layout cache pools
    revalidatePath(`/checkout/${orderId}`);
    revalidatePath("/admin/orders");
    revalidatePath("/shop");

    return { 
      success: true, 
      message: "Online transaction verified. Processing your inventory dispatch." 
    };

  } catch (error: any) {
    console.error("CONFIRM_ONLINE_PAID_ORDER_ERROR:", error);
    return {
      success: false,
      error: error.message || "Failed to confirm online transaction mapping.",
    };
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




export async function getCurrentMonthPurchaseBV() {
  try {
    // 1. Authenticate User Session
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized access.", currentMonthBV: 0 };
    }

    const userId = session.user.id;

    // 2. Calculate Date Bounds for Current Month
    const now = new Date();
    
    // Start of the current month (e.g., 1st day at 00:00:00.000)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // End of the current month (e.g., last day at 23:59:59.999)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // 3. Aggregate Total BV using Prisma _sum
    const aggregation = await prisma.order.aggregate({
      _sum: {
        totalBv: true,
      },
      where: {
        userId: userId,
        // Filter strictly for orders created within current month
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        // Anti-fraud/business check: Count BV only for confirmed/paid orders
        paymentStatus: "PAID", 
        // Note: Replace or adjust status enum according to your OrderStatus rules if required
        // status: { notIn: ["CANCELLED", "PENDING"] }
      },
    });

    const currentMonthBV = aggregation._sum.totalBv || 0;

    console.log("Current Month BV Calculation:", currentMonthBV)

    return {
      success: true,
      currentMonthBV: parseFloat(currentMonthBV.toFixed(2)),
      period: {
        start: startOfMonth,
        end: endOfMonth,
      },
    };

  } catch (error: any) {
    console.error("GET_CURRENT_MONTH_BV_ERROR:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch current month BV.",
      currentMonthBV: 0,
    };
  }
}