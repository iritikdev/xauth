"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Updates the structural delivery destination bound to an existing order parameter pipeline
 */
export async function updateOrderAddress(orderId: string, addressId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized access profile configuration." };
    }

    // 1. Fetch address string composition metrics
    const addressDoc = await prisma.address.findUnique({
      where: { id: addressId, userId: session.user.id },
    });

    if (!addressDoc) {
      return { success: false, error: "Target address configuration parameters not found." };
    }

    // Compose flat string summary pattern matching order metadata specifications
    const addressSummaryString = `${addressDoc.receiverName} (${addressDoc.receiverMobile}), ${addressDoc.addressLine}, ${addressDoc.landmark ? addressDoc.landmark + ", " : ""}${addressDoc.district}, ${addressDoc.state} - ${addressDoc.pinCode}`;

    // 2. Perform safe transactional atomic update layout override mapping
    await prisma.order.update({
      where: { id: orderId, userId: session.user.id },
      data: {
        address: addressSummaryString,
      },
    });

    revalidatePath(`/checkout/${orderId}`);
    return { success: true, message: "Delivery fulfillment address updated." };

  } catch (error: any) {
    console.error("ORDER_ADDRESS_MUTATION_ERROR:", error);
    return { success: false, error: "Failed to map order routing destination variables." };
  }
}