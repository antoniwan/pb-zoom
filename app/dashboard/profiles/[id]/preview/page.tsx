"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import React from "react"
import { ProfilePreview } from "@/components/profile-preview"
import type { Profile } from "@/lib/models"
import { use } from "react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PreviewProfilePage({ params }: PageProps) {
  const { id } = use(params)
  const [profile, setProfile] = React.useState<Profile | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  const { status } = useSession()

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }
        const data = await response.json()
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
      }
    }

    if (status === "authenticated") {
      fetchProfile()
    }
  }, [status, id])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    redirect("/login")
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!profile) {
    return <div>Profile not found</div>
  }

  return (
    <div>
      <ProfilePreview profile={profile} />
    </div>
  )
}

