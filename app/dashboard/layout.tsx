import type React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session

  try {
    session = await getServerSession(authOptions)
  } catch (error) {
    console.error("Session error:", error)
    redirect("/auth/login?error=session")
  }

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              Profile Builder
            </Link>
            <nav className="hidden space-x-4 md:flex">
              <Link href="/dashboard" className="text-sm font-medium hover:underline">
                Dashboard
              </Link>
              <Link href="/dashboard/profiles" className="text-sm font-medium hover:underline">
                Profiles
              </Link>
              <Link href="/dashboard/settings" className="text-sm font-medium hover:underline">
                Settings
              </Link>
            </nav>
          </div>
          <UserNav user={session.user} />
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}

