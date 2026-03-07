import prisma from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await prisma.user.findUnique({
      where: { username },
      include: { kycDocument: true } 
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Return the document object or an empty object if no KYC record exists yet
    return NextResponse.json(user.kycDocument || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch KYC" }, { status: 500 });
  }
}