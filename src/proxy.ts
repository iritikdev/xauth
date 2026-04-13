import { getToken } from "next-auth/jwt";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;
  
  // const adminId = process.env.ADMIN_USER_ID;
  // const token = await getToken({ req, secret: adminId });


  // if (pathname.startsWith("/admin")) {
  //   // Agar login nahi hai ya user ID match nahi karti
  //   if (!token || token.sub !== adminId) {
  //     console.log("Unauthorized access attempt!");
      
  //     // Redirect to a custom unauthorized page or login
  //     return NextResponse.redirect(new URL("/login?error=AccessDenied", req.url));
  //   }
  // }

  const isProtectedRoute =  pathname.startsWith("/dashboard");

  if (isProtectedRoute) {
    if (!session) {
      const url = new URL("/sign-in", req.url);
      return NextResponse.redirect(url);
    }
    
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};