"use server";

import prisma from "@/lib/prisma";

// Added orderId to ensure this specific purchase is only processed once
export async function distributeLevelIncome(
  userId: string,
  orderBv: number,
  orderId: string,
) {
  try {
    console.log("🔥 Attempting distribution for Order:", orderId);
    console.log("🔥 DISTRIBUTE CALLED", {
      userId,
      orderId,
      time: new Date().toISOString(),
    });

    // 1️⃣ IDEMPOTENCY CHECK: Has this order already been processed?
    const existingOrder = await prisma.transaction.findFirst({
      where: {
        userId,
        description: { contains: `Order: ${orderId}` },
      },
    });

    if (existingOrder) {
      console.log(
        "⚠️ Distribution already completed for this order. Skipping.",
      );
      return { success: true, message: "Already processed" };
    }

    const commissionMap: Record<number, number> = {
      0: 0.05,
      1: 0.2,
      2: 0.1,
      3: 0.08,
      4: 0.06,
      5: 0.04,
      6: 0.02,
      7: 0.02,
      8: 0.01,
      9: 0.01,
      10: 0.01,
      11: 0.01,
      12: 0.01,
      13: 0.01,
      14: 0.01,
      15: 0.01,
    };

    // 2️⃣ STEP 1: UPDATE BUYER (Atomic Transaction)
    const buyer = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: { personalBv: { increment: orderBv } },
        select: { id: true, sponsorId: true, username: true },
      });

      const selfCommission = orderBv * commissionMap[0];

      if (selfCommission > 0) {
        await tx.wallet.upsert({
          where: { userId },
          update: { balance: { increment: selfCommission } },
          create: { userId, balance: selfCommission },
        });

        await tx.transaction.create({
          data: {
            userId,
            amount: selfCommission,
            type: "CREDIT",
            status: "COMPLETED",
            description: `Self Bonus - Order: ${orderId}`, // Reference stored here
          },
        });
      }
      return user;
    });

    // 3️⃣ STEP 2: UPLINE DISTRIBUTION
    let currentSponsorUsername = buyer.sponsorId;

    for (let level = 1; level <= 15; level++) {
      if (!currentSponsorUsername) break;

      const sponsor = await prisma.user.findUnique({
        where: { username: currentSponsorUsername },
        select: { id: true, sponsorId: true, username: true },
      });

      if (!sponsor || sponsor.id === userId) break;

      const percentage = commissionMap[level] || 0;
      const commissionEarned = orderBv * percentage;

      // Wrap Upline updates in a transaction for safety
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: sponsor.id },
          data: { groupBv: { increment: orderBv } },
        });

        if (commissionEarned > 0) {
          await tx.wallet.upsert({
            where: { userId: sponsor.id },
            update: { balance: { increment: commissionEarned } },
            create: { userId: sponsor.id, balance: commissionEarned },
          });

          await tx.transaction.create({
            data: {
              userId: sponsor.id,
              amount: commissionEarned,
              type: "CREDIT",
              status: "COMPLETED",
              description: `L${level} Income - From: ${buyer.username} (Order: ${orderId})`,
            },
          });
        }
      });

      currentSponsorUsername = sponsor.sponsorId;
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Error during distribution:", error);
    return { success: false, error: "Internal Server Error" };
  }
}
