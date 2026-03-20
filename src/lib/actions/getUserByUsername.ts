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
            photoUrl: true,

            address: true,
            district: true,
            state: true,
            pincode: true,

            accountNo: true,
            upiId: true,
            nomineeName: true,
            nomineeRelation: true,
            nomineeMobile: true,
            nomineeAadhaar: true,
            ifsc: true,
            branch: true,
            username: true,
            mobile: true,
            email: true,
            createdAt: true,
            personalBv:true,
            groupBv:true,
            Wallet:true,

            sponsorId: true,
            sponsor: true,
            downlines: true
        }
    })

    return user
}