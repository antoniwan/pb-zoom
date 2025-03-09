import type React from "react"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { LayoutDashboard, Settings } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
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
                href="/dashboard/settings"
                className="flex items-center gap-1 text-sm font-medium hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
          <UserNav />
          <button className="md:hidden ml-2 p-2 rounded-md hover:bg-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}

