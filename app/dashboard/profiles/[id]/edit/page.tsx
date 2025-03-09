"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useProfile } from "@/hooks/use-profile"

import { ProfileProvider } from "@/components/profile-context"
import { ProfileEditor } from "@/components/profile-editor"
import { ProfileNotFound } from "@/components/profile-not-found"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function EditProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { status } = useSession()
  const { profile, isLoading, error, saveProfile } = useProfile(id as string)

  // Handle authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  // Show loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    )
  }

  // Show error state
  if (error || !profile) {
    return <ProfileNotFound error={error} />
  }

  // Handle profile updates
  const handleSaveProfile = async (updates: Partial<typeof profile>) => {
    try {
      await saveProfile(updates)
      return true
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <ProfileProvider initialProfile={profile} onSave={handleSaveProfile}>
      <ProfileEditor />
    </ProfileProvider>
  )
}

