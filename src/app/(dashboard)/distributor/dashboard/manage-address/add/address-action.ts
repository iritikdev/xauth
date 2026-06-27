"use server"

import prisma from "@/lib/prisma" // अपने प्रोजेक्ट की लोकेशन के अनुसार बदलें
import { auth } from "@/lib/auth" // NextAuth या आपका ऑथेंटिकेशन हैंडलर
import { addressFormSchema } from "./address-schema" // आपका ज़ोड स्कीma
import { revalidatePath } from "next/cache"

export async function saveUserAddress(formData: unknown) {
  try {
    // 1. यूज़र ऑथेंटिकेशन और सेशन की जांच करें
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized: Please login to save address." }
    }

    const userId = session.user.id

    // 2. ज़ोड (Zod) के जरिए सर्वर-साइड डेटा वैलिडेशन
    const validatedFields = addressFormSchema.safeParse(formData)
    if (!validatedFields.success) {
      return { 
        success: false, 
        error: "Validation Failed", 
        details: validatedFields.error.flatten().fieldErrors 
      }
    }

    const data = validatedFields.data

    // 3. एटॉमिक ट्रांजैक्शन (Prisma Transaction) का उपयोग करके डेटाबेस राइट करें
    const newAddress = await prisma.$transaction(async (tx) => {
      
      // 💡 यदि नया एड्रेस डिफ़ॉल्ट (isDefault: true) सेट किया जा रहा है,
      // तो यूज़र के बाकी सभी एड्रेसेस को बैकग्राउंड में 'false' कर दें।
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        })
      } else {
        // सुरक्षा जांच: अगर यूज़र का यह पहला एड्रेस है, तो इसे ऑटोमैटिकली डिफ़ॉल्ट बना दें
        const existingCount = await tx.address.count({ where: { userId } })
        if (existingCount === 0) {
          data.isDefault = true
        }
      }

      // 4. डेटाबेस में नया रिकॉर्ड बनाएं
      return await tx.address.create({
        data: {
          userId,
          receiverName: data.receiverName, // आपके फॉर्म स्टेट का नाम स्कीमा से मैप हो रहा है
          receiverMobile: data.receiverMobile,
          addressLine: data.addressLine,
          landmark: data.landmark || null,
          pinCode: data.pinCode,
          state: data.state,
          district: data.district,
          addressType: data.addressType, // HOME, WORK, OTHER (Enum matching)
          isDefault: data.isDefault || false,
          // latitude: data.latitude || null,   // GPS कोऑर्डिनेट्स हैंडलिंग
          // longitude: data.longitude || null,
        },
      })
    })

    // 5. कैश रीवैलिडेट करें ताकि यूज़र को नया एड्रेस तुरंत डैशबोर्ड पर दिखे
    revalidatePath("/profile/addresses")
    revalidatePath("/checkout")

    return { success: true, data: newAddress }
  } catch (error: any) {
    console.error("Database Server Action Error:", error)
    return { success: false, error: error?.message || "Internal server mutation failure." }
  }
}




export async function deleteUserAddress(addressId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized access: Please login." }
    }

    const userId = session.user.id

    await prisma.$transaction(async (tx) => {
      // 1. जांचें कि क्या एड्रेस मौजूद है और उसी यूज़र का है
      const targetAddress = await tx.address.findFirst({
        where: { id: addressId, userId }
      })

      if (!targetAddress) {
        throw new Error("Address not found or already removed.")
      }

      // 2. एड्रेस को डिलीट करें
      await tx.address.delete({
        where: { id: addressId }
      })

      // 3. यदि डिलीट हुआ एड्रेस डिफ़ॉल्ट था, तो किसी दूसरे एड्रेस को डिफ़ॉल्ट बनाएं
      if (targetAddress.isDefault) {
        const nextAddress = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" }
        })

        if (nextAddress) {
          await tx.address.update({
            where: { id: nextAddress.id },
            data: { isDefault: true }
          })
        }
      }
    })

    // नेक्स्ट जेएस सर्वर कैश रिफ्रेश करें
    revalidatePath("/profile/addresses")
    revalidatePath("/checkout")

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting address:", error)
    return { success: false, error: error?.message || "Failed to remove address node." }
  }
}

export async function updateExistingAddress(addressId: string, formData: unknown) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized: Please login to continue." }
    }

    const userId = session.user.id

    // ज़ोड वैलिडेशन
    const validatedFields = addressFormSchema.safeParse(formData)
    if (!validatedFields.success) {
      return { success: false, error: "Validation Failed", details: validatedFields.error.flatten().fieldErrors }
    }

    const data = validatedFields.data

    const updatedAddress = await prisma.$transaction(async (tx) => {
      // यदि इसे डिफ़ॉल्ट सेट किया जा रहा है, तो बाकी सबको false करें
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        })
      }

      return await tx.address.update({
        where: { id: addressId, userId }, // सुरक्षा: सुनिश्चित करें कि यह एड्रेस इसी यूज़र का है
        data: {
          receiverName: data.receiverName,
          receiverMobile: data.receiverMobile,
          addressLine: data.addressLine,
          landmark: data.landmark || null,
          pinCode: data.pinCode,
          state: data.state,
          district: data.district,
          addressType: data.addressType,
          isDefault: data.isDefault || false,
        },
      })
    })

    revalidatePath("/profile/addresses")
    return { success: true, data: updatedAddress }
  } catch (error: any) {
    console.error("Database Update Error:", error)
    return { success: false, error: error?.message || "Failed to update address record." }
  }
}