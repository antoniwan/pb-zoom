"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "@/hooks/use-toast"

import { ProfileProvider } from "@/components/profile-context"
import { ProfileEditor } from "@/components/profile-editor"
import { ProfileNotFound } from "@/components/profile-not-found"
import { ProfileEditLoading } from "@/components/profile-edit-loading"

import type { Profile } from "@/lib/db"

export default function EditProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const { status } = useSession()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }

    if (status === "authenticated") {
      const fetchProfile = async () => {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/profiles/${id}`)

          if (!response.ok) {
            if (response.status === 404) {
              setError("Profile not found")
            } else {
              throw new Error("Failed to fetch profile")
            }
          } else {
            const data = await response.json()
            setProfile(data)
          }
        } catch (error) {
          console.error("Error fetching profile:", error)
          setError("An error occurred while fetching the profile")
          toast({
            title: "Error",
            description: "Failed to load profile. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      fetchProfile()
    }
  }, [status, id, router])

  const handleSaveProfile = async (updates: Partial<Profile>) => {
    try {
      const response = await fetch(`/api/profiles/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      await response.json()
      setProfile((prev) => prev ? { ...prev, ...updates } : null)

      return true
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  if (isLoading) {
    return <ProfileEditLoading />
  }

  if (error || !profile) {
    return <ProfileNotFound error={error} />
  }

  return (
    <ProfileProvider initialProfile={profile} onSave={handleSaveProfile}>
      <ProfileEditor />
    </ProfileProvider>
  )
}

