import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Check if the path starts with /dashboard (protected routes)
  if (pathname.startsWith("/dashboard")) {
    // If the user is not authenticated, redirect to the login page
    if (!token) {
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
      return NextResponse.redirect(url)
    }
  }

  // Check if the path starts with /auth (auth routes)
  if (pathname.startsWith("/auth")) {
    // If the user is authenticated, redirect to the dashboard
    if (token) {
      // If there's a callbackUrl in the URL, use that, otherwise go to dashboard
      const callbackUrl = new URL(request.url).searchParams.get("callbackUrl")
      if (callbackUrl) {
        return NextResponse.redirect(callbackUrl)
      }
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}

