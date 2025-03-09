"use client"

import { useState } from "react"
import { useProfile } from "@/components/profile-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, ExternalLink } from "lucide-react"
import type { Profile } from "@/lib/db"

interface SocialEditorProps {
  profile: Profile
}

export function ProfileSocialEditor({ profile }: SocialEditorProps) {
  const { updateProfile } = useProfile()
  const [socialLinks, setSocialLinks] = useState(profile.socialLinks || [])
  const [urlError, setUrlError] = useState<string | null>(null)

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleAddSocialLink = () => {
    const newLinks = [...socialLinks, { platform: "Twitter", url: "https://twitter.com/" }]
    setSocialLinks(newLinks)
    updateProfile({ socialLinks: newLinks })
  }

  const handleRemoveSocialLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index)
    setSocialLinks(newLinks)
    updateProfile({ socialLinks: newLinks })
  }

  const handleUpdateSocialLink = (index: number, field: string, value: string) => {
    const newLinks = [...socialLinks]
    newLinks[index] = { ...newLinks[index], [field]: value }

    // Validate URL if that's what changed
    if (field === "url") {
      if (!validateUrl(value)) {
        setUrlError(`Invalid URL for ${newLinks[index].platform}`)
        return
      } else {
        setUrlError(null)
      }
    }

    setSocialLinks(newLinks)
    updateProfile({ socialLinks: newLinks })
  }

  const socialPlatforms = [
    { value: "Twitter", label: "Twitter" },
    { value: "Facebook", label: "Facebook" },
    { value: "Instagram", label: "Instagram" },
    { value: "LinkedIn", label: "LinkedIn" },
    { value: "GitHub", label: "GitHub" },
    { value: "YouTube", label: "YouTube" },
    { value: "TikTok", label: "TikTok" },
    { value: "Twitch", label: "Twitch" },
    { value: "Discord", label: "Discord" },
    { value: "Website", label: "Website" },
    { value: "Other", label: "Other" },
  ]

  return (
    <div className="space-y-6">
      {urlError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{urlError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {socialLinks.map((link, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-2 p-3 border rounded-md bg-muted/20">
            <Select value={link.platform} onValueChange={(value) => handleUpdateSocialLink(index, "platform", value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {socialPlatforms.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1 flex gap-2">
              <Input
                value={link.url}
                onChange={(e) => handleUpdateSocialLink(index, "url", e.target.value)}
                placeholder="https://example.com"
                className="flex-1"
              />

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => window.open(link.url, "_blank")}
                  disabled={!validateUrl(link.url)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-destructive hover:text-destructive"
                  onClick={() => handleRemoveSocialLink(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={handleAddSocialLink}>
        <Plus className="mr-2 h-4 w-4" /> Add Social Link
      </Button>

      <div className="rounded-md bg-muted p-4">
        <h3 className="font-medium mb-2">Tips</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Add your most active social media accounts</li>
          <li>Use complete URLs including https://</li>
          <li>Social icons will be displayed based on the platform</li>
          <li>Order matters - links will appear in the order shown above</li>
        </ul>
      </div>
    </div>
  )
}

