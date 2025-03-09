import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Paths that require authentication
const protectedPaths = ["/api/profiles", "/api/users", "/dashboard"]

// Paths that are public
const publicPaths = [
  "/api/auth",
  "/api/profiles/slug",
  "/api/users/*/profiles", // Public profiles endpoint
  "/",
  "/login",
  "/register",
  "/p/",
  "/u/",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(
    (path) => pathname.startsWith(path) && !publicPaths.some((publicPath) => pathname.startsWith(publicPath)),
  )

  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // Check for the session token
  const token = await getToken({ req: request })

  // If there's no token and the path is protected, return unauthorized
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: "unauthorized",
        message: "Authentication required",
      },
      { status: 401 },
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
}

