"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/components/profile-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Check, ImageIcon, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface ProfilePicture {
  url: string
  altText?: string
  isPrimary: boolean
}

export function ProfileHeaderEditor({ profile }) {
  const { updateProfile } = useProfile()
  const [activeTab, setActiveTab] = useState("info")
  const [isUploading, setIsUploading] = useState(false)
  const [headerValues, setHeaderValues] = useState({
    name: profile.header?.name || "",
    title: profile.header?.title || "",
    subtitle: profile.header?.subtitle || "",
    shortBio: profile.header?.shortBio || "",
  })

  // Update header values with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!profile.header) {
        updateProfile({
          header: {
            ...headerValues,
            pictures: [],
          },
        })
      } else {
        updateProfile({
          header: {
            ...profile.header,
            ...headerValues,
          },
        })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [headerValues, profile.header, updateProfile])

  const handleInputChange = (field, value) => {
    setHeaderValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddPicture = async (file?: File) => {
    if (!file) return

    setIsUploading(true)
    try {
      // Simulate image upload - in a real app, you would upload to a server
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newPicture: ProfilePicture = {
        url: URL.createObjectURL(file),
        altText: file.name,
        isPrimary: !profile.header?.pictures?.length,
      }

      updateProfile({
        header: {
          ...profile.header,
          pictures: [...(profile.header?.pictures || []), newPicture],
        },
      })

      toast({
        title: "Image added",
        description: "Your profile picture has been added.",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
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

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="info" className="flex-1">
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="pictures" className="flex-1">
            Profile Pictures
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="header-name">Name</Label>
            <Input
              id="header-name"
              value={headerValues.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="John Doe"
            />
            <p className="text-sm text-muted-foreground">Your full name as you'd like it to appear.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="header-title">Professional Title</Label>
            <Input
              id="header-title"
              value={headerValues.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Software Engineer"
            />
            <p className="text-sm text-muted-foreground">Your job title or professional role.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="header-subtitle">Subtitle</Label>
            <Input
              id="header-subtitle"
              value={headerValues.subtitle}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              placeholder="Specializing in React & Next.js"
            />
            <p className="text-sm text-muted-foreground">A brief tagline or specialization.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="header-bio">Short Bio</Label>
            <Textarea
              id="header-bio"
              value={headerValues.shortBio}
              onChange={(e) => handleInputChange("shortBio", e.target.value)}
              placeholder="A brief introduction about yourself..."
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              A concise bio that appears at the top of your profile (1-2 sentences).
            </p>
          </div>
        </TabsContent>

        <TabsContent value="pictures" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Profile Pictures</h3>
            <div>
              <input
                type="file"
                id="profile-image-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleAddPicture(e.target.files?.[0])}
              />
              <Button
                size="sm"
                onClick={() => document.getElementById("profile-image-upload")?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Picture
                  </>
                )}
              </Button>
            </div>
          </div>

          {profile.header?.pictures && profile.header.pictures.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                      <Input
                        value={picture.altText || ""}
                        onChange={(e) => {
                          const updatedPictures = [...profile.header.pictures]
                          updatedPictures[index] = {
                            ...updatedPictures[index],
                            altText: e.target.value,
                          }
                          updateProfile({
                            header: {
                              ...profile.header,
                              pictures: updatedPictures,
                            },
                          })
                        }}
                        placeholder="Alt text"
                        className="text-xs"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant={picture.isPrimary ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleSetPrimaryPicture(index)}
                          disabled={picture.isPrimary}
                          className="flex-1"
                        >
                          {picture.isPrimary ? (
                            <>
                              <Check className="mr-1 h-4 w-4" /> Primary
                            </>
                          ) : (
                            "Set as Primary"
                          )}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRemovePicture(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-md">
              <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1">No profile pictures</h3>
              <p className="text-sm text-muted-foreground mb-4">Add a profile picture to personalize your profile.</p>
              <Button onClick={() => document.getElementById("profile-image-upload")?.click()} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Picture
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="bg-muted p-4 rounded-md mt-4">
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

