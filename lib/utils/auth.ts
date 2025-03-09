import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

/**
 * Get the current session on the server
 */
export async function getSession() {
  return await getServerSession(authOptions)
}

/**
 * Check if the user is authenticated on the server
 * Redirects to login if not authenticated
 */
export async function requireAuth(redirectTo = "/auth/login") {
  const session = await getSession()

  if (!session?.user) {
    redirect(redirectTo)
  }

  return session
}

/**
 * Check if the user is an admin on the server
 * Redirects to dashboard if not an admin
 */
export async function requireAdmin(redirectTo = "/dashboard") {
  const session = await getSession()

  if (!session?.user) {
    redirect("/auth/login")
  }

  if (session.user.email !== process.env.ADMIN_EMAIL) {
    redirect(redirectTo)
  }

  return session
}

/**
 * Check if the current user owns a resource
 */
export async function checkResourceOwnership(userId: string) {
  const session = await getSession()

  if (!session?.user) {
    return false
  }

  // Admin can access any resource
  if (session.user.email === process.env.ADMIN_EMAIL) {
    return true
  }

  return session.user.id === userId
}

