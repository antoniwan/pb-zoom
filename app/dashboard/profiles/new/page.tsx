"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NewProfilePage() {
  const { status } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    // Auto-generate slug if user hasn't manually edited it
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(generateSlug(e.target.value))
  }

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title) {
      setError("Please enter a profile title")
      return
    }

    if (!slug) {
      setError("Please enter a profile URL")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          isPublic: false,
          header: {
            name: "",
            title: "",
            subtitle: "",
            shortBio: "",
            pictures: [],
          },
          theme: {
            primaryColor: "#1d4ed8", // Changed to darker blue (blue-700)
            secondaryColor: "#67e8f9", // Kept teal
            backgroundColor: "#faf8f9", // Very light warm background
            textColor: "#352f44", // Soft dark purple
            fontFamily: "Inter",
          },
          layout: "standard",
          sections: [
            {
              _id: "section-1",
              type: "bio",
              title: "About Me",
              content: { text: "Write something about yourself..." },
              order: 0,
            },
          ],
          socialLinks: [],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create profile")
      }

      router.push(`/dashboard/profiles/${data.profileId}/edit`)
    } catch (error) {
      console.error("Error creating profile:", error)
      \
      setError(error instanceof Error ? error.message : "An unexpected error occurre  error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="sm" className="rounded-xl" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create New Profile</h1>
      </div>

      <Card className="rounded-xl border-secondary/30">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="title">Profile Title</Label>
              <Input
                id="title"
                value={title}
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
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="my-awesome-profile"
                  className="rounded-xl"
                />
              </div>
              <p className="text-sm text-muted-foreground">This is the URL where your profile will be accessible.</p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="rounded-xl">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Creating..." : "Create Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

```typescriptreact file="components/profile-editor/theme-editor.tsx"
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Profile } from "@/lib/models"

interface ProfileThemeEditorProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

export function ProfileThemeEditor({ profile, updateProfile }: ProfileThemeEditorProps) {
  const handleThemeChange = (key: keyof Profile["theme"], value: string) => {
    updateProfile({
      theme: {
        ...profile.theme,
        [key]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: profile.theme.primaryColor }}></div>
              <Input
                id="primaryColor"
                type="text"
                value={profile.theme.primaryColor}
                onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                placeholder="#000000"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                type="button"
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: "#1d4ed8" }}
                onClick={() => handleThemeChange("primaryColor", "#1d4ed8")}
                aria-label="Blue"
              />
              <button
                type="button"
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: "#4338ca" }}
                onClick={() => handleThemeChange("primaryColor", "#4338ca")}
                aria-label="Indigo"
              />
              <button
                type="button"
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: "#0369a1" }}
                onClick={() => handleThemeChange("primaryColor", "#0369a1")}
                aria-label="Sky Blue"
              />
              <button
                type="button"
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: "#047857" }}
                onClick={() => handleThemeChange("primaryColor", "#047857")}
                aria-label="Emerald"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryColor">Secondary Color</Label>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: profile.theme.secondaryColor }}></div>
            <Input
              id="secondaryColor"
              type="text"
              value={profile.theme.secondaryColor}
              onChange={(e) => handleThemeChange("secondaryColor", e.target.value)}
              placeholder="#000000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Background Color</Label>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: profile.theme.backgroundColor }}></div>
            <Input
              id="backgroundColor"
              type="text"
              value={profile.theme.backgroundColor}
              onChange={(e) => handleThemeChange("backgroundColor", e.target.value)}
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="textColor">Text Color</Label>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: profile.theme.textColor }}></div>
            <Input
              id="textColor"
              type="text"
              value={profile.theme.textColor}
              onChange={(e) => handleThemeChange("textColor", e.target.value)}
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fontFamily">Font Family</Label>
        <select
          id="fontFamily"
          value={profile.theme.fontFamily}
          onChange={(e) => handleThemeChange("fontFamily", e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Poppins">Poppins</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customCSS">Custom CSS</Label>
        <Textarea
          id="customCSS"
          value={profile.theme.customCSS || ""}
          onChange={(e) => handleThemeChange("customCSS", e.target.value)}
          placeholder=".profile-container { /* your custom styles */ }"
          className="font-mono rounded-xl"
          rows={8}
        />
        <p className="text-sm text-muted-foreground">
          Add custom CSS to further customize your profile&apos;s appearance.
        </p>
      </div>
    </div>
  )
}

