"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ProfileEditor } from "@/components/profile-editor/profile-editor"
import { ProfileProvider } from "@/components/profile-context"
import { toast } from "@/hooks/use-toast"
import type { Profile } from "@/lib/db"

export default function ProfileEditPage() {
  const params = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch profile")
        const data = await response.json()
        setProfile(data)
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
    }

    if (params.id) {
      fetchProfile()
    }
  }, [params.id])

  const updateProfile = (updates: Partial<Profile>) => {
    if (!profile) return
    setProfile({ ...profile, ...updates })
  }

  const saveProfile = async () => {
    if (!profile) return

    try {
      const response = await fetch(`/api/profiles/${profile._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      if (!response.ok) throw new Error("Failed to save profile")

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      console.error("Error saving profile:", error)
      throw error
    }
  }

  return (
    <ProfileProvider profile={profile} updateProfile={updateProfile} saveProfile={saveProfile} isLoading={isLoading}>
      <ProfileEditor />
    </ProfileProvider>
  )
}

