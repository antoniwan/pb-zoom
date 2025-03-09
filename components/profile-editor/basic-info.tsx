"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategorySelector } from "@/components/profile-editor/category-selector"
import { LayoutSelector } from "@/components/profile-editor/layout-selector"
import type { Profile } from "@/lib/db"

interface ProfileBasicInfoProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

export function ProfileBasicInfo({ profile, updateProfile }: ProfileBasicInfoProps) {
  const [slugError, setSlugError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("general")

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProfile({ title: e.target.value })

    // Auto-generate slug if user hasn't manually edited the slug
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

  const handleCategoryChange = (categoryId: string | undefined) => {
    updateProfile({ categoryId })
  }

  const handleLayoutChange = (layout: string, options?: any) => {
    updateProfile({
      layout,
      layoutOptions: options,
    })
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="category">Category</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Profile Title</Label>
            <Input
              id="title"
              value={profile.title}
              onChange={handleTitleChange}
              placeholder="My Awesome Profile"
              className="rounded-xl"
            />
            <p className="text-sm text-muted-foreground">Give your profile a name that describes its purpose.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Profile URL</Label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">enye.social/p/</span>
              <Input
                id="slug"
                value={profile.slug}
                onChange={handleSlugChange}
                placeholder="my-awesome-profile"
                className={slugError ? "border-red-500 rounded-xl" : "rounded-xl"}
              />
            </div>
            {slugError && <p className="text-sm text-red-500">{slugError}</p>}
            <p className="text-sm text-muted-foreground">This is the URL where your profile will be accessible.</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="public" checked={profile.isPublic} onCheckedChange={handlePublicChange} />
            <Label htmlFor="public">Make profile public</Label>
          </div>
        </TabsContent>

        <TabsContent value="layout">
          <LayoutSelector
            value={profile.layout}
            customOptions={profile.layoutOptions}
            onChange={handleLayoutChange}
          />
        </TabsContent>

        <TabsContent value="category">
          <CategorySelector selectedCategoryId={profile.categoryId} onSelect={handleCategoryChange} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

