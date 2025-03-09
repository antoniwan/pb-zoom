import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The profile you're looking for doesn't exist or is set to private.</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/profiles/new">Create Your Profile</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

