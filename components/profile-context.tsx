"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback } from "react"
import type { Profile, ProfileSection, Category } from "@/lib/db"

interface ProfileContextType {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
  saveProfile: () => Promise<boolean>
  isSaving: boolean
  activeSection: string | null
  setActiveSection: (id: string | null) => void
  addSection: (section: ProfileSection) => void
  removeSection: (id: string) => void
  moveSection: (oldIndex: number, newIndex: number) => void
  updateSection: (id: string, updates: Partial<ProfileSection>) => void
  categories: Category[]
  setCategories: (categories: Category[]) => void
}

const ProfileContext = createContext<ProfileContextType | null>(null)

export function ProfileProvider({
  children,
  initialProfile,
  onSave,
}: {
  children: React.ReactNode
  initialProfile: Profile
  onSave: (profile: Profile) => Promise<boolean>
}) {
  const [profile, setProfile] = useState(initialProfile)
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
  }, [])

  const saveProfile = useCallback(async () => {
    setIsSaving(true)
    try {
      const success = await onSave(profile)
      return success
    } catch (error) {
      console.error("Error saving profile:", error)
      return false
    } finally {
      setIsSaving(false)
    }
  }, [profile, onSave])

  const addSection = useCallback((section: ProfileSection) => {
    setProfile((prev) => ({
      ...prev,
      sections: [...prev.sections, section],
    }))
    setActiveSection(section._id)
  }, [])

  const removeSection = useCallback((id: string) => {
    setProfile((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section._id !== id),
    }))
    setActiveSection(null)
  }, [])

  const moveSection = useCallback((oldIndex: number, newIndex: number) => {
    setProfile((prev) => {
      const sections = [...prev.sections]
      const [movedSection] = sections.splice(oldIndex, 1)
      sections.splice(newIndex, 0, movedSection)
      return {
        ...prev,
        sections,
      }
    })
  }, [])

  const updateSection = useCallback((id: string, updates: Partial<ProfileSection>) => {
    setProfile((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section._id === id ? { ...section, ...updates } : section
      ),
    }))
  }, [])

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        saveProfile,
        isSaving,
        activeSection,
        setActiveSection,
        addSection,
        removeSection,
        moveSection,
        updateSection,
        categories,
        setCategories,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}

