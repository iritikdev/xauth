// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function proxy(req: NextRequest) {

//   const token = await getToken({
//     req,
//     secret: process.env.AUTH_SECRET,
//   });

//   const { pathname } = req.nextUrl;

//   console.log(
//     "Requested Path:",
//     token ? `${token.username} (${token.role})` : "No Token",
//     "->",
//     pathname
//   );

//   // Protect Admin Routes
//   if (pathname.startsWith("/admin")) {

//     // Not logged in
//     if (!token) {
//       const url = new URL("/sign-in", req.nextUrl.origin);
//       return NextResponse.redirect(url);
//     }

//     // Logged in but not admin
//     if (token.role !== "ADMIN") {
//       const url = new URL("/dashboard", req.nextUrl.origin);
//       return NextResponse.redirect(url);
//     }
//   }

//   // Protect User Dashboard
//   if (pathname.startsWith("/dashboard")) {

//     if (!token) {
//       const url = new URL("/sign-in", req.nextUrl.origin);
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/dashboard/:path*",
//   ],
// };


import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req:NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};