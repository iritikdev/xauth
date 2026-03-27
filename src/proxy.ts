import { getToken } from "next-auth/jwt";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const session = await auth();

  // Debugging ke liye token check karte rahein
  console.log("SESSION:", session);
  
  const { pathname } = req.nextUrl;

  // 1. Ab dono paths (/admin aur /dashboard) ke liye sirf login check hoga
  const isProtectedRoute =  pathname.startsWith("/dashboard");

  if (isProtectedRoute) {
    if (!session) {
      // Agar logged in nahi hai, toh sign-in par bhejo
      const url = new URL("/sign-in", req.url);
      return NextResponse.redirect(url);
    }
    
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};