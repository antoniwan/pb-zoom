import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import NextAuthSessionProvider from "@/components/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Profile Builder",
  description: "Create, customize, and share your personal profile page",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  )
}

import "./globals.css"

