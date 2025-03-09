"use client"

import { useState, useEffect } from "react"
import type { Profile } from "@/lib/db"

interface UseProfileReturn {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  saveProfile: (updates: Partial<Profile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

export function useProfile(id: string): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/profiles/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Profile not found")
        } else {
          throw new Error("Failed to fetch profile")
        }
        return
      }

      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError("An error occurred while fetching the profile")
    } finally {
      setIsLoading(false)
    }
  }

  const saveProfile = async (updates: Partial<Profile>) => {
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

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [id])

  return {
    profile,
    isLoading,
    error,
    saveProfile,
    refreshProfile: fetchProfile,
  }
} 