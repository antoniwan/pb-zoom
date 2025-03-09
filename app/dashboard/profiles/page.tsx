"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Eye, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Profile } from "@/lib/db"

export default function ProfilesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfiles = useCallback(async () => {
    try {
      const response = await fetch("/api/profiles")
      if (!response.ok) throw new Error("Failed to fetch profiles")
      const data = await response.json()
      setProfiles(data)
    } catch (error) {
      console.error("Error fetching profiles:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (status === "authenticated") {
      fetchProfiles()
    }
  }, [status, router, fetchProfiles])

  const handleDeleteProfile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) {
      return
    }

    try {
      const response = await fetch(`/api/profiles/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProfiles(profiles.filter((profile) => profile._id !== id))
      }
    } catch (error) {
      console.error("Error deleting profile:", error)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Profiles</h1>
        <Button asChild>
          <Link href="/dashboard/profiles/new">
            <Plus className="mr-2 h-4 w-4" /> Create New Profile
          </Link>
        </Button>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="mb-4 rounded-full bg-muted p-3">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-medium">No profiles yet</h3>
            <p className="mb-4 text-center text-muted-foreground">Create your first profile to get started</p>
            <Button asChild>
              <Link href="/dashboard/profiles/new">
                <Plus className="mr-2 h-4 w-4" /> Create New Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <Card key={profile._id || ""}>
              <CardHeader>
                <CardTitle>{profile.title}</CardTitle>
                <CardDescription>
                  {profile.isPublic ? "Public" : "Private"} • Last updated{" "}
                  {new Date(profile.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="h-40 rounded-md overflow-hidden border"
                  style={{ backgroundColor: profile.theme.backgroundColor }}
                >
                  <div
                    className="h-8 w-full px-3 py-2 flex items-center"
                    style={{ backgroundColor: profile.theme.primaryColor, color: "#fff" }}
                  >
                    <span className="text-sm font-medium truncate">{profile.title}</span>
                  </div>
                  <div className="p-3">
                    {profile.sections && profile.sections.length > 0 ? (
                      <div className="space-y-2">
                        {profile.sections.slice(0, 2).map((section, i) => (
                          <div key={i} className="flex flex-col">
                            <span className="text-xs font-medium" style={{ color: profile.theme.secondaryColor }}>
                              {section.title}
                            </span>
                            <div
                              className="h-2 w-full mt-1 rounded-full"
                              style={{ backgroundColor: `${profile.theme.secondaryColor}20` }}
                            >
                              <div
                                className="h-full rounded-full"
                                style={{
                                  backgroundColor: profile.theme.secondaryColor,
                                  width: `${Math.random() * 60 + 20}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                        {profile.sections.length > 2 && (
                          <div className="text-xs text-center mt-1" style={{ color: profile.theme.textColor }}>
                            +{profile.sections.length - 2} more sections
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                        No sections added yet
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/profiles/${profile._id || ""}/edit`}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteProfile(profile._id || "")}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/profiles/${profile._id || ""}/preview`}>
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </Link>
                  </Button>
                  {profile.isPublic && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/p/${profile.slug}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" /> View
                      </Link>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

