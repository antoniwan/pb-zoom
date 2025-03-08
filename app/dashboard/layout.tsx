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
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-110">
                Ñ
              </span>
              <span className="text-sm font-medium bg-gradient-to-r from-primary/80 to-purple-400/80 bg-clip-text text-transparent transition-all duration-300">
                enye.social
              </span>
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

