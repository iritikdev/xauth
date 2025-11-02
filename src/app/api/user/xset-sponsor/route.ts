// app/api/set-sponsor/route.ts

import { getUserByUsername } from "@/lib/actions/getUserByUsername"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const body = await req.json()
    const { currentUsername, sponsorUsername } = body

    try {
        // Get current user
        const user = await getUserByUsername(currentUsername)
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
        }

        if (user.sponsorId) {
            return NextResponse.json({ success: false, error: "Sponsor already set" }, { status: 400 })
        }

        // Get sponsor user
        const sponsor = await getUserByUsername(sponsorUsername)
        if (!sponsor) {
            return NextResponse.json({ success: false, error: "Sponsor not found" }, { status: 404 })
        }

        // Update current user's sponsorId
        await prisma.user.update({
            where: { username: currentUsername },
            data: {
                sponsorId: sponsor.username, // assuming username is unique
            },
        })


        return NextResponse.json({ success: true, message: "Sponsor set successfully" })


    } catch (error) {
        console.error("Error setting sponsor:", error)
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })


    }


}