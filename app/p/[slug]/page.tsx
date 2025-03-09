import { notFound } from "next/navigation"
import { PublicProfile } from "@/components/public-profile"
import { incrementProfileViews } from "@/lib/profile-actions"
import { getProfileBySlug } from "@/lib/db"
import type { Metadata } from "next"

interface ProfilePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  // Properly await the params object
  const { slug } = await params
  const profile = await getProfileBySlug(slug)

  if (!profile) {
    return {
      title: "Profile Not Found",
      description: "The requested profile could not be found.",
    }
  }

  return {
    title: profile.title || "Profile",
    description: profile.bio || profile.subtitle || "View my professional profile",
    openGraph: {
      title: profile.title || "Profile",
      description: profile.bio || profile.subtitle || "View my professional profile",
      images: profile.header?.coverImage ? [profile.header.coverImage] : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: profile.title || "Profile",
      description: profile.bio || profile.subtitle || "View my professional profile",
      images: profile.header?.coverImage ? [profile.header.coverImage] : [],
    },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // Properly await the params object
  const { slug } = await params
  const profile = await getProfileBySlug(slug)

  if (!profile || !profile.isPublic) {
    notFound()
  }

  // Increment view count
  await incrementProfileViews(profile._id)

  return <PublicProfile profile={profile} />
}

