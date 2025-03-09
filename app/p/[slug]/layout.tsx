import type React from "react"
import type { Metadata } from "next"
import "./styles.css"

export const metadata: Metadata = {
  title: {
    default: "Profile | ProfileBuilderX",
    template: "%s | ProfileBuilderX",
  },
  description: "View professional profiles created with ProfileBuilderX",
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen">{children}</div>
}

