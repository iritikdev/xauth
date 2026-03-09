"use server"
import prisma from "@/lib/prisma";

export async function processTransaction(userId: string, amount: number, type: "CREDIT" | "DEBIT", desc: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Get current wallet
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet && type === "DEBIT") throw new Error("Wallet not found");

      // 2. Calculate new balance
      const newBalance = type === "CREDIT" 
        ? (wallet?.balance || 0) + amount 
        : (wallet?.balance || 0) - amount;

      if (newBalance < 0) throw new Error("Insufficient funds");

      // 3. Update Wallet
      await tx.wallet.upsert({
        where: { userId },
        update: { balance: newBalance },
        create: { userId, balance: amount }
      });

      // 4. Create Transaction Log
      return await tx.transaction.create({
        data: { userId, amount, type, description: desc, status: "COMPLETED" }
      });
    });
  } catch (error: any) {
    return { error: error.message };
  }
}