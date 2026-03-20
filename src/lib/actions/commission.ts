"use server";

import prisma from "@/lib/prisma";
import { checkAndUpdateRank } from "./rank";

export async function distributeLevelIncome(
  userId: string,
  orderBv: number,
  orderId: string,
) {
  try {
    console.log("🔥 Starting distribution for Order:", orderId);

    // 1️⃣ IDEMPOTENCY CHECK
    const existingOrder = await prisma.transaction.findFirst({
      where: {
        userId,
        description: { contains: `Order: ${orderId}` },
      },
    });

    if (existingOrder) {
      console.log("⚠️ Already processed. Skipping.");
      return { success: true, message: "Already processed" };
    }

    const commissionMap: Record<number, number> = {
      0: 0.05, 1: 0.2, 2: 0.1, 3: 0.08, 4: 0.06, 5: 0.04, 6: 0.02,
      7: 0.02, 8: 0.01, 9: 0.01, 10: 0.01, 11: 0.01, 12: 0.01, 
      13: 0.01, 14: 0.01, 15: 0.01,
    };

    // 2️⃣ STEP 1: UPDATE BUYER (Personal BV & Self Bonus)
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
            description: `Self Bonus - Order: ${orderId}`,
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
        select: { id: true, sponsorId: true, username: true, personalBv: true, rank: true },
      });

      if (!sponsor || sponsor.id === userId) break;

      // 🛡️ CONDITION A: Active Role Check (Level * 100)
      const requiredBv = level * 100;
      const isBvActive = sponsor.personalBv >= requiredBv;

      // 🛡️ CONDITION B: Rank Unlock Check (L7-L15 requires STAR or above)
      // Assuming 'USER' is the default rank. Rank must be anything else for L7+
      const isRankEligible = level <= 6 || (level > 6 && sponsor.rank !== "USER");

      const percentage = commissionMap[level] || 0;
      const commissionEarned = orderBv * percentage;

      await prisma.$transaction(async (tx) => {
        // ✅ Group BV हमेशा अपडेट होगा (रैंक प्रोग्रेस के लिए)
        await tx.user.update({
          where: { id: sponsor.id },
          data: { groupBv: { increment: orderBv } },
        });

        // ✅ कमीशन सिर्फ तभी मिलेगा जब दोनों शर्तें पूरी हों
        if (isBvActive && isRankEligible && commissionEarned > 0) {
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
        } else {
          // Debugging के लिए log (optional)
          if (!isBvActive) console.log(`⏭️ L${level} Skipped for ${sponsor.username}: Low BV (${sponsor.personalBv}/${requiredBv})`);
          if (!isRankEligible) console.log(`⏭️ L${level} Skipped for ${sponsor.username}: Rank Lock (Need STAR)`);
        }
      });

      // ✅ रैंक चेक करें (Async call)
      checkAndUpdateRank(sponsor.id);

      currentSponsorUsername = sponsor.sponsorId;
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Error during distribution:", error);
    return { success: false, error: "Internal Server Error" };
  }
}