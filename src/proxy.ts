// import { getToken } from "next-auth/jwt";
// import { auth } from "@/lib/auth";
// import { NextRequest, NextResponse } from "next/server";

// export async function proxy(req: NextRequest) {
//   const session = await auth();
//   const { pathname } = req.nextUrl;
  
  
//   // const adminId = process.env.ADMIN_USER_ID;
//   // const token = await getToken({ req, secret: adminId });


//   // if (pathname.startsWith("/admin")) {
//   //   // Agar login nahi hai ya user ID match nahi karti
//   //   if (!token || token.sub !== adminId) {
//   //     console.log("Unauthorized access attempt!");
      
//   //     // Redirect to a custom unauthorized page or login
//   //     return NextResponse.redirect(new URL("/login?error=AccessDenied", req.url));
//   //   }
//   // }

//   const isProtectedRoute =  pathname.startsWith("/distributor/dashboard");

//   if (isProtectedRoute) {
//     if (!session) {
//       const url = new URL("/sign-in", req.url);
//       return NextResponse.redirect(url);
//     }
    
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/distributor/:path*"],
// };

// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import {auth} from "@/lib/auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  console.log("Middleware: isLoggedIn:", isLoggedIn, "userRole:", userRole, "nextUrl:", nextUrl.pathname)

  // 1. अगर यूज़र लॉग इन नहीं है और /admin या /dashboard पर जाने की कोशिश कर रहा है
  if (!isLoggedIn && (nextUrl.pathname.startsWith("/admin") || nextUrl.pathname.startsWith("/distributor"))) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl))
  }

  // 2. ADMIN रूट सुरक्षा गेट
  if (nextUrl.pathname.startsWith("/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/distributor/dashboard", nextUrl)) // डिस्ट्रीब्यूटर डैशबोर्ड पर भेजें
  }

  // 3. DISTRIBUTOR रूट सुरक्षा गेट
  if (nextUrl.pathname.startsWith("/distributor") && userRole !== "DISTRIBUTOR") {
    // अगर एडमिन डिस्ट्रीब्यूटर पेज खोलने की कोशिश करे तो उसे एडमिन पैनल पर भेजें
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/distributor/:path*"],
}