"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Profile, ProfileSocial } from "@/lib/models"
import { Trash2, Plus } from "lucide-react"

interface ProfileSocialEditorProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

export function ProfileSocialEditor({ profile, updateProfile }: ProfileSocialEditorProps) {
  const handleAddSocialLink = () => {
    const updatedSocialLinks = [...profile.socialLinks, { platform: "Twitter", url: "https://twitter.com/" }]
    updateProfile({ socialLinks: updatedSocialLinks })
  }

  const handleRemoveSocialLink = (index: number) => {
    const updatedSocialLinks = profile.socialLinks.filter((_, i) => i !== index)
    updateProfile({ socialLinks: updatedSocialLinks })
  }

  const handleUpdateSocialLink = (index: number, updates: Partial<ProfileSocial>) => {
    const updatedSocialLinks = [...profile.socialLinks]
    updatedSocialLinks[index] = { ...updatedSocialLinks[index], ...updates }
    updateProfile({ socialLinks: updatedSocialLinks })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {profile.socialLinks.map((socialLink, index) => (
          <div key={index} className="flex items-center space-x-2">
            <select
              value={socialLink.platform}
              onChange={(e) => handleUpdateSocialLink(index, { platform: e.target.value })}
              className="w-1/3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Twitter">Twitter</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="GitHub">GitHub</option>
              <option value="YouTube">YouTube</option>
              <option value="TikTok">TikTok</option>
              <option value="Website">Website</option>
              <option value="Other">Other</option>
            </select>
            <Input
              value={socialLink.url}
              onChange={(e) => handleUpdateSocialLink(index, { url: e.target.value })}
              placeholder="https://example.com"
              className="flex-1"
            />
            <Button variant="ghost" size="icon" onClick={() => handleRemoveSocialLink(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={handleAddSocialLink}>
        <Plus className="mr-2 h-4 w-4" /> Add Social Link
      </Button>

      <div className="rounded-md bg-muted p-4">
        <h3 className="mb-2 font-medium">Tips</h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Add your most active social media accounts</li>
          <li>Use complete URLs including https://</li>
          <li>Social icons will be displayed based on the platform</li>
        </ul>
      </div>
    </div>
  )
}

