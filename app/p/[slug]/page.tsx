import { getProfileBySlug } from "@/lib/db"
import { notFound } from "next/navigation"
import type { ProfileSection } from "@/lib/models"
import { Facebook, Twitter, Instagram, Linkedin, Github, Youtube, Globe } from "lucide-react"
import type { Metadata } from "next"
import { use } from "react"

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Ensure params.slug is accessed safely
  const slug = params.slug

  const profile = await getProfileBySlug(slug)

  if (!profile) {
    return {
      title: "Profile Not Found",
    }
  }

  return {
    title: profile.title,
    description: `View ${profile.title}'s profile`,
  }
}

export default async function ProfilePage({ params }: PageProps) {
  // Ensure params.slug is accessed safely
  const unwrappedParams = use(params as unknown as Promise<{ slug: string }>)
  const slug = unwrappedParams.slug

  const profile = await getProfileBySlug(slug)

  if (!profile) {
    notFound()
  }

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
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
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

      // Add more section renderers as needed

      default:
        return null
    }
  }

  return (
    <div
      style={{
        backgroundColor: profile.theme.backgroundColor,
        color: profile.theme.textColor,
        fontFamily: profile.theme.fontFamily,
      }}
      className="min-h-screen"
    >
      <style jsx global>{`
        ${profile.theme.customCSS || ""}
      `}</style>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl" style={{ color: profile.theme.primaryColor }}>
            {profile.title}
          </h1>

          {profile.socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {profile.socialLinks.map((socialLink, index) => (
                <a
                  key={index}
                  href={socialLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-muted"
                  style={{ color: profile.theme.secondaryColor }}
                  aria-label={socialLink.platform}
                >
                  {getSocialIcon(socialLink.platform)}
                </a>
              ))}
            </div>
          )}
        </div>

        <div
          className={
            profile.layout === "grid"
              ? "grid gap-8 md:grid-cols-2"
              : profile.layout === "magazine"
                ? "grid gap-8 md:grid-cols-3"
                : "space-y-8"
          }
        >
          {profile.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <div key={section._id} className="space-y-4">
                <h2 className="text-2xl font-bold" style={{ color: profile.theme.secondaryColor }}>
                  {section.title}
                </h2>
                {renderSection(section)}
              </div>
            ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Created with Profile Builder</p>
        </div>
      </div>
    </div>
  )
}

