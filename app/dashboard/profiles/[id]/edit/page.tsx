"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProfileEditor } from "@/components/profile-editor/profile-editor"
import { ProfileProvider } from "@/components/profile-context"
import { toast } from "@/hooks/use-toast"
import type { Profile } from "@/lib/db"

export default function ProfileEditPage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    if (!params.id) return

    try {
      setIsLoading(true)
      // Use absolute URL to avoid issues
      const baseUrl = window.location.origin
      const response = await fetch(`${baseUrl}/api/profiles/${params.id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      // Handle both response formats
      const profileData = data.data || data

      setProfile(profileData)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateProfile = useCallback(
    (updates: Partial<Profile>) => {
      if (!profile) return
      setProfile({ ...profile, ...updates })
    },
    [profile],
  )

  const saveProfile = useCallback(async () => {
    if (!profile) throw new Error("No profile to save")

    try {
      // Use absolute URL to avoid issues
      const baseUrl = window.location.origin
      const response = await fetch(`${baseUrl}/api/profiles/${profile._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        throw new Error("Failed to save profile")
      }

      const data = await response.json()
      // Handle both response formats
      const updatedProfile = data.data || data

      setProfile(updatedProfile)
      toast({
        title: "Success",
        description: "Profile saved successfully.",
      })

      return updatedProfile
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }, [profile])

  const handleBack = useCallback(() => {
    router.push("/dashboard")
  }, [router])

  // Render the dumb UI component with all the data and handlers
  return (
    <ProfileProvider profile={profile} updateProfile={updateProfile} saveProfile={saveProfile} isLoading={isLoading}>
      <ProfileEditor
        profile={profile}
        updateProfile={updateProfile}
        saveProfile={saveProfile}
        isLoading={isLoading}
        onBack={handleBack}
      />
    </ProfileProvider>
  )
}

