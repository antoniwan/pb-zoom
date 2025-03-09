"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      setHasError(true)
      setError(error.error || new Error(error.message))
      // Prevent the default error handling
      error.preventDefault()
    }

    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  if (hasError) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 border rounded-lg bg-red-50">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mb-4">{error?.message || "An unexpected error occurred"}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      )
    )
  }

  return <>{children}</>
}

