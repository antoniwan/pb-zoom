"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  Layers,
  Link2,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Profile, Category } from "@/lib/db"
import type { Session } from "next-auth"

// Add the import for the debounce hook at the top
import { useDebounce } from "@/hooks/use-debounce"

// Add these imports for the dropdown menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type SessionStatus = "authenticated" | "loading" | "unauthenticated"

export default function DashboardPage() {
  const { data: session, status }: { data: Session | null; status: SessionStatus } = useSession()
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // Find the searchQuery state and add a new debouncedSearchQuery state
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
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
    const category = categories.find((cat) => cat._id?.toString() === categoryId)
    return category ? category.name : "Uncategorized"
  }

  // Get category icon by ID or name
  const getCategoryIcon = (categoryId: string | undefined) => {
    if (!categoryId) return <Sparkles className="h-5 w-5" />

    const category = categories.find((cat) => cat._id?.toString() === categoryId)
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
      debouncedSearchQuery === "" ||
      profile.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (profile.header?.name && profile.header.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))

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
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
      return dateB - dateA
    })
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
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Improved header section with better spacing and alignment */}
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:gap-4">
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

        {/* Improved tabs and controls layout */}
        <div className="space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:gap-4 mb-4 sm:mb-6">
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
                      key={profile._id?.toString()}
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
                      key={profile._id?.toString()}
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
                              key={profile._id?.toString()}
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
                              key={profile._id?.toString()}
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
                        key={profile._id?.toString()}
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
          <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
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
  // Get primary profile picture if available
  const primaryPicture = profile.header?.pictures?.find((pic) => pic.isPrimary) || profile.header?.pictures?.[0]

  // Calculate how complete the profile is
  const totalPossibleSections = 5 // Bio, Header, Gallery, etc.
  const completionPercentage = Math.min(Math.round((profile.sections.length / totalPossibleSections) * 100), 100)

  // Format the date nicely
  const updatedDate = new Date(profile.updatedAt)
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: updatedDate.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  }).format(updatedDate)

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-200 border-opacity-40">
      {/* Card Header with gradient based on profile theme */}
      <div
        className="h-3 w-full"
        style={{
          background: `linear-gradient(to right, ${profile.theme.primaryColor}, ${profile.theme.secondaryColor})`,
        }}
      />

      <div className="p-5">
        {/* Status indicator and category */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${profile.isPublic ? "bg-green-500" : "bg-amber-500"}`} />
            <span className="text-xs font-medium text-muted-foreground">{profile.isPublic ? "Public" : "Private"}</span>
          </div>

          {!hideCategoryBadge && profile.categoryId && (
            <Badge variant="outline" className="flex items-center gap-1 bg-background/80">
              {categoryIcon}
              <span className="text-xs">{categoryName}</span>
            </Badge>
          )}
        </div>

        {/* Profile title and preview */}
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
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base mb-1 truncate">{profile.title}</h3>
            <div className="flex items-center text-xs text-muted-foreground gap-2">
              <Clock className="h-3 w-3" />
              <span>Updated {formattedDate}</span>
            </div>

            {/* Completion indicator */}
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${completionPercentage}%`,
                    backgroundColor: profile.theme.primaryColor,
                  }}
                />
              </div>
              <span className="text-xs font-medium">{completionPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Stats and metadata */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-muted/50 rounded-md p-2 text-center">
            <span className="text-xs text-muted-foreground block">Sections</span>
            <span className="font-medium">{profile.sections.length}</span>
          </div>
          <div className="bg-muted/50 rounded-md p-2 text-center">
            <span className="text-xs text-muted-foreground block">Links</span>
            <span className="font-medium">{profile.socialLinks?.length || 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="default" size="sm" asChild>
              <Link href={`/dashboard/profiles/${profile._id?.toString()}/edit`}>
                <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/profiles/${profile._id?.toString()}/preview`}>
                <Eye className="mr-1.5 h-3.5 w-3.5" /> Preview
              </Link>
            </Button>
          </div>

          <div className="flex gap-2">
            {profile.isPublic && (
              <Button variant="outline" size="sm" className="px-2" asChild>
                <Link href={`/p/${profile.slug}`} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(profile._id?.toString() || "")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
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
  // Get primary profile picture if available
  const primaryPicture = profile.header?.pictures?.find((pic) => pic.isPrimary) || profile.header?.pictures?.[0]

  // Format the date nicely
  const updatedDate = new Date(profile.updatedAt)
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: updatedDate.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    hour: "numeric",
    minute: "numeric",
  }).format(updatedDate)

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 group">
      <div className="flex items-stretch">
        {/* Left color bar based on profile theme */}
        <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: profile.theme.primaryColor }} />

        <div className="flex flex-col md:flex-row md:items-center p-4 gap-4 flex-1">
          {/* Profile image */}
          <div
            className="w-14 h-14 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border"
            style={{ backgroundColor: profile.theme.backgroundColor || "#f8f9fa" }}
          >
            {primaryPicture ? (
              <Image
                src={primaryPicture.url || "/placeholder.svg"}
                alt={primaryPicture.altText || profile.title}
                width={56}
                height={56}
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

          {/* Profile info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium truncate">{profile.title}</h3>

              <div
                className={`px-1.5 py-0.5 rounded-sm text-xs font-medium ${
                  profile.isPublic ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {profile.isPublic ? "Public" : "Private"}
              </div>

              {!hideCategoryBadge && profile.categoryId && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categoryIcon}
                  <span>{categoryName}</span>
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{formattedDate}</span>
              </div>

              <div className="flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                <span>
                  {profile.sections.length} {profile.sections.length === 1 ? "section" : "sections"}
                </span>
              </div>

              {profile.socialLinks?.length > 0 && (
                <div className="flex items-center gap-1">
                  <Link2 className="h-3.5 w-3.5" />
                  <span>
                    {profile.socialLinks.length} {profile.socialLinks.length === 1 ? "link" : "links"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-2 md:mt-0 md:ml-2">
            <Button variant="default" size="sm" asChild>
              <Link href={`/dashboard/profiles/${profile._id?.toString()}/edit`}>
                <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/profiles/${profile._id?.toString()}/preview`} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" /> Preview
                  </Link>
                </DropdownMenuItem>

                {profile.isPublic && (
                  <DropdownMenuItem asChild>
                    <Link href={`/p/${profile.slug}`} target="_blank" className="cursor-pointer">
                      <ExternalLink className="mr-2 h-4 w-4" /> View Live
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => onDelete(profile._id?.toString() || "")} className="text-red-500 focus:text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

