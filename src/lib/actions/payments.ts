"use server"
import prisma from "@/lib/prisma";
import { calculateCommission } from "@/lib/commissions";

export async function distributeCommissions(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true }
  });

  if (!order) return { error: "Order not found" };ww

  let currentSponsorId = order.user.sponsorId;
  let level = 1;

  // 1. Process Self Cashback (Level 0)
  const selfEarning = calculateCommission(order.totalAmount, 0, order.user.username);
  await updateWallet(order.userId, selfEarning, `Self Cashback for Order #${orderId}`);

  // 2. Process Downline Levels 1 to 15
  while (currentSponsorId && level <= 15) {
    const sponsor = await prisma.user.findUnique({ where: { id: currentSponsorId } });
    
    if (sponsor) {
      const commission = calculateCommission(order.totalAmount, level, sponsor.username);
      
      if (commission > 0) {
        await updateWallet(sponsor.id, commission, `L${level} Commission from ${order.user.name}`);
      }
      
      currentSponsorId = sponsor.sponsorId;
      level++;
    } else {
      break;
    }
  }
}

async function updateWallet(userId: string, amount: number, desc: string) {
  // Use the processTransaction logic we built earlier
  // await prisma.wallet.update(...)
}