"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ProfileEditLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-[300px]" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r bg-muted/30 flex flex-col h-[calc(100vh-4rem)]">
          <div className="p-4 border-b">
            <Skeleton className="h-9 w-full" />
          </div>

          <div className="flex items-center justify-between p-4 border-b">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>

          <div className="p-2 space-y-1">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
          </div>
        </div>

        <div className="flex-1 h-[calc(100vh-4rem)] p-8">
          <div className="container max-w-4xl">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-full max-w-md" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

