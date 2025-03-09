import { getUserByUsername, getUserPublicProfiles } from "@/lib/db"
import type { Profile } from "@/lib/db"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Eye } from "lucide-react"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params

  const user = await getUserByUsername(username)

  if (!user) {
    return {
      title: "User Not Found | Ñ",
      description: "The requested user could not be found.",
    }
  }

  return {
    title: `${user.name}'s Profiles | Ñ`,
    description: `View ${user.name}'s public profiles on Ñ`,
    openGraph: {
      title: `${user.name}'s Profiles | Ñ`,
      description: `View ${user.name}'s public profiles on Ñ`,
      type: "profile",
      ...(user.image && { images: [{ url: user.image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.name}'s Profiles | Ñ`,
      description: `View ${user.name}'s public profiles on Ñ`,
      ...(user.image && { images: [user.image] }),
    },
  }
}

export default async function UserProfilesPage({ params }: PageProps) {
  const { username } = await params

  const user = await getUserByUsername(username)

  if (!user) {
    notFound()
  }

  const profiles = await getUserPublicProfiles(user._id.toString())

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* User Header */}
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-md">
            <AvatarImage src={user.image || ""} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {user.name
                .split(" ")
                .map((name: string) => name[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{user.name}</h1>
            {user.bio && <p className="text-lg text-gray-600 mb-4">{user.bio}</p>}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {/* You can add social links here if needed */}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Public Profiles</h2>

        {profiles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-lg text-gray-600">No public profiles available.</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <ProfileCard key={profile._id?.toString()} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileCard({ profile }: { profile: Profile }) {
  // Get primary profile picture if available
  const primaryPicture =
    profile.header?.pictures?.find((pic: { isPrimary: boolean }) => pic.isPrimary) || profile.header?.pictures?.[0]

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Card Header with gradient based on profile theme */}
      <div
        className="h-3 w-full"
        style={{
          background: `linear-gradient(to right, ${profile.theme.primaryColor}, ${profile.theme.secondaryColor})`,
        }}
      />

      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{profile.title}</CardTitle>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex gap-4 mb-4">
          {/* Profile image or fallback */}
          <div
            className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border"
            style={{ backgroundColor: profile.theme.backgroundColor || "#f8f9fa" }}
          >
            {primaryPicture ? (
              <Image
                src={primaryPicture.url || "/placeholder.svg"}
                alt={primaryPicture.altText || profile.title}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: profile.theme.primaryColor || "#4263eb" }}
              >
                <span className="text-white font-bold text-xl">{profile.title.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>

          <div>
            {profile.header?.shortBio && (
              <p className="text-sm text-gray-600 line-clamp-3">{profile.header.shortBio}</p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/p/${profile.slug}`}>
            <Eye className="mr-2 h-4 w-4" /> View Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

