"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProfilePreview } from "@/components/profile-preview"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Profile } from "@/lib/models"
import { use } from "react"

export default function PreviewProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Properly await params using React.use()
  const { id: profileId } = use(params)

  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (status === "authenticated") {
      fetchProfile()
    }
  }, [status, router, profileId])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profiles/${profileId}`)

      if (!response.ok) {
        if (response.status === 404) {
          router.push("/dashboard")
          return
        }
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="mt-2 text-muted-foreground">
            The profile you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Preview: {profile.title}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/profiles/${profileId}/edit`}>Edit Profile</Link>
          </Button>
          {profile.isPublic && (
            <Button size="sm" asChild>
              <Link href={`/p/${profile.slug}`} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" /> View Public Profile
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <ProfilePreview profile={profile} />
      </Card>
    </div>
  )
}

