"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const searchParams = useSearchParams()
  const errorType = searchParams.get("error")

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  useEffect(() => {
    if (errorType === "OAuthSignin") setError("Error signing in with OAuth provider")
    if (errorType === "OAuthCallback") setError("Error during OAuth callback")
    if (errorType === "OAuthCreateAccount") setError("Error creating OAuth account")
    if (errorType === "EmailCreateAccount") setError("Error creating email account")
    if (errorType === "Callback") setError("Error during callback")
    if (errorType === "OAuthAccountNotLinked") setError("Email already used with different provider")
    if (errorType === "EmailSignin") setError("Error sending email signin link")
    if (errorType === "CredentialsSignin") setError("Invalid credentials")
    if (errorType === "SessionRequired") setError("Please sign in to access this page")
  }, [errorType])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }

      router.push("/dashboard")
    } catch (error) {
      console.log(error);
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Only render the login form if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center mb-2">
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && <div className="rounded-md bg-red-50 p-2 text-sm text-red-500">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" {...register("email")} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // This return is just a fallback - the component should redirect before reaching here
  return null
}

