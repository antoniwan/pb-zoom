"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Save, ArrowLeft } from "lucide-react"
import type { Profile, ProfileSection } from "@/lib/db"
import { ProfileEditorTabs } from "@/components/profile-editor/tabs"
import Link from "next/link"
import { use } from "react"
import { v4 as uuidv4 } from "uuid"
import { z } from 'zod'
import { toast } from '@/hooks/use-toast'

// Add a function to ensure all sections have an _id before updating
const ensureSectionIds = (sections: ProfileSection[] = []): ProfileSection[] => {
  return sections.map((section) => {
    if (!section._id) {
      return {
        ...section,
        _id: uuidv4(),
        type: section.type as "bio" | "attributes" | "gallery" | "videos" | "markdown" | "custom",
        content: {
          text: section.content.text || "",
          attributes: section.content.attributes || [],
          images: section.content.images || [],
          videos: section.content.videos || [],
          markdown: section.content.markdown || "",
          html: section.content.html || "",
        },
      }
    }
    return section
  })
}

// Define validation schemas
const profilePictureSchema = z.object({
  url: z.string().url(),
  altText: z.string().optional(),
  isPrimary: z.boolean(),
})

const profileHeaderSchema = z.object({
  name: z.string(),
  title: z.string(),
  subtitle: z.string(),
  shortBio: z.string(),
  pictures: z.array(profilePictureSchema),
})

const profileSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "URL slug is required"),
  isPublic: z.boolean(),
  header: profileHeaderSchema,
  theme: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    backgroundColor: z.string(),
    textColor: z.string(),
    fontFamily: z.string(),
    customCSS: z.string().optional(),
  }),
  layout: z.string(),
  sections: z.array(z.any()),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url("Please enter a valid URL"),
    icon: z.string().optional(),
  })),
})

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

  const validateProfile = (data: any): { isValid: boolean; errors: string[] } => {
    try {
      profileSchema.parse(data)
      return { isValid: true, errors: [] }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => {
          const field = err.path.join('.')
          return `${field}: ${err.message}`
        })
        return { isValid: false, errors }
      }
      return { isValid: false, errors: ['Invalid profile data'] }
    }
  }

  const handleSave = async () => {
    if (!profile) return

    setIsSaving(true)
    setError(null)

    // Validate profile data before sending to server
    const validation = validateProfile(profile)
    if (!validation.isValid) {
      setError(validation.errors.join('\n'))
      setIsSaving(false)
      toast({
        title: "Validation Error",
        description: validation.errors.join('\n'),
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/profiles/${profileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile")
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      const message = error instanceof Error ? error.message : "Failed to update profile"
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
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
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6 flex flex-col xs:flex-row space-y-3 xs:space-y-0 xs:items-center xs:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Profile: {profile.title}</h1>
        </div>
        <div className="flex gap-2">
          {profile.isPublic && (
            <Button variant="outline" asChild>
              <Link href={`/p/${profile.slug}`} target="_blank">
                View Profile
              </Link>
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500">
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      <ProfileEditorTabs profile={profile} updateProfile={updateProfile} />
    </div>
  )
}

