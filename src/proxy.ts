import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  console.log("Requested Pathname:", token ? `${token.username} (${token.role})` : "No Token", "->", pathname);

  // 2. Protect Admin Routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const url = new URL("/sign-in", req.url);
    //   url.searchParams.set("callbackUrl", pathname);
    console.log("Redirecting to:", url.toString());
      return NextResponse.redirect(url);
    }

    if (token.role !== "ADMIN") {
      // If logged in but NOT an admin, send to Associate Dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // 3. Protect Associate Dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

// 4. Configure Matcher
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};