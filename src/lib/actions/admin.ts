"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import bcrypt from "bcryptjs";

export async function markOrderAsDelivered(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.status === "DELIVERED") return { success: false, error: "Invalid Order" };

    await prisma.$transaction([
      // 1. Update Order
      prisma.order.update({
        where: { id: orderId },
        data: { status: "DELIVERED", paymentStatus: "PAID" }
      }),
      // // 2. Credit BV to User Wallet
      // prisma.user.update({
      //   where: { id: order.userId },
      //   data: { personalBv: { increment: order.totalBv } }
      // })
    ]);

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Update failed" };
  }
}


export async function updatePayoutStatus(transactionId: string, status: "COMPLETED" | "FAILED") {
  try {
    const session = await auth();
    // Ensure only ADMIN can access this (Check your user role logic)
    // if (!session?.user ) { //|| session.user.role !== "ADMIN"
    //   return { success: false, error: "Unauthorized Access" };
    // }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Transaction fetch karein
      const transaction = await tx.transaction.findUnique({
        where: { id: transactionId }
      });

      if (!transaction || transaction.status !== "PENDING") {
        throw new Error("Invalid Transaction");
      }

      // 2. Status Update karein
      const updatedTx = await tx.transaction.update({
        where: { id: transactionId },
        data: { status }
      });

      // 3. AGAR REJECT (FAILED) HUA TO REFUND KAREIN
      if (status === "FAILED") {
        await tx.wallet.update({
          where: { userId: transaction.userId },
          data: { balance: { increment: transaction.amount } }
        });

        // Ek naya credit log bhi create kar sakte hain 'Refund' ke naam se
        await tx.transaction.create({
          data: {
            userId: transaction.userId,
            amount: transaction.amount,
            type: "CREDIT",
            status: "COMPLETED",
            description: `Refund for Rejected Withdrawal #${transactionId.slice(-5)}`
          }
        });
      }

      return updatedTx;
    });

    revalidatePath("/admin/payouts");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


