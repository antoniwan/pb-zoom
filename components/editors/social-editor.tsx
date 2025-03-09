"use client"

import { useState } from "react"
import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialLink {
  id: string
  platform: string
  url: string
}

export function SocialEditor() {
  const { profile, updateProfile } = useProfile()
  const [newLink, setNewLink] = useState({ platform: "", url: "" })

  if (!profile) return null

  const socialLinks = profile.socialLinks || []

  const handleAddLink = () => {
    if (!newLink.platform || !newLink.url) return

    const updatedLinks = [
      ...socialLinks,
      { ...newLink, id: crypto.randomUUID() },
    ]

    updateProfile({ socialLinks: updatedLinks })
    setNewLink({ platform: "", url: "" })
  }

  const handleRemoveLink = (id: string) => {
    const updatedLinks = socialLinks.filter((link) => link.id !== id)
    updateProfile({ socialLinks: updatedLinks })
  }

  const handleUpdateLink = (id: string, updates: Partial<SocialLink>) => {
    const updatedLinks = socialLinks.map((link) =>
      link.id === id ? { ...link, ...updates } : link
    )
    updateProfile({ socialLinks: updatedLinks })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>
            Add links to your social media profiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Links */}
          {socialLinks.map((link) => (
            <div
              key={link.id}
              className={cn(
                "grid gap-4 p-4 border rounded-lg",
                "md:grid-cols-[1fr,2fr,auto]"
              )}
            >
              <div className="space-y-2">
                <Label>Platform</Label>
                <Input
                  value={link.platform}
                  onChange={(e) =>
                    handleUpdateLink(link.id, { platform: e.target.value })
                  }
                  placeholder="e.g. Twitter"
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={link.url}
                  onChange={(e) =>
                    handleUpdateLink(link.id, { url: e.target.value })
                  }
                  placeholder="https://"
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveLink(link.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Add New Link */}
          <div
            className={cn(
              "grid gap-4 p-4 border rounded-lg border-dashed",
              "md:grid-cols-[1fr,2fr,auto]"
            )}
          >
            <div className="space-y-2">
              <Label>Platform</Label>
              <Input
                value={newLink.platform}
                onChange={(e) =>
                  setNewLink({ ...newLink, platform: e.target.value })
                }
                placeholder="e.g. Twitter"
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddLink}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 