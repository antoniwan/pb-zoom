"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useCallback } from "react"
import { useRouter } from "next/navigation"

/**
 * Hook for authentication state and actions
 */
export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = useCallback(
    async (
      provider: string,
      { email, password, callbackUrl }: { email?: string; password?: string; callbackUrl?: string } = {},
    ) => {
      try {
        const result = await signIn(provider, {
          email,
          password,
          callbackUrl: callbackUrl || "/dashboard",
          redirect: false,
        })

        if (result?.error) {
          return { success: false, error: result.error }
        }

        if (result?.url) {
          router.push(result.url)
        }

        return { success: true }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "An error occurred during login",
        }
      }
    },
    [router],
  )

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: "/" })
  }, [])

  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
    login,
    logout,
  }
}

