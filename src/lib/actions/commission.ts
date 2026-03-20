"use server";

import prisma from "@/lib/prisma";

interface SponsorData {
  id: string;
  sponsorId: string | null;
}

export async function distributeLevelIncome(
  userId: string,
  orderAmount: number,
) {
  try {
    const commissionMap: Record<number, number> = {
      0: 0.05, // 5% (Self Purchase Bonus) 👈 Added this
      1: 0.20, // 20% (Direct Sponsor)
      2: 0.10, 3: 0.08, 4: 0.06, 5: 0.04, 6: 0.02, 7: 0.02,
      8: 0.01, 9: 0.01, 10: 0.01, 11: 0.01, 12: 0.01, 13: 0.01, 14: 0.01, 15: 0.01,
    };

    // 1. BUYER (SELF) KO INCOME DENA
    const selfCommission = orderAmount * commissionMap[0];
    if (selfCommission > 0) {
      await prisma.$transaction(async (tx) => {
        await tx.wallet.upsert({
          where: { userId: userId },
          update: { balance: { increment: selfCommission } },
          create: { userId: userId, balance: selfCommission },
        });

        await tx.transaction.create({
          data: {
            userId: userId,
            amount: selfCommission,
            type: "CREDIT",
            status: "COMPLETED",
            description: `Self Purchase Bonus (5%) on Order Amount ₹${orderAmount}`,
          },
        });
      });
    }

    // 2. UPLINE KO INCOME DENA (1 TO 15 LEVELS)
    const buyer = await prisma.user.findUnique({
      where: { id: userId },
      select: { sponsorId: true, name: true },
    });

    if (!buyer || !buyer.sponsorId)
      return { success: true, msg: "Self income distributed. No sponsor found for levels." };

    let currentSponsorUsername: string | null = buyer.sponsorId;
    const distributionLogs = [{ level: 0, to: userId, amount: selfCommission }];

    for (let level = 1; level <= 15; level++) {
      if (!currentSponsorUsername) break;

      const sponsor: SponsorData | null = await prisma.user.findUnique({
        where: { username: currentSponsorUsername },
        select: { id: true, sponsorId: true },
      });

      if (!sponsor) break;

      const percentage = commissionMap[level] || 0;
      const commissionEarned = orderAmount * percentage;

      if (commissionEarned > 0) {
        await prisma.$transaction(async (tx) => {
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
              description: `Level ${level} Income from ${buyer?.name || "Downline"}`,
            },
          });
        });

        distributionLogs.push({
          level,
          to: currentSponsorUsername,
          amount: commissionEarned,
        });
      }

      currentSponsorUsername = sponsor.sponsorId;
    }

    return { success: true, logs: distributionLogs };
  } catch (error) {
    console.error("Commission Distribution Error:", error);
    return { success: false, error: "Failed to distribute income" };
  }
}