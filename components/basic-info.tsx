"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/components/profile-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategorySelector } from "@/components/category-selector"
import { LayoutSelector } from "@/components/profile-editor/layout-selector"
import type { Profile } from "@/lib/db"
import type { ChangeEvent } from "react"

interface BasicInfoProps {
  profile: Profile
}

interface LayoutOptions {
  columnCount?: number
  sectionSpacing?: number
  fullWidth?: boolean
}

export function ProfileBasicInfo({ profile }: BasicInfoProps) {
  const { updateProfile } = useProfile()
  const [title, setTitle] = useState(profile.title)
  const [slug, setSlug] = useState(profile.slug)
  const [isPublic, setIsPublic] = useState(profile.isPublic)
  const [activeTab, setActiveTab] = useState("general")

  // Update title with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      updateProfile({ title })
    }, 500)
    return () => clearTimeout(timer)
  }, [title, updateProfile])

  // Update slug with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      updateProfile({ slug })
    }, 500)
    return () => clearTimeout(timer)
  }, [slug, updateProfile])

  // Update isPublic immediately
  useEffect(() => {
    updateProfile({ isPublic })
  }, [isPublic, updateProfile])

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    updateProfile({ title: e.target.value })
  }

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const newSlug = generateSlug(rawValue)
    setSlug(newSlug)
    updateProfile({ slug: newSlug })
  }

  const handleCategoryChange = (categoryId: string | undefined) => {
    updateProfile({ categoryIds: categoryId ? [categoryId] : [] })
  }

  const handleLayoutChange = (layout: string, options?: LayoutOptions) => {
    updateProfile({ layout, layoutOptions: options || {} })
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
        <TabsList className="w-full">
          <TabsTrigger value="general" className="flex-1">
            General
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex-1">
            Layout
          </TabsTrigger>
          <TabsTrigger value="category" className="flex-1">
            Category
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Profile Title</Label>
            <Input id="title" value={title} onChange={handleTitleChange} placeholder="My Awesome Profile" />
            <p className="text-sm text-muted-foreground">Give your profile a name that describes its purpose.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Profile URL</Label>
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0 text-sm text-muted-foreground">enye.social/p/</div>
              <Input id="slug" value={slug} onChange={handleSlugChange} placeholder="my-awesome-profile" />
            </div>
            <p className="text-sm text-muted-foreground">This is the URL where your profile will be accessible.</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="public">Make profile public</Label>
          </div>
        </TabsContent>

        <TabsContent value="layout" className="pt-4">
          <LayoutSelector value={profile.layout} customOptions={profile.layoutOptions} onChange={handleLayoutChange} />
        </TabsContent>

        <TabsContent value="category" className="pt-4">
          <CategorySelector selectedCategoryId={profile.categoryIds?.[0]} onSelect={handleCategoryChange} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

