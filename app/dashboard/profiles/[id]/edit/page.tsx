"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Profile } from "@/lib/models"
import { ProfileBasicInfo } from "@/components/profile-editor/basic-info"
import { ProfileThemeEditor } from "@/components/profile-editor/theme-editor"
import { ProfileSectionsEditor } from "@/components/profile-editor/sections-editor"
import { ProfileSocialEditor } from "@/components/profile-editor/social-editor"
import { ProfilePreview } from "@/components/profile-preview"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { use } from "react"

export default function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Properly await params using React.use()
  const { id: profileId } = use(params)

  const { data: session, status } = useSession()
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
        } catch (error) {
          console.error("Error fetching profile:", error)
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
          <h1 className="text-2xl font-bold">Edit Profile: {profile.title}</h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardContent className="pt-6">
              <ProfileBasicInfo profile={profile} updateProfile={updateProfile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardContent className="pt-6">
              <ProfileThemeEditor profile={profile} updateProfile={updateProfile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections">
          <Card>
            <CardContent className="pt-6">
              <ProfileSectionsEditor profile={profile} updateProfile={updateProfile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardContent className="pt-6">
              <ProfileSocialEditor profile={profile} updateProfile={updateProfile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <ProfilePreview profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

