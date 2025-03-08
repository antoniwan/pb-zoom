"use client"

import type { Profile, ProfileSection } from "@/lib/models"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Facebook, Twitter, Instagram, Linkedin, Github, Youtube, Globe } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ProfilePreviewProps {
  profile: Profile
}

export function ProfilePreview({ profile }: ProfilePreviewProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return <Twitter className="h-5 w-5" />
      case "facebook":
        return <Facebook className="h-5 w-5" />
      case "instagram":
        return <Instagram className="h-5 w-5" />
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      case "github":
        return <Github className="h-5 w-5" />
      case "youtube":
        return <Youtube className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  const renderSection = (section: ProfileSection) => {
    switch (section.type) {
      case "bio":
        return (
          <div className="prose max-w-none dark:prose-invert">
            <p>{section.content.text}</p>
          </div>
        )

      case "attributes":
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            {section.content.items.map((item: any, index: number) => (
              <div key={index} className="flex flex-col space-y-1">
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.value}</div>
              </div>
            ))}
          </div>
        )

      case "gallery":
        return (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {section.content.images && section.content.images.length > 0 ? (
              section.content.images.map((image: any, index: number) => (
                <div key={index} className="aspect-square overflow-hidden rounded-md bg-muted">
                  <img
                    src={image.url || "/placeholder.svg?height=300&width=300"}
                    alt={image.title || "Gallery image"}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">No images added yet</div>
            )}
          </div>
        )

      case "markdown":
        return (
          <div className="prose max-w-none dark:prose-invert">
            <ReactMarkdown>{section.content.markdown}</ReactMarkdown>
          </div>
        )

      default:
        return <div className="text-center text-muted-foreground">Preview not available for this section type</div>
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="desktop">
        <TabsList className="mb-4">
          <TabsTrigger value="desktop">Desktop</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
        </TabsList>

        <TabsContent value="desktop">
          <div
            className="mx-auto max-w-4xl overflow-hidden rounded-lg border shadow-sm"
            style={{
              backgroundColor: profile.theme.backgroundColor,
              color: profile.theme.textColor,
              fontFamily: profile.theme.fontFamily,
            }}
          >
            <div className="p-8">
              <div className="mb-8 text-center">
                <h1 className="mb-2 text-3xl font-bold" style={{ color: profile.theme.primaryColor }}>
                  {profile.title}
                </h1>

                {profile.socialLinks.length > 0 && (
                  <div className="flex justify-center space-x-4">
                    {profile.socialLinks.map((socialLink, index) => (
                      <a
                        key={index}
                        href={socialLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-muted"
                        style={{ color: profile.theme.secondaryColor }}
                      >
                        {getSocialIcon(socialLink.platform)}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className={`space-y-8 ${profile.layout === "grid" ? "grid gap-8 md:grid-cols-2" : ""}`}>
                {profile.sections.map((section) => (
                  <div key={section._id} className="space-y-4">
                    <h2 className="text-xl font-bold" style={{ color: profile.theme.secondaryColor }}>
                      {section.title}
                    </h2>
                    {renderSection(section)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mobile">
          <div
            className="mx-auto max-w-sm overflow-hidden rounded-lg border shadow-sm"
            style={{
              backgroundColor: profile.theme.backgroundColor,
              color: profile.theme.textColor,
              fontFamily: profile.theme.fontFamily,
            }}
          >
            <div className="p-4">
              <div className="mb-6 text-center">
                <h1 className="mb-2 text-2xl font-bold" style={{ color: profile.theme.primaryColor }}>
                  {profile.title}
                </h1>

                {profile.socialLinks.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {profile.socialLinks.map((socialLink, index) => (
                      <a
                        key={index}
                        href={socialLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full p-1.5 transition-colors hover:bg-muted"
                        style={{ color: profile.theme.secondaryColor }}
                      >
                        {getSocialIcon(socialLink.platform)}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {profile.sections.map((section) => (
                  <div key={section._id} className="space-y-3">
                    <h2 className="text-lg font-bold" style={{ color: profile.theme.secondaryColor }}>
                      {section.title}
                    </h2>
                    {renderSection(section)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-2 font-medium">Preview Notes</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>This is a simplified preview of how your profile will look</li>
            <li>Custom CSS will be applied in the actual public profile</li>
            <li>
              View your public profile at:{" "}
              <code className="rounded bg-muted px-1 py-0.5">example.com/p/{profile.slug}</code>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

