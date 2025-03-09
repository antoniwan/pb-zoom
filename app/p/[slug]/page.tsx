import { getProfileBySlug } from "@/lib/db"
import type { Profile } from "@/lib/db"
import { notFound } from "next/navigation"
import type { ProfileSection, ProfileAttribute, ProfileImage, ProfileSocial } from "@/lib/models"
import { Facebook, Twitter, Instagram, Linkedin, Github, Youtube, Globe } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Properly await the params object
  const { slug } = await params

  const profile = await getProfileBySlug(slug)

  if (!profile) {
    return {
      title: "Profile Not Found | Ñ",
      description: "The requested profile could not be found.",
    }
  }

  // Use the profile name if available, otherwise fall back to profile title
  const title = profile.header?.name || profile.title
  const description = profile.header?.shortBio || `View ${title}'s profile on Ñ`

  // Get primary image for OpenGraph
  const primaryPicture = profile.header?.pictures?.find((pic: { isPrimary: boolean }) => pic.isPrimary) || profile.header?.pictures?.[0]
  const imageUrl = primaryPicture?.url

  return {
    title: `${title} | Ñ`,
    description,
    openGraph: {
      title: `${title} | Ñ`,
      description,
      type: "profile",
      ...(imageUrl && { images: [{ url: imageUrl }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Ñ`,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

export default async function ProfilePage({ params }: PageProps) {
  // Properly await the params object
  const { slug } = await params

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
            {section.content.attributes?.map((item: ProfileAttribute, index: number) => (
              <div key={`attribute-${sectionIndex}-${index}`} className="flex flex-col space-y-1">
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
              section.content.images.map((image: ProfileImage, index: number) => (
                <div
                  key={`image-${sectionIndex}-${index}`}
                  className="aspect-square overflow-hidden rounded-md bg-muted"
                >
                  <Image
                    src={image.url || "/placeholder.svg?height=300&width=300"}
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

      // Add more section renderers as needed

      default:
        return null
    }
  }

  // Get the primary profile picture or the first one if no primary is set
  function getPrimaryPicture(profile: Profile) {
    if (!profile.header?.pictures?.length) {
      return null
    }

    const primaryPic = profile.header.pictures.find((pic: { isPrimary: boolean }) => pic.isPrimary)
    return primaryPic || profile.header.pictures[0]
  }

  const primaryPicture = getPrimaryPicture(profile)

  return (
    <div
      style={{
        backgroundColor: profile.theme.backgroundColor,
        color: profile.theme.textColor,
        fontFamily: profile.theme.fontFamily,
      }}
      className="min-h-screen"
    >
      {/* Add custom CSS as a script tag */}
      {profile.theme.customCSS && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const style = document.createElement('style');
                style.textContent = ${JSON.stringify(profile.theme.customCSS)};
                document.head.appendChild(style);
              })();
            `,
          }}
          type="text/javascript"
        />
      )}

      <div className="container mx-auto px-4 py-8 md:py-12">
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
              {profile.header?.name ? (
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: profile.theme.primaryColor }}>
                  {profile.header.name}
                </h1>
              ) : (
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: profile.theme.primaryColor }}>
                  {profile.title}
                </h1>
              )}

              {profile.header?.title && (
                <h2 className="text-xl md:text-2xl font-medium mb-1" style={{ color: profile.theme.secondaryColor }}>
                  {profile.header.title}
                </h2>
              )}

              {profile.header?.subtitle && <h3 className="text-lg opacity-80 mb-4">{profile.header.subtitle}</h3>}

              {/* Social Links */}
              {profile.socialLinks.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                  {profile.socialLinks.map((socialLink: ProfileSocial, index: number) => (
                    <a
                      key={`social-${index}`}
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
          </div>

          {/* Short Bio */}
          {profile.header?.shortBio && (
            <div className="mt-6 text-lg leading-relaxed max-w-3xl mx-auto md:mx-0">{profile.header.shortBio}</div>
          )}
        </div>

        {/* Content Sections */}
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
            .sort((a: ProfileSection, b: ProfileSection) => a.order - b.order)
            .map((section: ProfileSection, index: number) => (
              <div key={`section-${index}`} className="space-y-4">
                <h2 className="text-2xl font-bold" style={{ color: profile.theme.secondaryColor }}>
                  {section.title}
                </h2>
                {renderSection(section, index)}
              </div>
            ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Created with <span className="font-medium">Ñ</span> <span className="opacity-80">enye.social</span>
          </p>
        </div>
      </div>
    </div>
  )
}

