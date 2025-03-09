"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ProfileEditLoading() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-14 items-center px-4">
          <div className="flex items-center gap-2 mr-auto">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:block w-[280px] border-r bg-muted/30">
          <div className="p-4 space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>

          <div className="px-4 py-2 border-t border-b">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>

            <div className="space-y-2 py-4">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="container py-6 px-4 md:px-6">
            <Skeleton className="h-10 w-full max-w-md mb-4" />
            <Skeleton className="h-6 w-full max-w-sm mb-8" />

            <div className="space-y-4">
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

