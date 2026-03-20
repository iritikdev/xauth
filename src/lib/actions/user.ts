"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user?.username) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { username: session.user.username },
      include: {
        Wallet:{
            select:{balance:true}
        },
        sponsor: { select: { name: true, username: true } },
        _count: {
          select: { 
            downlines: true, 
            orders: true 
          }
        }
      }
    });

    if (!user) return null;

    // Yahan hum dashboard ke liye specific fields return kar rahe hain
    return {
      ...user,
      totalTeam: user._count.downlines,
      activeTeam: user._count.downlines, // Logic for active team can be added here
      totalPayout: 0, // Calculate from transactions if needed
    };
  } catch (error) {
    console.error("Server Action Error:", error);
    return null;
  }
}