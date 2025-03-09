import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function ProfileCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <Skeleton className="h-4 w-48 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="h-40 rounded-md overflow-hidden border">
          <Skeleton className="h-8 w-full" />
          <div className="p-3">
            <div className="space-y-2">
              <div className="flex flex-col">
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-2 w-full" />
              </div>
              <div className="flex flex-col">
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </CardFooter>
    </Card>
  )
}

export function ProfileListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <ProfileCardSkeleton key={i} />
        ))}
    </div>
  )
}

