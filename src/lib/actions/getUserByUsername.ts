// lib/actions/getUserByUsername.ts
import prisma from "@/lib/prisma"

export async function getUserByUsername(username: string) {
    if (!username) return null

    const user = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            name: true,
            fatherName: true,
            motherName: true,

            address: true,
            district: true,
            state: true,
            pincode: true,

            accountNo: true,
            ifsc: true,
            branch: true,
            username: true,
            mobile: true,
            email: true,
            aadharNo: true,
            panNumber: true,
            createdAt: true
        }
    })

    return user
}