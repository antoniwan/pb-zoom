"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ExternalLink, Mail, MapPin, Link2 } from "lucide-react"
import type { Profile, ProfileSection } from "@/lib/db"
import ReactMarkdown from "react-markdown"

interface ProfilePreviewProps {
  profile: Profile
}

export function ProfilePreview({ profile }: ProfilePreviewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const renderSection = (section: ProfileSection) => {
    switch (section.type) {
      case "bio":
        return (
          <Card key={section._id} className="mb-6">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{section.content.text}</p>
            </CardContent>
          </Card>
        )

      case "attributes":
        return (
          <Card key={section._id} className="mb-6">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.content.attributes?.map((attribute, index) => (
                  <div key={attribute._id || index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{attribute.label}</span>
                      <span className="text-sm text-muted-foreground">{attribute.value}</span>
                    </div>
                    <Progress value={Number.parseInt(attribute.value) || 75} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "gallery":
        return (
          <Card key={section._id} className="mb-6">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {section.content.images?.map((image, index) => (
                  <div key={index} className="aspect-square relative rounded-md overflow-hidden">
                    <Image
                      src={image.url || `/placeholder.svg?height=300&width=300`}
                      alt={image.alt || "Gallery image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "markdown":
        return (
          <Card key={section._id} className="mb-6">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{section.content.markdown || ""}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )

      case "videos":
        return (
          <Card key={section._id} className="mb-6">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {section.content.videos?.map((video, index) => (
                  <div key={index} className="aspect-video relative rounded-md overflow-hidden">
                    <iframe
                      src={video.url}
                      title={video.title || `Video ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "custom":
        return (
          <Card key={section._id} className="mb-6">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: section.content.html || "" }} />
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  // Apply theme colors from profile settings
  const themeStyles = {
    backgroundColor: profile.theme?.backgroundColor || "#ffffff",
    textColor: profile.theme?.textColor || "#000000",
    primaryColor: profile.theme?.primaryColor || "#3b82f6",
    secondaryColor: profile.theme?.secondaryColor || "#6b7280",
    accentColor: profile.theme?.accentColor || "#f59e0b",
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-muted p-4 rounded-lg mb-6 flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium">Preview Mode</span>
          <span className="text-muted-foreground ml-2">This is how your profile will appear to visitors</span>
        </div>
        <Button variant="outline" size="sm">
          <ExternalLink className="mr-2 h-4 w-4" />
          View Full Page
        </Button>
      </div>

      <div
        className="rounded-lg overflow-hidden shadow-lg"
        style={{ backgroundColor: themeStyles.backgroundColor, color: themeStyles.textColor }}
      >
        {/* Header/Cover Image */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600">
          {profile.header?.coverImage && (
            <Image src={profile.header.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
          )}
        </div>

        {/* Profile Info */}
        <div className="relative px-6 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-6 md:relative md:top-0 md:left-0">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={profile.header?.avatarImage} alt={profile.title} />
                <AvatarFallback className="text-2xl">{getInitials(profile.title || "User Profile")}</AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Details */}
            <div className="mt-16 md:mt-0 flex-1">
              <h1 className="text-3xl font-bold">{profile.title}</h1>
              <p className="text-xl text-muted-foreground mt-1">{profile.subtitle}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {profile.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {profile.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center text-sm">
                    <Link2 className="mr-2 h-4 w-4" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {profile.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mt-6">
              <p className="whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}

          {/* Social Links */}
          {profile.socialLinks && profile.socialLinks.length > 0 && (
            <div className="mt-6">
              <Separator className="mb-4" />
              <div className="flex flex-wrap gap-3">
                {profile.socialLinks.map((link, index) => (
                  <Button key={index} variant="outline" size="sm" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.platform}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="px-6 py-8 bg-muted/10">
          {profile.sections.sort((a, b) => a.order - b.order).map((section) => renderSection(section))}
        </div>
      </div>
    </div>
  )
}

