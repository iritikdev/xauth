"use server";
import prisma from "@/lib/prisma";

// रैंक की कॉन्फ़िगरेशन (Target BV और Cash Reward)
const RANK_CONFIG = [
  { rank: "CHAIRMAN", target: 10000000, reward: 1000000 },
  { rank: "CROWN_AMBASSADOR", target: 7000000, reward: 700000 },
  { rank: "DIAMOND_DIPLOMAT", target: 4000000, reward: 400000 },
  { rank: "STAR_DIPLOMAT", target: 2000000, reward: 200000 },
  { rank: "DIPLOMAT", target: 1000000, reward: 100000 },
  { rank: "STAR_DIAMOND", target: 500000, reward: 50000 },
  { rank: "DIAMOND", target: 250000, reward: 25000 },
  { rank: "SUPER_STAR", target: 150000, reward: 15000 },
  { rank: "STAR", target: 50000, reward: 5000 },
  { rank: "ASSOCIATE", target: 0, reward: 0 },
];

export async function checkAndUpdateRank(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, groupBv: true, rank: true },
    });

    if (!user) return;

    // वर्तमान BV के हिसाब से सबसे ऊंची रैंक ढूंढें जो यूजर ने हासिल की है
    const eligibleRank = RANK_CONFIG.find((r) => user.groupBv >= r.target);

    // अगर योग्य रैंक वर्तमान रैंक से अलग (बेहतर) है, तो अपडेट करें
    if (eligibleRank && eligibleRank.rank !== user.rank) {
      console.log(`🏆 Promoting ${userId} to ${eligibleRank.rank}`);

      await prisma.$transaction(async (tx) => {
        // 1. रैंक अपडेट करें
        await tx.user.update({
          where: { id: userId },
          data: { rank: eligibleRank.rank as any },
        });

        // 2. कैश रिवॉर्ड वॉलेट में जोड़ें
        await tx.wallet.upsert({
          where: { userId },
          update: { balance: { increment: eligibleRank.reward } },
          create: { userId, balance: eligibleRank.reward },
        });

        // 3. ट्रांजेक्शन हिस्ट्री में रिकॉर्ड करें
        await tx.transaction.create({
          data: {
            userId,
            amount: eligibleRank.reward,
            type: "CREDIT",
            status: "COMPLETED",
            description: `Rank Achieved: ${eligibleRank.rank} - Cash Bonus Credited`,
          },
        });
      });

      return { success: true, newRank: eligibleRank.rank };
    }
  } catch (error) {
    console.error("❌ Rank Update Error:", error);
  }
}