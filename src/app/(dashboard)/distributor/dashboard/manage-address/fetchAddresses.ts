"use server"

import prisma from "@/lib/prisma" // अपने प्रोजेक्ट की पाथ सेट करें
import { auth } from "@/lib/auth"

export interface UserAddressData {
  id: string
  receiverName: string
  receiverMobile: string
  addressLine: string
  landmark: string | null
  district: string
  state: string
  pinCode: string
  addressType: "HOME" | "WORK" | "OTHER"
  isDefault: boolean
}

export async function getUserAddresses(): Promise<{ success: boolean; data?: UserAddressData[]; error?: string }> {
  try {
    // 1. एक्टिव सेशन की जांच करें
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized access: Please login." }
    }

    // 2. डेटाबेस से एड्रेस लिस्ट निकालें (Default Address पहले आएगा)
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" }
      ]
    })

    // 3. सुरक्षित रूप से डेटा फॉर्मेट मैप करें
    const formattedAddresses: UserAddressData[] = addresses.map((addr) => ({
      id: addr.id,
      receiverName: addr.receiverName,
      receiverMobile: addr.receiverMobile,
      addressLine: addr.addressLine,
      landmark: addr.landmark,
      district: addr.district,
      state: addr.state,
      pinCode: addr.pinCode,
      addressType: addr.addressType as "HOME" | "WORK" | "OTHER",
      isDefault: addr.isDefault,
    }))

    return { success: true, data: formattedAddresses }
  } catch (error) {
    console.error("Error fetching user addresses:", error)
    return { success: false, error: "Failed to load address registry." }
  }
}