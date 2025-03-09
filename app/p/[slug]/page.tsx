import { notFound } from "next/navigation"
import { PublicProfile } from "@/components/public-profile"
import { incrementProfileViews } from "@/lib/profile-actions"
import type { Metadata } from "next"

interface ProfilePageProps {
  params: {
    slug: string
  }
}

// This function would be in your lib/db.ts file
async function getProfileBySlug(slug: string) {
  try {
    // In a real implementation, this would directly query your database
    // For now, we'll use the API route but with a relative path
    const response = await fetch(`/api/profiles/slug/${slug}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching profile:", error)
    return null
  }
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const profile = await getProfileBySlug(params.slug)

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
  const profile = await getProfileBySlug(params.slug)

  if (!profile || !profile.isPublic) {
    notFound()
  }

  // Increment view count
  await incrementProfileViews(profile._id)

  return <PublicProfile profile={profile} />
}

