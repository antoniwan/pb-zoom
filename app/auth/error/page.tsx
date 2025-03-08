"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = () => {
    switch (error) {
      case "CredentialsSignin":
        return "Invalid email or password. Please try again."
      case "OAuthAccountNotLinked":
        return "To confirm your identity, sign in with the same account you used originally."
      case "OAuthSignin":
      case "OAuthCallback":
        return "There was a problem with the authentication service. Please try again."
      case "Verification":
        return "The verification link has expired or has already been used."
      case "AccessDenied":
        return "You do not have permission to access this resource."
      default:
        return "An unexpected error occurred. Please try again."
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold">Authentication Error</CardTitle>
          <CardDescription className="text-center">{getErrorMessage()}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href="/auth/login">Return to Sign In</Link>
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground">
            Need help?{" "}
            <a href="#" className="text-primary hover:underline">
              Contact Support
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

