import prisma from "@/lib/prisma";


export async function getTransactions(status?: "PENDING" | "COMPLETED" | "FAILED") {
  try {
    const transactions = await prisma.transaction.findMany({
      where: status ? { status } : {}, // Agar status hai toh filter karo, nahi toh {} (All)
      include: {
      user: {
        include: {
          kycDocument: true // Ensure aapke schema mein user -> kyc relation hai
        }
      }
    },
      orderBy: { createdAt: "desc" }
    });
    
    return { success: true, data: transactions };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, data: [] };
  }
}