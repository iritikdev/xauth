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



export interface UserWalletDetailReport {
  id: string
  userName: string
  userEmail: string
  availableBalance: number
  totalInvested: number
  totalIncome: number
  totalWithdrawn: number
  investments: {
    id: string
    amount: number
    transactionId: string | null
    status: string
    createdAt: string
    maturesAt: string | null
  }[]
  withdrawals: {
    id: string
    amount: number
    status: string
    createdAt: string
    processedAt: string | null
  }[]
  incomes: {
    id: string
    amount: number
    description: string | null
    creditedAt: string
    investmentTxnId: string | null
  }[]
}

export async function getUserWalletDetailReport(walletId: string): Promise<UserWalletDetailReport | null> {
  if (!walletId) throw new Error("Wallet ID parameter is highly required.")

  try {
    const wallet = await prisma.passiveWallet.findUnique({
      where: { id: walletId },
      include: {
        user: { select: { name: true, email: true } },
        investments: { orderBy: { createdAt: "desc" } },
        withdrawals: { orderBy: { createdAt: "desc" } },
      },
    })

    if (!wallet) return null

    // सभी पैसिव इनकम को अलग से फ़ेच करें जो इस यूज़र से जुड़ी हैं
    const incomes = await prisma.passiveIncome.findMany({
      where: { userId: wallet.userId },
      include: { investment: { select: { transactionId: true } } },
      orderBy: { creditedAt: "desc" },
    })

    const formatDate = (date: Date | null) => 
      date ? date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : null

    return {
      id: wallet.id,
      userName: wallet.user?.name || "Unknown User",
      userEmail: wallet.user?.email || "No Email",
      availableBalance: wallet.availableBalance,
      totalInvested: wallet.totalInvested,
      totalIncome: wallet.totalIncome,
      totalWithdrawn: wallet.totalWithdrawn,
      investments: wallet.investments.map((inv) => ({
        id: inv.id,
        amount: inv.amount,
        transactionId: inv.transactionId,
        status: inv.status,
        createdAt: formatDate(inv.createdAt)!,
        maturesAt: formatDate(inv.maturesAt),
      })),
      withdrawals: wallet.withdrawals.map((w) => ({
        id: w.id,
        amount: w.amount,
        status: w.status,
        createdAt: formatDate(w.createdAt)!,
        processedAt: formatDate(w.processedAt),
      })),
      incomes: incomes.map((inc) => ({
        id: inc.id,
        amount: inc.amount,
        description: inc.description,
        creditedAt: formatDate(inc.creditedAt)!,
        investmentTxnId: inc.investment?.transactionId || "N/A",
      })),
    }
  } catch (error) {
    console.error("Failed to generate administrative user report ledger:", error)
    return null
  }
}