export async function changeUserSponsor(userId: string, newSponsorUsername: string) {
  try {
    // 1. Check if new sponsor exists
    const newSponsor = await prisma.user.findUnique({
      where: { username: newSponsorUsername }
    });

    if (!newSponsor) throw new Error("New sponsor not found.");

    // 2. Prevent Circular Reference (User cannot be their own sponsor or their downline's)
    // Simple check: user != newSponsor
    if (userId === newSponsor.id) {
      throw new Error("A user cannot be their own sponsor.");
    }

    // 3. Update the User
    await prisma.user.update({
      where: { id: userId },
      data: {
        sponsorId: newSponsor.username, // Hamare schema mein username reference hai
      }
    });

    revalidatePath("/admin/users");
    return { success: true, message: "Sponsorship updated successfully!" };

  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getUsernameInfo(username: string) {
  if (!username || username.length < 3) return null;
  const user = await prisma.user.findUnique({
    where: { username },
    select: { name: true }
  });
  return user;
}



export async function updateUserDetails(userId: string, formData: any) {
  try {
    const { kycData, ...userData } = formData;

    await prisma.$transaction([
      // Update User Main Table
      prisma.user.update({
        where: { id: userId },
        data: userData,
      }),
      // Update KYC Table
      prisma.kycDocument.upsert({
        where: { userId: userId },
        update: kycData,
        create: { ...kycData, userId: userId },
      }),
    ]);

    revalidatePath(`/admin/users/${userData.username}`);
    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}





export async function updateUserPassword(userId: string, newPassword: string) {
  try {
    // 1. Password ko hash karna zaroori hai
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword.trim(), salt);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }, 
    });

    return { success: true, message: "Password updated & encrypted!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}



export interface AdminInvestmentData {
  id: string
  userName: string
  userEmail: string
  amount: number
  transactionId: string
  receiptUrl: string | null
  status: "PENDING" | "COMPLETED" | "REJECTED" | "VERIFIED"
  createdAt: string
  maturesAt: string | null
}

export async function getAdminInvestmentList(): Promise<AdminInvestmentData[]> {
  try {
    // यहाँ आप अपनी ऑथेंटिकेशन चेक लगा सकते हैं (e.g., check if user.role === 'ADMIN')

    const investments = await prisma.passiveInvestment.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return investments.map((inv) => ({
      id: inv.id,
      userName: inv.user?.name || "Unknown User",
      userEmail: inv.user?.email || "No Email",
      amount: inv.amount,
      transactionId: inv.transactionId || "N/A",
      receiptUrl: inv.receiptUrl,
      status: inv.status as "PENDING" | "COMPLETED" | "REJECTED",
      createdAt: new Date(inv.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      maturesAt: inv.maturesAt
        ? new Date(inv.maturesAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : null,
    }))
  } catch (error) {
    console.error("Admin fetch error:", error)
    return []
  }
}

// export async function activateInvestmentAndSetLockIn(investmentId: string, customMaturityDate: Date) {
//   try {
//     return await prisma.$transaction(async (tx) => {
      
//       // 1. आज की तारीख और आज से 30 दिन बाद की तारीख निकालें
//       const activatedAt = new Date()
//       const maturesAt = new Date()
//       maturesAt.setDate(activatedAt.getDate() + 30) // 💡 30 दिन का लॉक-इन पीरियड

//       // 2. Investment अपडेट करें
//       const updatedInvestment = await tx.passiveInvestment.update({
//         where: { id: investmentId },
//         data: {
//           status: "VERIFIED", // या ACTIVATED जो भी आपके पास Enum हो
//           activatedAt,
//           maturesAt,
//         },
//       })

//       // 3. वॉलेट के 'totalInvested' को बढ़ाएं (availableBalance को अभी नहीं छुएंगे)
//       await tx.passiveWallet.update({
//         where: { id: updatedInvestment.passiveWalletId },
//         data: {
//           totalInvested: {
//             increment: updatedInvestment.amount,
//           },
//         },
//       })

//       return { success: true, maturesAt }
//     })
//   } catch (error) {
//     console.error("Activation failed:", error)
//     return { success: false, error: "Failed to activate investment" }
//   }
// }

export async function activateInvestmentAndSetLockIn(
  investmentId: string, 
  customMaturityDate: Date // 💡 एडमिन पैनल से चुनी गई तारीख यहाँ आएगी
) {
  console.log("Activating Investment ID:", investmentId, "with Maturity Date:", customMaturityDate)
  
  try {
    return await prisma.$transaction(async (tx) => {
      
      // 1. निवेश एक्टिवेशन का समय (Current Time)
      const activatedAt = new Date()

      // 2. सुरक्षा जांच: सुनिश्चित करें कि जो तारीख आ रही है वह एक वैध Date ऑब्जेक्ट है
      const maturesAt = new Date(customMaturityDate)

      // 3. PassiveInvestment रिकॉर्ड को अपडेट करें
      const updatedInvestment = await tx.passiveInvestment.update({
        where: { id: investmentId },
        data: {
          status: "VERIFIED", // आपके Enum के अनुसार (VERIFIED / COMPLETED)
          activatedAt,
          maturesAt, // 💡 यहाँ एडमिन द्वारा चुनी गई (या डिफ़ॉल्ट +30 दिन वाली) तारीख सेव होगी
        },
      })

      // 4. वॉलेट के 'totalInvested' काउंटर को सेफली बढ़ाएं (Race Conditions से बचने के लिए increment का उपयोग)
      await tx.passiveWallet.update({
        where: { id: updatedInvestment.passiveWalletId },
        data: {
          totalInvested: {
            increment: updatedInvestment.amount,
          },
        },
      })

      return { success: true, maturesAt: updatedInvestment.maturesAt }
    })
  } catch (error: any) {
    console.error("Activation failed:", error)
    return { success: false, error: error?.message || "Failed to activate investment" }
  }
}

export async function updateMaturityDate(investmentId: string, newMaturityDate: Date) {
  console.log("Overriding Maturity Date for ID:", investmentId, "New Date:", newMaturityDate)
  try {
    const updated = await prisma.passiveInvestment.update({
      where: { id: investmentId },
      data: {
        maturesAt: new Date(newMaturityDate),
      },
    })
    return { success: true, maturesAt: updated.maturesAt }
  } catch (error: any) {
    console.error("Failed to update maturity date:", error)
    return { success: false, error: error?.message || "Failed to update maturity date" }
  }
}

export async function rejectInvestment(investmentId: string, remarks?: string) {
  console.log("Rejecting Investment ID:", investmentId)
  try {
    const updatedInvestment = await prisma.passiveInvestment.update({
      where: { id: investmentId },
      data: {
        status: "REJECTED", // सुनिश्चित करें कि आपके Prisma Enum में REJECTED मौजूद है
        remarks: remarks || "Declined by administrator during verification.",
      },
    })

    return { success: true, status: updatedInvestment.status }
  } catch (error) {
    console.error("Rejection failed:", error)
    return { success: false, error: "Failed to reject investment request" }
  }
}