"use server"

import prisma from "@/lib/prisma"

export interface AdminWalletListData {
  id: string
  userId: string
  userName: string
  userEmail: string
  totalInvested: number
  totalIncome: number
  totalWithdrawn: number
  availableBalance: number
  updatedAt: string
}

export async function getAdminWalletList(): Promise<AdminWalletListData[]> {
  try {
    // 💡 नोट: यहाँ आप अपनी एडमिन रोल सुरक्षा जांच (Admin Middleware/Session Check) जोड़ सकते हैं।
    
    const wallets = await prisma.passiveWallet.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { availableBalance: "desc" }, // सबसे ज़्यादा बैलेंस वाले यूज़र्स पहले दिखेंगे
    })

    return wallets.map((wallet) => ({
      id: wallet.id,
      userId: wallet.userId,
      userName: wallet.user?.name || "Unknown User",
      userEmail: wallet.user?.email || "No Email",
      totalInvested: wallet.totalInvested,
      totalIncome: wallet.totalIncome,
      totalWithdrawn: wallet.totalWithdrawn,
      availableBalance: wallet.availableBalance,
      updatedAt: new Date(wallet.updatedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }))
  } catch (error) {
    console.error("Error fetching admin wallet ledger accounts:", error)
    return []
  }
}