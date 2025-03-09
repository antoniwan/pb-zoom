import type React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoadingSpinner({ className, ...props }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent text-muted-foreground",
        className,
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

