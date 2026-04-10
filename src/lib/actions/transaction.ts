import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTransactions(status?: "PENDING" | "COMPLETED" | "FAILED") {
  try {
    const transactions = await prisma.transaction.findMany({
      where: status ? { status } : {},
      include: {
        user: {
          include: {
            kycDocument: true 
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    
    // ✅ Revalidate ko return se PEHLE rakhein
    revalidatePath("/admin/payouts");
    
    return { success: true, data: transactions };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, data: [] };
  }
}