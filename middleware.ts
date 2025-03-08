import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path starts with /dashboard
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    // If the user is not authenticated, redirect to the login page
    if (!token) {
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}

