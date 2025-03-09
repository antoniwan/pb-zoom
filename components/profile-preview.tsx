import type { Profile, ProfileSection, ProfileAttribute, ProfileImage } from "@/lib/models"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Facebook, Twitter, Instagram, Linkedin, Github, Youtube, Globe } from "lucide-react"
import ReactMarkdown from "react-markdown"
import Image from "next/image"

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

  const renderSection = (section: ProfileSection, sectionIndex: number) => {
    switch (section.type) {
      case "bio":
        return (
          <div className="prose max-w-none dark:prose-invert">
            <p>{section.content.text}</p>
          </div>
        )

      case "attributes":
        return (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {section.content.attributes?.map((attribute: ProfileAttribute, index: number) => (
              <div key={`attribute-${sectionIndex}-${index}`} className="flex flex-col space-y-1">
                <div className="text-sm font-medium">{attribute.label}</div>
                <div className="text-sm text-muted-foreground">{attribute.value}</div>
              </div>
            ))}
          </div>
        )

      case "gallery":
        return (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {section.content.images && section.content.images.length > 0 ? (
              section.content.images.map((image: ProfileImage, index: number) => (
                <div
                  key={`image-${sectionIndex}-${index}`}
                  className="aspect-square overflow-hidden rounded-md bg-muted"
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.caption || "Gallery image"}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">No images to display</div>
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

  // Get the primary profile picture or the first one if no primary is set
  const getPrimaryPicture = () => {
    if (!profile.header?.pictures || profile.header.pictures.length === 0) {
      return null
    }

    const primaryPic = profile.header.pictures.find((pic) => pic.isPrimary)
    return primaryPic || profile.header.pictures[0]
  }

  const primaryPicture = getPrimaryPicture()

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
              {/* Header Section with Name, Title, Subtitle, Picture, and Short Bio */}
              <div className="mb-12">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Profile Picture */}
                  {primaryPicture && (
                    <div
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 flex-shrink-0"
                      style={{ borderColor: profile.theme.primaryColor }}
                    >
                      <Image
                        src={primaryPicture.url || "/placeholder.svg"}
                        alt={primaryPicture.altText || profile.header?.name || "Profile picture"}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Name, Title, Subtitle */}
                  <div className="text-center md:text-left flex-1">
                    {profile.header?.name && (
                      <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: profile.theme.primaryColor }}>
                        {profile.header.name}
                      </h1>
                    )}

                    {profile.header?.title && (
                      <h2
                        className="text-xl md:text-2xl font-medium mb-1"
                        style={{ color: profile.theme.secondaryColor }}
                      >
                        {profile.header.title}
                      </h2>
                    )}

                    {profile.header?.subtitle && <h3 className="text-lg opacity-80 mb-4">{profile.header.subtitle}</h3>}

                    {/* Social Links */}
                    {profile.socialLinks.length > 0 && (
                      <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                        {profile.socialLinks.map((socialLink, index) => (
                          <a
                            key={`desktop-social-${index}`}
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
                </div>

                {/* Short Bio */}
                {profile.header?.shortBio && (
                  <div className="mt-6 text-lg leading-relaxed max-w-3xl mx-auto md:mx-0">
                    {profile.header.shortBio}
                  </div>
                )}
              </div>

              {/* Content Sections */}
              <div className={`space-y-8 ${profile.layout === "grid" ? "grid gap-8 md:grid-cols-2" : ""}`}>
                {profile.sections.map((section, index) => (
                  <div key={`desktop-section-${index}`} className="space-y-4">
                    <h2 className="text-xl font-bold" style={{ color: profile.theme.secondaryColor }}>
                      {section.title}
                    </h2>
                    {renderSection(section, index)}
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
              {/* Mobile Header */}
              <div className="mb-8 text-center">
                {/* Profile Picture */}
                {primaryPicture && (
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden border-4 mx-auto mb-4"
                    style={{ borderColor: profile.theme.primaryColor }}
                  >
                    <Image
                      src={primaryPicture.url || "/placeholder.svg"}
                      alt={primaryPicture.altText || profile.header?.name || "Profile picture"}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Name, Title, Subtitle */}
                {profile.header?.name && (
                  <h1 className="text-2xl font-bold mb-1" style={{ color: profile.theme.primaryColor }}>
                    {profile.header.name}
                  </h1>
                )}

                {profile.header?.title && (
                  <h2 className="text-lg font-medium" style={{ color: profile.theme.secondaryColor }}>
                    {profile.header.title}
                  </h2>
                )}

                {profile.header?.subtitle && (
                  <h3 className="text-sm opacity-80 mt-1 mb-3">{profile.header.subtitle}</h3>
                )}

                {/* Social Links */}
                {profile.socialLinks.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {profile.socialLinks.map((socialLink, index) => (
                      <a
                        key={`mobile-social-${index}`}
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

                {/* Short Bio */}
                {profile.header?.shortBio && <div className="mt-4 text-sm">{profile.header.shortBio}</div>}
              </div>

              {/* Content Sections */}
              <div className="space-y-6">
                {profile.sections.map((section, index) => (
                  <div key={`mobile-section-${index}`} className="space-y-3">
                    <h2 className="text-lg font-bold" style={{ color: profile.theme.secondaryColor }}>
                      {section.title}
                    </h2>
                    {renderSection(section, index)}
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
              <code className="rounded bg-muted px-1 py-0.5">enye.social/p/{profile.slug}</code>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

