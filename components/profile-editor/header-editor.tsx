"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Upload, Check } from "lucide-react"
import Image from "next/image"
import type { Profile } from "@/lib/db"
import { toast } from "@/hooks/use-toast"

interface ProfilePicture {
  url: string
  altText?: string
  isPrimary: boolean
}

interface HeaderEditorProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

export function ProfileHeaderEditor({ profile, updateProfile }: HeaderEditorProps) {
  const [activeTab, setActiveTab] = useState("info")
  const [urlError, setUrlError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile.header) {
      updateProfile({
        header: {
          name: "",
          title: "",
          subtitle: "",
          shortBio: "",
          pictures: [],
        },
      })
    }
  }, [profile.header, updateProfile])

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleHeaderChange = (field: keyof Profile["header"], value: string) => {
    if (!profile.header) return

    updateProfile({
      header: {
        ...profile.header,
        [field]: value,
      },
    })
  }

  const handleAddPicture = () => {
    if (!profile.header) return

    const newPicture: ProfilePicture = {
      url: "/placeholder.svg?height=300&width=300",
      altText: "Profile picture",
      isPrimary: profile.header.pictures.length === 0,
    }

    updateProfile({
      header: {
        ...profile.header,
        pictures: [...profile.header.pictures, newPicture],
      },
    })
  }

  const handleRemovePicture = (index: number) => {
    if (!profile.header) return

    const updatedPictures = [...profile.header.pictures]
    const removedPicture = updatedPictures.splice(index, 1)[0]

    // If we removed the primary picture, make the first remaining one primary
    if (removedPicture.isPrimary && updatedPictures.length > 0) {
      updatedPictures[0].isPrimary = true
    }

    updateProfile({
      header: {
        ...profile.header,
        pictures: updatedPictures,
      },
    })
  }

  const handleSetPrimaryPicture = (index: number) => {
    if (!profile.header) return

    const updatedPictures = profile.header.pictures.map((pic, i) => ({
      ...pic,
      isPrimary: i === index,
    }))

    updateProfile({
      header: {
        ...profile.header,
        pictures: updatedPictures,
      },
    })
  }

  const handleUpdatePicture = (index: number, updates: Partial<ProfilePicture>) => {
    if (!profile.header) return

    // Validate URL if it's being updated
    if (updates.url && !validateUrl(updates.url)) {
      setUrlError("Please enter a valid URL")
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL for the profile picture",
        variant: "destructive",
      })
      return
    }

    setUrlError(null)
    const updatedPictures = [...profile.header.pictures]
    updatedPictures[index] = { ...updatedPictures[index], ...updates }

    updateProfile({
      header: {
        ...profile.header,
        pictures: updatedPictures,
      },
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Basic Info</TabsTrigger>
          <TabsTrigger value="pictures">Profile Pictures</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="header-name">Name</Label>
            <Input
              id="header-name"
              value={profile.header?.name || ""}
              onChange={(e) => handleHeaderChange("name", e.target.value)}
              placeholder="John Doe"
              className="rounded-xl"
              required
            />
            <p className="text-sm text-muted-foreground">Your full name as you&apos;d like it to appear.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="header-title">Professional Title</Label>
            <Input
              id="header-title"
              value={profile.header?.title || ""}
              onChange={(e) => handleHeaderChange("title", e.target.value)}
              placeholder="Software Engineer"
              className="rounded-xl"
              required
            />
            <p className="text-sm text-muted-foreground">Your job title or professional role.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="header-subtitle">Subtitle</Label>
            <Input
              id="header-subtitle"
              value={profile.header?.subtitle || ""}
              onChange={(e) => handleHeaderChange("subtitle", e.target.value)}
              placeholder="Specializing in React & Next.js"
              className="rounded-xl"
              required
            />
            <p className="text-sm text-muted-foreground">A brief tagline or specialization.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="header-bio">Short Bio</Label>
            <Textarea
              id="header-bio"
              value={profile.header?.shortBio || ""}
              onChange={(e) => handleHeaderChange("shortBio", e.target.value)}
              placeholder="A brief introduction about yourself..."
              className="rounded-xl"
              rows={4}
              required
            />
            <p className="text-sm text-muted-foreground">
              A concise bio that appears at the top of your profile (1-2 sentences).
            </p>
          </div>
        </TabsContent>

        <TabsContent value="pictures" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Profile Pictures</h3>
            <Button onClick={handleAddPicture} size="sm" className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Add Picture
            </Button>
          </div>

          {profile.header?.pictures && profile.header.pictures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.header.pictures.map((picture, index) => (
                <Card key={index} className={`overflow-hidden ${picture.isPrimary ? "ring-2 ring-primary" : ""}`}>
                  <div className="aspect-square relative">
                    <Image
                      src={picture.url || "/placeholder.svg"}
                      alt={picture.altText || "Profile picture"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={picture.url}
                          onChange={(e) => handleUpdatePicture(index, { url: e.target.value })}
                          placeholder="Image URL"
                          className={`text-xs ${urlError ? "border-red-500" : ""}`}
                          required
                        />
                        {urlError && <p className="text-xs text-red-500">{urlError}</p>}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePicture(index)}
                          className="shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        value={picture.altText || ""}
                        onChange={(e) => handleUpdatePicture(index, { altText: e.target.value })}
                        placeholder="Alt text"
                        className="text-xs"
                        required
                      />
                      <Button
                        variant={picture.isPrimary ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSetPrimaryPicture(index)}
                        disabled={picture.isPrimary}
                        className="w-full mt-1"
                      >
                        {picture.isPrimary ? (
                          <>
                            <Check className="mr-1 h-4 w-4" /> Primary
                          </>
                        ) : (
                          "Set as Primary"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-xl">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1">No profile pictures</h3>
              <p className="text-sm text-muted-foreground mb-4">Add a profile picture to personalize your profile.</p>
              <Button onClick={handleAddPicture} size="sm" className="rounded-xl">
                <Plus className="mr-2 h-4 w-4" />
                Add Picture
              </Button>
            </div>
          )}

          <div className="bg-muted p-4 rounded-xl mt-4">
            <h4 className="font-medium mb-2">Tips for profile pictures</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>Use a clear, professional headshot for best results</li>
              <li>Square images work best (1:1 ratio)</li>
              <li>You can add multiple pictures and choose a primary one</li>
              <li>Recommended size: at least 400x400 pixels</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

