"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Search,
  LayoutDashboard,
  Clock,
  Filter,
  Briefcase,
  Gamepad,
  Palette,
  GraduationCap,
  Heart,
  Users,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Profile, ProfileCategory } from "@/lib/models"
import type { Session } from "next-auth"

type SessionStatus = "authenticated" | "loading" | "unauthenticated"

export default function DashboardPage() {
  const { data: session, status }: { data: Session | null; status: SessionStatus } = useSession()
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [categories, setCategories] = useState<ProfileCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (status === "authenticated") {
      fetchProfiles()
      fetchCategories()
    }
  }, [status, router])

  const fetchProfiles = async () => {
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
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

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

  // Get category name by ID
  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId) return "Uncategorized"
    const category = categories.find((cat) => cat._id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  // Get category icon by ID or name
  const getCategoryIcon = (categoryId: string | undefined) => {
    if (!categoryId) return <Sparkles className="h-5 w-5" />

    const category = categories.find((cat) => cat._id === categoryId)
    if (!category) return <Sparkles className="h-5 w-5" />

    const name = category.name.toLowerCase()

    if (name.includes("professional") || name.includes("work") || name.includes("business")) {
      return <Briefcase className="h-5 w-5" />
    } else if (name.includes("gaming") || name.includes("game")) {
      return <Gamepad className="h-5 w-5" />
    } else if (name.includes("creative") || name.includes("art")) {
      return <Palette className="h-5 w-5" />
    } else if (name.includes("academic") || name.includes("education")) {
      return <GraduationCap className="h-5 w-5" />
    } else if (name.includes("personal") || name.includes("dating")) {
      return <Heart className="h-5 w-5" />
    } else if (name.includes("social") || name.includes("community")) {
      return <Users className="h-5 w-5" />
    } else {
      return <Sparkles className="h-5 w-5" />
    }
  }

  // Filter profiles based on search query and selected category
  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      searchQuery === "" ||
      profile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (profile.header?.name && profile.header.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === null || profile.categoryId === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Group profiles by category
  const profilesByCategory = filteredProfiles.reduce(
    (acc, profile) => {
      const categoryId = profile.categoryId || "uncategorized"
      if (!acc[categoryId]) {
        acc[categoryId] = []
      }
      acc[categoryId].push(profile)
      return acc
    },
    {} as Record<string, Profile[]>,
  )

  // Get stats
  const totalProfiles = profiles.length
  const publicProfiles = profiles.filter((p) => p.isPublic).length
  const privateProfiles = profiles.filter((p) => !p.isPublic).length
  const categorizedProfiles = profiles.filter((p) => p.categoryId).length

  // Get recently updated profiles
  const recentProfiles = [...profiles]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)

  if (!session) {
    return null
  }

  if ((status as SessionStatus) === "loading" || isLoading) {
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
    <div className="container mx-auto py-6">
      {/* Improved header section with better spacing and alignment */}
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {session.user?.name}</p>
          </div>
          <Button size="sm" className="sm:self-start" asChild>
            <Link href="/dashboard/profiles/new">
              <Plus className="mr-2 h-4 w-4" /> Create New Profile
            </Link>
          </Button>
        </div>

        {/* Improved stats cards with better visual hierarchy */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Profiles"
            value={totalProfiles}
            icon={<LayoutDashboard className="h-4 w-4 text-primary" />}
          />
          <StatsCard title="Public Profiles" value={publicProfiles} icon={<Eye className="h-4 w-4 text-green-500" />} />
          <StatsCard
            title="Private Profiles"
            value={privateProfiles}
            icon={<Lock className="h-4 w-4 text-amber-500" />}
          />
          <StatsCard
            title="Categorized"
            value={categorizedProfiles}
            icon={<Filter className="h-4 w-4 text-indigo-500" />}
          />
        </div>

        {/* Improved tabs and controls layout */}
        <div className="space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
                  <TabsTrigger value="all">All Profiles</TabsTrigger>
                  <TabsTrigger value="by-category">By Category</TabsTrigger>
                  <TabsTrigger value="recent">Recently Updated</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex items-center gap-2 self-end">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search profiles..."
                    className="w-full sm:w-[200px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {categories.length > 0 && (
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedCategory || ""}
                    onChange={(e) => setSelectedCategory(e.target.value === "" ? null : e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  title={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}
                >
                  {viewMode === "grid" ? <LayoutList className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <TabsContent value="all">
              {filteredProfiles.length === 0 ? (
                <EmptyProfilesState />
              ) : viewMode === "grid" ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProfiles.map((profile) => (
                    <ProfileCard
                      key={profile._id}
                      profile={profile}
                      onDelete={handleDeleteProfile}
                      categoryName={getCategoryName(profile.categoryId)}
                      categoryIcon={getCategoryIcon(profile.categoryId)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProfiles.map((profile) => (
                    <ProfileListItem
                      key={profile._id}
                      profile={profile}
                      onDelete={handleDeleteProfile}
                      categoryName={getCategoryName(profile.categoryId)}
                      categoryIcon={getCategoryIcon(profile.categoryId)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="by-category">
              {Object.keys(profilesByCategory).length === 0 ? (
                <EmptyProfilesState />
              ) : (
                <div className="space-y-8">
                  {Object.entries(profilesByCategory).map(([categoryId, categoryProfiles]) => (
                    <div key={categoryId} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-muted">
                          {getCategoryIcon(categoryId === "uncategorized" ? undefined : categoryId)}
                        </div>
                        <h2 className="text-xl font-semibold">
                          {categoryId === "uncategorized" ? "Uncategorized" : getCategoryName(categoryId)}
                        </h2>
                        <Badge variant="outline">{categoryProfiles.length}</Badge>
                      </div>

                      {viewMode === "grid" ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {categoryProfiles.map((profile) => (
                            <ProfileCard
                              key={profile._id}
                              profile={profile}
                              onDelete={handleDeleteProfile}
                              categoryName={getCategoryName(profile.categoryId)}
                              categoryIcon={getCategoryIcon(profile.categoryId)}
                              hideCategoryBadge
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {categoryProfiles.map((profile) => (
                            <ProfileListItem
                              key={profile._id}
                              profile={profile}
                              onDelete={handleDeleteProfile}
                              categoryName={getCategoryName(profile.categoryId)}
                              categoryIcon={getCategoryIcon(profile.categoryId)}
                              hideCategoryBadge
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recently Updated
                </h2>

                {recentProfiles.length === 0 ? (
                  <EmptyProfilesState />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentProfiles.map((profile) => (
                      <ProfileCard
                        key={profile._id}
                        profile={profile}
                        onDelete={handleDeleteProfile}
                        categoryName={getCategoryName(profile.categoryId)}
                        categoryIcon={getCategoryIcon(profile.categoryId)}
                      />
                    ))}
                  </div>
                )}

                {profiles.length > 3 && (
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" asChild>
                      <Link href="/dashboard/profiles">View All Profiles</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Create a New Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 4).map((category) => (
              <Card key={category._id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="p-2 rounded-full"
                      style={{ backgroundColor: category.color ? `${category.color}20` : "#1d4ed820" }}
                    >
                      {getCategoryIcon(category._id)}
                    </div>
                    <CardTitle className="text-base">{category.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/dashboard/profiles/new?category=${category._id}`}>
                      <Plus className="mr-2 h-4 w-4" /> Create {category.name} Profile
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Empty state component
function EmptyProfilesState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <div className="mb-4 rounded-full bg-muted p-3">
          <Plus className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-xl font-medium">No profiles found</h3>
        <p className="mb-4 text-center text-muted-foreground">Create your first profile to get started</p>
        <Button asChild>
          <Link href="/dashboard/profiles/new">
            <Plus className="mr-2 h-4 w-4" /> Create New Profile
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

// Profile card component
function ProfileCard({
  profile,
  onDelete,
  categoryName,
  categoryIcon,
  hideCategoryBadge = false,
}: {
  profile: Profile
  onDelete: (id: string) => void
  categoryName: string
  categoryIcon: React.ReactNode
  hideCategoryBadge?: boolean
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1">{profile.title}</CardTitle>
          {profile.isPublic ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
              Public
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
              Private
            </Badge>
          )}
        </div>
        <CardDescription className="flex items-center gap-2">
          Last updated {new Date(profile.updatedAt).toLocaleDateString()}
          {!hideCategoryBadge && profile.categoryId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {categoryIcon}
              <span>{categoryName}</span>
            </Badge>
          )}
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
            <Link href={`/dashboard/profiles/${profile._id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(profile._id)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/profiles/${profile._id}/preview`}>
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
  )
}

// Profile list item component
function ProfileListItem({
  profile,
  onDelete,
  categoryName,
  categoryIcon,
  hideCategoryBadge = false,
}: {
  profile: Profile
  onDelete: (id: string) => void
  categoryName: string
  categoryIcon: React.ReactNode
  hideCategoryBadge?: boolean
}) {
  return (
    <Card>
      <div className="flex flex-col md:flex-row md:items-center p-4 gap-4">
        <div
          className="w-12 h-12 rounded-md flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: profile.theme.primaryColor }}
        >
          {profile.header?.pictures && profile.header.pictures.length > 0 ? (
            <div className="w-full h-full relative overflow-hidden rounded-md">
              <Image
                src={profile.header.pictures[0].url || "/placeholder.svg"}
                alt={profile.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <span className="text-white font-bold text-lg">{profile.title.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{profile.title}</h3>
            {profile.isPublic ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                Public
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                Private
              </Badge>
            )}

            {!hideCategoryBadge && profile.categoryId && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {categoryIcon}
                <span>{categoryName}</span>
              </Badge>
            )}
          </div>

          <div className="text-sm text-muted-foreground mt-1">
            Last updated {new Date(profile.updatedAt).toLocaleDateString()} •{profile.sections.length}{" "}
            {profile.sections.length === 1 ? "section" : "sections"}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/profiles/${profile._id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/profiles/${profile._id}/preview`}>
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
          <Button variant="outline" size="sm" onClick={() => onDelete(profile._id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Missing icons
function Lock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function LayoutGrid(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}

function LayoutList(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
      <path d="M14 4h7" />
      <path d="M14 9h7" />
      <path d="M14 15h7" />
      <path d="M14 20h7" />
    </svg>
  )
}

// Stats card component
function StatsCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="rounded-full p-2 bg-muted">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

