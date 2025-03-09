"use client"

import { useState, useEffect, useCallback } from "react"
import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface SeoSettings {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  twitterCard?: boolean
}

export function SeoSettings() {
  const { profile, updateProfile } = useProfile()

  const [seoTitle, setSeoTitle] = useState(profile.seo?.title || "")
  const [seoDescription, setSeoDescription] = useState(profile.seo?.description || "")
  const [seoKeywords, setSeoKeywords] = useState(profile.seo?.keywords || "")

  const handleSeoChange = useCallback(
    (key: keyof SeoSettings, value: string | boolean) => {
      updateProfile({
        seo: {
          ...profile.seo,
          [key]: value,
        },
      })
    },
    [profile.seo, updateProfile],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSeoChange("title", seoTitle)
    }, 500)
    return () => clearTimeout(timer)
  }, [seoTitle, handleSeoChange])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSeoChange("description", seoDescription)
    }, 500)
    return () => clearTimeout(timer)
  }, [seoDescription, handleSeoChange])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSeoChange("keywords", seoKeywords)
    }, 500)
    return () => clearTimeout(timer)
  }, [seoKeywords, handleSeoChange])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
          <CardDescription>Optimize your profile for search engines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo-title">SEO Title</Label>
            <Input
              id="seo-title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={profile.title}
              maxLength={60}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Recommended: 50-60 characters</span>
              <span>{seoTitle.length}/60</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-description">Meta Description</Label>
            <Textarea
              id="seo-description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="A brief description of your profile for search engines"
              maxLength={160}
              rows={3}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Recommended: 120-160 characters</span>
              <span>{seoDescription.length}/160</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-keywords">Keywords</Label>
            <Input
              id="seo-keywords"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="profile, portfolio, skills (comma separated)"
            />
            <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Sharing</CardTitle>
          <CardDescription>Control how your profile appears when shared on social media</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="og-image">Social Image URL</Label>
            <Input
              id="og-image"
              value={profile.seo?.ogImage || ""}
              onChange={(e) => handleSeoChange("ogImage", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground">Recommended size: 1200x630 pixels</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="twitter-card">Twitter Card</Label>
              <p className="text-sm text-muted-foreground">Enable Twitter card for better sharing on Twitter</p>
            </div>
            <Switch
              id="twitter-card"
              checked={profile.seo?.twitterCard !== false}
              onCheckedChange={(checked) => handleSeoChange("twitterCard", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

