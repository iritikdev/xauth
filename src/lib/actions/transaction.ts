import prisma from "@/lib/prisma";


export async function getTransactions({ 
  status, 
  type 
}: { 
  status?: "PENDING" | "COMPLETED" | "FAILED", 
  type?: "DEBIT" | "CREDIT" 
} = {}) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        status: status,
        type: type
      },
      include: {
      user: {
        include: {
          kycDocument: true 
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