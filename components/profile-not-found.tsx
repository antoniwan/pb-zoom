"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"

export function ProfileNotFound({ error }: { error: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="rounded-full bg-red-100 p-3 mb-4">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error || "The profile you're looking for doesn't exist or you don't have permission to access it."}
      </p>
      <Button asChild>
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  )
}

