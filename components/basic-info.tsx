"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { Profile } from "@/lib/models"

interface ProfileBasicInfoProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

export function ProfileBasicInfo({ profile, updateProfile }: ProfileBasicInfoProps) {
  const [slugError, setSlugError] = useState<string | null>(null)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProfile({ title: e.target.value })

    // Auto-generate slug from title if user hasn't manually edited the slug
    if (!profile.slug || profile.slug === generateSlug(profile.title)) {
      const newSlug = generateSlug(e.target.value)
      updateProfile({ slug: newSlug })
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = generateSlug(e.target.value)

    if (newSlug !== e.target.value) {
      setSlugError("Slug can only contain lowercase letters, numbers, and hyphens")
    } else {
      setSlugError(null)
    }

    updateProfile({ slug: newSlug })
  }

  const handlePublicChange = (checked: boolean) => {
    updateProfile({ isPublic: checked })
  }

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Profile Title</Label>
        <Input id="title" value={profile.title} onChange={handleTitleChange} placeholder="My Awesome Profile" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Profile URL</Label>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">example.com/p/</span>
          <Input
            id="slug"
            value={profile.slug}
            onChange={handleSlugChange}
            placeholder="my-awesome-profile"
            className={slugError ? "border-red-500" : ""}
          />
        </div>
        {slugError && <p className="text-sm text-red-500">{slugError}</p>}
        <p className="text-sm text-muted-foreground">This is the URL where your profile will be accessible.</p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="public" checked={profile.isPublic} onCheckedChange={handlePublicChange} />
        <Label htmlFor="public">Make profile public</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="layout">Layout</Label>
        <select
          id="layout"
          value={profile.layout}
          onChange={(e) => updateProfile({ layout: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="standard">Standard</option>
          <option value="grid">Grid</option>
          <option value="magazine">Magazine</option>
          <option value="custom">Custom</option>
        </select>
        <p className="text-sm text-muted-foreground">Choose how your profile content will be arranged.</p>
      </div>
    </div>
  )
}

