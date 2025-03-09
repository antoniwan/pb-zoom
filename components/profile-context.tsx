"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { Profile, ProfileSection, Category } from "@/lib/db"
import { toast } from "@/hooks/use-toast"

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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSavedProfile, setLastSavedProfile] = useState(initialProfile)

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates }
      // Only mark as unsaved if there are actual changes
      if (JSON.stringify(updated) !== JSON.stringify(lastSavedProfile)) {
        setHasUnsavedChanges(true)
      }
      return updated
    })
  }, [lastSavedProfile])

  const saveProfile = useCallback(async () => {
    if (!hasUnsavedChanges) return true
    
    setIsSaving(true)
    try {
      const success = await onSave(profile)
      if (success) {
        setHasUnsavedChanges(false)
        setLastSavedProfile(profile)
        toast({
          title: "Changes saved",
          description: "Your profile has been updated successfully.",
        })
      }
      return success
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error saving profile",
        description: "Your changes could not be saved. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsSaving(false)
    }
  }, [profile, onSave, hasUnsavedChanges])

  // Auto-save with debouncing
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const timer = setTimeout(() => {
      saveProfile()
    }, 2000) // Auto-save after 2 seconds of no changes

    return () => clearTimeout(timer)
  }, [hasUnsavedChanges, saveProfile])

  // Warn before closing with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  const addSection = useCallback((section: ProfileSection) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        sections: [...prev.sections, section],
      }
      if (JSON.stringify(updated) !== JSON.stringify(lastSavedProfile)) {
        setHasUnsavedChanges(true)
      }
      return updated
    })
    setActiveSection(section._id)
  }, [lastSavedProfile])

  const removeSection = useCallback((id: string) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        sections: prev.sections.filter((section) => section._id !== id),
      }
      if (JSON.stringify(updated) !== JSON.stringify(lastSavedProfile)) {
        setHasUnsavedChanges(true)
      }
      return updated
    })
    setActiveSection(null)
  }, [lastSavedProfile])

  const moveSection = useCallback((oldIndex: number, newIndex: number) => {
    setProfile((prev) => {
      const sections = [...prev.sections]
      const [movedSection] = sections.splice(oldIndex, 1)
      sections.splice(newIndex, 0, movedSection)
      const updated = {
        ...prev,
        sections,
      }
      if (JSON.stringify(updated) !== JSON.stringify(lastSavedProfile)) {
        setHasUnsavedChanges(true)
      }
      return updated
    })
  }, [lastSavedProfile])

  const updateSection = useCallback((id: string, updates: Partial<ProfileSection>) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        sections: prev.sections.map((section) => 
          section._id === id ? { ...section, ...updates } : section
        ),
      }
      if (JSON.stringify(updated) !== JSON.stringify(lastSavedProfile)) {
        setHasUnsavedChanges(true)
      }
      return updated
    })
  }, [lastSavedProfile])

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

