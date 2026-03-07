"use server"
import prisma from "@/lib/prisma"

export async function getGenealogyTree(rootUsername: string, maxDepth: number = 15) {
  async function buildTree(username: string, currentLevel: number): Promise<any> {
    // 1. Stop if we exceed the 15th level
    if (currentLevel > maxDepth) return null;

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        downlines: {
          select: { username: true } 
        },
        kycDocument: { 
          select: { status: true } 
        }
      }
    })

    if (!user) return null

    // 2. Fetch children only if we haven't reached the limit
    let children = []
    if (currentLevel < maxDepth) {
      children = await Promise.all(
        user.downlines.map((downline) => buildTree(downline.username, currentLevel + 1))
      )
    }

    return {
      id: user.username,
      name: user.name || "Associate",
      rank: "Associate",
      level: currentLevel, // Store level for UI display
      status: user.kycDocument?.status === "VERIFIED" ? "Active" : "Inactive",
      totalTeam: user.downlines.length,
      mobile: user.mobile,
      children: children.filter(Boolean)
    }
  }

  return await buildTree(rootUsername, 1); // Start at Level 1
}