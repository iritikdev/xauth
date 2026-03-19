"use server";

import prisma from "@/lib/prisma";

// 1. Sponsor ke liye ek interface define karein taaki TS ko shape pata ho
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
      1: 0.1,
      2: 0.05,
      3: 0.02,
      4: 0.02,
      5: 0.02,
      6: 0.01,
      7: 0.01,
      8: 0.01,
      9: 0.01,
      10: 0.01,
      11: 0.01,
      12: 0.01,
      13: 0.01,
      14: 0.01,
      15: 0.01,
    };

    console.log("userid", userId);
    const buyer = await prisma.user.findUnique({
      where: { id: userId },
      select: { sponsorId: true, name: true },
    });

    console.log("buyes", buyer);

    if (!buyer || !buyer.sponsorId)
      return { success: true, msg: "No sponsor found" };

    // Explicitly type the iterator variable
    let currentSponsorUsername: string | null = buyer.sponsorId;
    const distributionLogs = [];

    for (let level = 1; level <= 15; level++) {
      if (!currentSponsorUsername) break;

      // 2. Type annotation yahan add karein (SponsorData | null)
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
            update: {
              balance: { increment: commissionEarned },
            },
            create: {
              userId: sponsor.id,
              balance: commissionEarned,
            },
          });
          // Transaction record create karein
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

      // 3. Ab TS ko pata hai ki sponsor.sponsorId string | null hai
      currentSponsorUsername = sponsor.sponsorId;
    }

    return { success: true, logs: distributionLogs };
  } catch (error) {
    console.error("Commission Distribution Error:", error);
    return { success: false, error: "Failed to distribute income" };
  }
}
