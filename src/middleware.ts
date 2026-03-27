import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  // Debugging ke liye token check karte rahein
  console.log("TOKEN:", token);
  
  const { pathname } = req.nextUrl;

  // 1. Ab dono paths (/admin aur /dashboard) ke liye sirf login check hoga
  const isProtectedRoute =  pathname.startsWith("/dashboard");

  if (isProtectedRoute) {
    if (!token) {
      // Agar logged in nahi hai, toh sign-in par bhejo
      const url = new URL("/sign-in", req.url);
      return NextResponse.redirect(url);
    }
    
    // Yahan pehle role check tha, use humne hata diya hai.
    // Ab koi bhi authenticated wuser aage badh sakta hai.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};