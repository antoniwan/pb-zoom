"use client"

import { useState, useEffect, useCallback } from "react"
import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Check, Loader2 } from "lucide-react"

export function GeneralSettings() {
  const { profile, updateProfile } = useProfile()

  const [slug, setSlug] = useState(profile.slug || "")
  const [description, setDescription] = useState(profile.description || "")
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)
  const [isSlugAvailable, setIsSlugAvailable] = useState(true)

  const checkSlugAvailability = useCallback(
    async (slug: string) => {
      if (!slug) return

      setIsCheckingSlug(true)
      try {
        const response = await fetch(`/api/profiles/check-slug?slug=${slug}&id=${profile._id}`)
        const data = await response.json()
        setIsSlugAvailable(data.available)

        if (data.available) {
          updateProfile({ slug })
        }
      } catch (error) {
        console.error("Error checking slug:", error)
      } finally {
        setIsCheckingSlug(false)
      }
    },
    [profile._id, updateProfile],
  )

  // Check slug availability with debounce
  useEffect(() => {
    if (slug === profile.slug) return

    const timer = setTimeout(() => {
      checkSlugAvailability(slug)
    }, 500)

    return () => clearTimeout(timer)
  }, [slug, profile.slug, checkSlugAvailability])

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    updateProfile({ description: value })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Set the basic information for your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-slug">Profile URL</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center rounded-md border px-3 text-sm text-muted-foreground">
                <span>yoursite.com/p/</span>
                <Input
                  id="profile-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="border-0 p-0 pl-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="your-profile-slug"
                />
              </div>
              {isCheckingSlug ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : isSlugAvailable ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <span className="text-xs text-red-500">Slug already taken</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-description">Description</Label>
            <Textarea
              id="profile-description"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="A brief description of your profile"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This description will be used in search results and social media shares.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibility Settings</CardTitle>
          <CardDescription>Control who can see your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-public">Public Profile</Label>
              <p className="text-sm text-muted-foreground">Make your profile visible to everyone</p>
            </div>
            <Switch
              id="profile-public"
              checked={profile.isPublic}
              onCheckedChange={(checked) => updateProfile({ isPublic: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-indexed">Search Engine Indexing</Label>
              <p className="text-sm text-muted-foreground">Allow search engines to index your profile</p>
            </div>
            <Switch
              id="profile-indexed"
              checked={profile.seo?.indexed !== false}
              onCheckedChange={(checked) =>
                updateProfile({
                  seo: {
                    ...profile.seo,
                    indexed: checked,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

