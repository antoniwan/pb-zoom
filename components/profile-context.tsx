"use client"

import type React from "react"

import { createContext, useContext } from "react"
import type { Profile } from "@/lib/db"

interface ProfileContextType {
  profile: Profile | null
  updateProfile: (updates: Partial<Profile>) => void
  saveProfile: () => Promise<Profile>
  isLoading: boolean
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  updateProfile: () => {},
  saveProfile: async () => {
    throw new Error("Not implemented")
  },
  isLoading: true,
})

export const useProfile = () => useContext(ProfileContext)

interface ProfileProviderProps {
  children: React.ReactNode
  profile: Profile | null
  updateProfile: (updates: Partial<Profile>) => void
  saveProfile: () => Promise<Profile>
  isLoading: boolean
}

export function ProfileProvider({ children, profile, updateProfile, saveProfile, isLoading }: ProfileProviderProps) {
  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        saveProfile,
        isLoading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

