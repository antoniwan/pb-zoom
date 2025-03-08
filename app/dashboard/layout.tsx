import type React from "react"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { LayoutDashboard, Users, Settings } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              Profile Builder
            </Link>
            <nav className="hidden space-x-4 md:flex">
              <Link href="/dashboard" className="flex items-center gap-1 text-sm font-medium hover:text-primary">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/profiles"
                className="flex items-center gap-1 text-sm font-medium hover:text-primary"
              >
                <Users className="h-4 w-4" />
                Profiles
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-1 text-sm font-medium hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
          <UserNav />
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}

