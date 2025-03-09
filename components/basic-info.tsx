"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/components/profile-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { CategorySelector } from "@/components/profile-editor/category-selector"
import { LayoutSelector } from "@/components/profile-editor/layout-selector"

export function ProfileBasicInfo({ profile }) {
  const { updateProfile } = useProfile()
  const [slugError, setSlugError] = useState<string | null>(null)
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
      if (!slugError) {
        updateProfile({ slug })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [slug, slugError, updateProfile])

  // Update isPublic immediately
  useEffect(() => {
    updateProfile({ isPublic })
  }, [isPublic, updateProfile])

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    // Auto-generate slug if user hasn't manually edited it
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleSlugChange = (e) => {
    const rawValue = e.target.value
    const newSlug = generateSlug(rawValue)

    if (newSlug !== rawValue) {
      setSlugError("Slug can only contain lowercase letters, numbers, and hyphens")
    } else {
      setSlugError(null)
    }

    setSlug(newSlug)
  }

  const handleCategoryChange = (categoryId) => {
    updateProfile({ categoryIds: categoryId ? [categoryId] : [] })
  }

  const handleLayoutChange = (layout, options) => {
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
              <Input
                id="slug"
                value={slug}
                onChange={handleSlugChange}
                placeholder="my-awesome-profile"
                className={slugError ? "border-red-500" : ""}
              />
            </div>
            {slugError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{slugError}</AlertDescription>
              </Alert>
            )}
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

