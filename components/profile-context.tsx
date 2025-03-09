"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Profile } from "@/lib/db"

interface ProfileContextType {
  profile: Profile | null
  updateProfile: (updates: Partial<Profile>) => void
  saveProfile: () => Promise<Profile>
  isLoading: boolean
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}

interface ProfileProviderProps {
  children: ReactNode
  profile: Profile | null
  updateProfile: (updates: Partial<Profile>) => void
  saveProfile: () => Promise<Profile>
  isLoading: boolean
}

export function ProfileProvider({ children, profile, updateProfile, saveProfile, isLoading }: ProfileProviderProps) {
  return (
    <ProfileContext.Provider value={{ profile, updateProfile, saveProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  )
}

