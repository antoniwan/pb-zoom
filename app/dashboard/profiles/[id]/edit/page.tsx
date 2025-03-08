"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Save, ArrowLeft } from "lucide-react"
import type { Profile } from "@/lib/models"
import { ProfileEditorTabs } from "@/components/profile-editor/tabs"
import Link from "next/link"
import { use } from "react"

export default function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: profileId } = use(params)
  const { status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (status === "authenticated") {
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
        } catch (err) {
          console.error("Error fetching profile:", err)
          setError("Failed to load profile")
        } finally {
          setIsLoading(false)
        }
      }

      fetchProfile()
    }
  }, [status, router, profileId])

  const handleSave = async () => {
    if (!profile) return

    setIsSaving(true)

    try {
      const response = await fetch(`/api/profiles/${profileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Show success message or notification
    } catch (error) {
      console.error("Error updating profile:", error)
      // Show error message or notification
    } finally {
      setIsSaving(false)
    }
  }

  const updateProfile = (updates: Partial<Profile>) => {
    if (!profile) return
    setProfile({ ...profile, ...updates })
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Error</h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
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
            The profile you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
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
          <h1 className="text-2xl font-bold">Edit Profile: {profile.title}</h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <ProfileEditorTabs profile={profile} updateProfile={updateProfile} />
    </div>
  )
}

