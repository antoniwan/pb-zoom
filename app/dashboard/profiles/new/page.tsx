"use client"

import type React from "react"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NewProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status === "unauthenticated") {
    router.push("/auth/login")
    return null
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
          theme: {
            primaryColor: "#3b82f6",
            secondaryColor: "#10b981",
            backgroundColor: "#ffffff",
            textColor: "#1f2937",
            fontFamily: "Inter",
          },
          layout: "standard",
          sections: [
            {
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
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create New Profile</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="title">Profile Title</Label>
              <Input id="title" value={title} onChange={handleTitleChange} placeholder="My Awesome Profile" />
              <p className="text-sm text-muted-foreground">Give your profile a name that describes its purpose.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Profile URL</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">example.com/p/</span>
                <Input id="slug" value={slug} onChange={handleSlugChange} placeholder="my-awesome-profile" />
              </div>
              <p className="text-sm text-muted-foreground">This is the URL where your profile will be accessible.</p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
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

