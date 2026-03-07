import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ username: string }> } // Define params as a Promise
) {
  try {
    // UNWRAP PARAMS FIRST
    const { username } = await params; 
    
    const { currentPassword, newPassword } = await req.json();
    
    // 1. Find user using the unwrapped username
    const user = await prisma.user.findUnique({ 
      where: { username: username } 
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. Verify old password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Incorrect current password" }, { status: 400 });
    }

    // 3. Hash and Update
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { username: username },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    console.error("PASSWORD_UPDATE_ERROR", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}