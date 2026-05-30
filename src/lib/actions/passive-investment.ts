"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PassiveInvestmentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface CreateInvestmentInput {
  amount: number;
  receiptUrl: string;
}

export async function createPassiveInvestmentRequest(data: CreateInvestmentInput) {
  try {
    // 1. Session & Authentication Check
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please login again." };
    }

    const userId = session.user.id;
    const { amount, receiptUrl } = data;

    // 2. Input Validation
    if (!amount || amount <= 0) {
      return { success: false, error: "Invalid investment amount." };
    }

    if (!receiptUrl || !receiptUrl.startsWith("http")) {
      return { success: false, error: "Valid payment receipt is required." };
    }

    // 3. Database Atomicity via Transaction
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Check if User's PassiveWallet exists, if not create one automatically
      let passiveWallet = await tx.passiveWallet.findUnique({
        where: { userId },
      });

      if (!passiveWallet) {
        passiveWallet = await tx.passiveWallet.create({
          data: {
            userId,
          },
        });
      }

      // B. Anti-Fraud Check: Strict limit control
      // Agar user ki pehle se koi PENDING request hai, toh nayi block karein
      const existingPendingRequest = await tx.passiveInvestment.findFirst({
        where: {
          userId,
          status: PassiveInvestmentStatus.PENDING,
        },
      });

      if (existingPendingRequest) {
        throw new Error("You already have a pending investment request under audit.");
      }

      // C. Generate a unique system tracking Transaction ID
      const systemTransactionId = `AMZ-PAS-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      console.log("Generated System Transaction ID:", systemTransactionId);
      console.log("Creating Passive Investment with Amount:", amount, "and Receipt URL:", receiptUrl);
      // D. Create the Passive Investment Ledger entry
      const newInvestment = await tx.passiveInvestment.create({
        data: {
          userId,
          passiveWalletId: passiveWallet.id,
          amount: parseFloat(amount.toFixed(2)),
          receiptUrl,
          transactionId: systemTransactionId,
          status: PassiveInvestmentStatus.PENDING,
          roiPercentage: 0, // Admin verification ke waqt dynamically set ho sakta hai
        },
      });

      return newInvestment;
    });

    // 4. Client Cache Busting for Instant Dashboard Updates
    revalidatePath("/dashboard/passive-wallet");

    return { 
      success: true, 
      data: { 
        id: result.id, 
        transactionId: result.transactionId 
      } 
    };

  } catch (error: any) {
    console.error("PASSIVE_INVESTMENT_SERVER_ACTION_ERROR:", error);
    return { 
      success: false, 
      error: error.message || "Internal server error. Transaction rolled back." 
    };
  }
}


export interface TransactionUI {
    id: string
    title: string
    from: string
    amount: string
    status: string
    date: string
    type: "credit" | "debit"
}

export async function getInvestmentTransactions(userId: string): Promise<TransactionUI[]> {
    if (!userId) throw new Error("Unauthorized access.")

    try {
        const investments = await prisma.passiveInvestment.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })

        return investments.map((invest) => {
            // Map Prisma status enum to your UI status component states
            // let displayStatus: "Completed" | "Pending" | "Rejected" = "Pending"
            // if (invest.status === "COMPLETED") displayStatus = "Completed"
            // if (invest.status === "REJECTED") displayStatus = "Rejected"

            // Format date for crisp mobile rendering
            const formattedDate = new Date(invest.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }).replace(/,/g, " ·")


            return {
                id: invest.id,
                title: "Investment Added",
                // Fallback to Transaction ID, then fallback notice if completely empty string/null
                from: invest.transactionId || "Verification Pending",
                amount: `₹${invest.amount.toLocaleString("en-IN")}`,
                status: invest.status,
                date: formattedDate,
                // Adjust type to 'debit' if you track this as a deduction from main wallet balance
                type: "credit", 
            }
        })
    } catch (error) {
        console.error("Error populating investments:", error)
        return []
    }
  }


  export async function verifyAndActivateInvestment(investmentId: string) {
  try {
    // 1. Transaction का इस्तेमाल करें ताकि दोनों काम एक साथ हों या एक भी न हो
    const result = await prisma.$transaction(async (tx) => {
      
      // 2. Investment का स्टेटस COMPLETED करें
      const updatedInvestment = await tx.passiveInvestment.update({
        where: { id: investmentId },
        data: {
          status: PassiveInvestmentStatus.VERIFIED,
          verifiedAt: new Date(),
          activatedAt: new Date(),
        },
      })

      if (updatedInvestment.status !== PassiveInvestmentStatus.VERIFIED) {
        throw new Error("Investment verification failed.")
      }

      // 3. User के PassiveWallet को अपडेट करें
      const updatedWallet = await tx.passiveWallet.update({
        where: { id: updatedInvestment.passiveWalletId },
        data: {
          // totalInvested में अमाउंट जोड़ें
          totalInvested: {
            increment: updatedInvestment.amount,
          },
          // अगर आपके सिस्टम में इन्वेस्ट करने पर availableBalance कम होता है:
          // availableBalance: { decrement: updatedInvestment.amount }
        },
      })

      return { updatedInvestment, updatedWallet }
    })

    return { success: true, data: result }
  } catch (error) {
    console.error("Wallet update transaction failed:", error)
    return { success: false, error: "Failed to verify investment and update wallet." }
  }
}


export interface WalletMetrics {
    totalInvested: number
    totalWithdrawn: number
    totalIncome: number
    availableBalance: number
}

export async function getPassiveWalletData(userId: string): Promise<WalletMetrics | null> {
    if (!userId) throw new Error("Unauthorized access profile hook.")

    try {
        const wallet = await prisma.passiveWallet.findUnique({
            where: { userId },
        })

        if (!wallet) {
            // Return base fallbacks if the database hasn't initialized the wallet object yet
            return {
                totalInvested: 0,
                totalWithdrawn: 0,
                totalIncome: 0,
                availableBalance: 0,
            }
        }

        return {
            totalInvested: wallet.totalInvested,
            totalWithdrawn: wallet.totalWithdrawn,
            totalIncome: wallet.totalIncome,
            availableBalance: wallet.availableBalance,
        }
    } catch (error) {
        console.error("Error retrieving passive wallet data metrics:", error)
        return null
    }
}