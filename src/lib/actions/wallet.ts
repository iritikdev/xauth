"use server";
import prisma from "@/lib/prisma";
import { auth } from "../auth";

export async function processTransaction(
  userId: string,
  amount: number,
  type: "CREDIT" | "DEBIT",
  desc: string,
) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Get current wallet
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet && type === "DEBIT") throw new Error("Wallet not found");

      // 2. Calculate new balance
      const newBalance =
        type === "CREDIT"
          ? (wallet?.balance || 0) + amount
          : (wallet?.balance || 0) - amount;

      if (newBalance < 0) throw new Error("Insufficient funds");

      // 3. Update Wallet
      await tx.wallet.upsert({
        where: { userId },
        update: { balance: newBalance },
        create: { userId, balance: amount },
      });

      // 4. Create Transaction Log
      return await tx.transaction.create({
        data: { userId, amount, type, description: desc, status: "COMPLETED" },
      });
    });
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getWalletData(): Promise<{
  success: boolean;
  data?: { balance: number; transactions: any[] };
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    const userId = session.user.id;

    // Fetch or Create Wallet
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId, balance: 0.0 },
      });
    }

    // Fetch last 10 transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return {
      success: true,
      data: {
        balance: wallet.balance,
        transactions,
      },
    };
  } catch (error) {
    console.error("Wallet Action Error:", error);
    return { success: false, error: "Internal Server Error" };
  }
}


// export async function addMoneyAction(amount: number) {
//   try {
//     const session = await auth();
//     if (!session?.user) return { success: false, error: "Unauthorized" };

//     const userId = session.user.id;

//     // 1. Transaction creation (Prisma Transaction use karein taaki dono fail ya dono pass hon)
//     const result = await prisma.$transaction(async (tx) => {
//       // Wallet update
//       const updatedWallet = await tx.wallet.update({
//         where: { userId },
//         data: {
//           balance: { increment: amount }
//         }
//       });

//       // Transaction log create karein
//       await tx.transaction.create({
//         data: {
//           userId,
//           amount,
//           type: "CREDIT",
//           status: "COMPLETED",
//           description: "Money Added via Wallet"
//         }
//       });

//       return updatedWallet;
//     });

//     return { success: true, balance: result.balance };
//   } catch (error) {
//     console.error("Add Money Error:", error);
//     return { success: false, error: "Payment failed. Try again." };
//   }
// }




export async function addMoneyAction(amount: number) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    const userId = session.user.id;

    // Pehle check karein ki wallet exist karta hai ya nahi (Safety Check)
    const existingWallet = await prisma.wallet.findUnique({
      where: { userId }
    });

    if (!existingWallet) {
        // Agar wallet nahi hai toh create karein (Avoids Update error)
        await prisma.wallet.create({
            data: { userId, balance: amount }
        });
    }

    // Try Transaction with Error Handling
    try {
      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.wallet.update({
          where: { userId },
          data: { balance: { increment: amount } }
        });

        await tx.transaction.create({
          data: {
            userId,
            amount,
            type: "CREDIT",
            status: "COMPLETED",
            description: "Money Added to Wallet"
          }
        });

        return updated;
      }, {
        timeout: 10000, // 10 seconds timeout badha diya hai
      });

      return { success: true, balance: result.balance };

    } catch (transactionError: any) {
      // Agar Transaction Error (10054) aata hai, toh non-transactional update karein
      console.error("Transaction failed, trying fallback...", transactionError.message);
      
      const updatedWallet = await prisma.wallet.update({
        where: { userId },
        data: { balance: { increment: amount } }
      });

      await prisma.transaction.create({
        data: {
          userId,
          amount,
          type: "CREDIT",
          status: "COMPLETED",
          description: "Money Added (Fallback Mode)"
        }
      });

      return { success: true, balance: updatedWallet.balance };
    }

  } catch (error: any) {
    console.error("Critical Add Money Error:", error);
    return { success: false, error: "Database connection lost. Please try again." };
  }
}



export async function withdrawRequestAction(amount: number) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized" };

    const userId = session.user.id;

    // 1. Double check balance
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < amount) {
      return { success: false, error: "Insufficient balance" };
    }

    // 2. Transaction Flow
    const result = await prisma.$transaction(async (tx) => {
      // Wallet balance deduct karein (Locking the funds)
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { balance: { decrement: amount } }
      });

      // Create a PENDING transaction
      await tx.transaction.create({
        data: {
          userId,
          amount,
          type: "DEBIT",
          status: "PENDING", // Wait for Admin
          description: "Withdrawal Request initiated"
        }
      });

      return updatedWallet;
    });

    return { success: true, balance: result.balance };
  } catch (error) {
    console.error("Withdrawal Error:", error);
    return { success: false, error: "Request failed. Try again later." };
  }
}