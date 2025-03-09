"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useDebounce } from "@/lib/hooks/ui/use-debounce"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

// Icons
import {
  Plus,
  Search,
  LayoutGrid,
  LayoutList,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Clock,
  Sparkles,
  Briefcase,
  Gamepad,
  Palette,
  GraduationCap,
  Heart,
  Users,
  ArrowUpRight,
  Filter,
  SlidersHorizontal,
  Star,
  TrendingUp,
} from "lucide-react"

// Types
import type { Profile, Category } from "@/lib/db"
import type { Session } from "next-auth"

type SessionStatus = "authenticated" | "loading" | "unauthenticated"

export default function DashboardPage() {
  const { data: session, status }: { data: Session | null; status: SessionStatus } = useSession()
  const router = useRouter()

  // State
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"recent" | "name" | "views">("recent")
  const [activeTab, setActiveTab] = useState("all")

  // Stats
  const [stats, setStats] = useState({
    totalProfiles: 0,
    publicProfiles: 0,
    totalViews: 0,
    mostPopularProfile: null as Profile | null,
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (status === "authenticated") {
      fetchProfiles()
      fetchCategories()
    }
  }, [status, router])

  useEffect(() => {
    if (profiles.length > 0) {
      // Calculate stats
      const publicProfiles = profiles.filter((p) => p.isPublic)
      const totalViews = profiles.reduce((sum, profile) => sum + (profile.viewCount || 0), 0)
      const mostPopular = [...profiles].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))[0]

      setStats({
        totalProfiles: profiles.length,
        publicProfiles: publicProfiles.length,
        totalViews: totalViews,
        mostPopularProfile: mostPopular,
      })
    }
  }, [profiles])

  const fetchProfiles = async () => {
    try {
      const response = await fetch("/api/profiles")
      if (!response.ok) throw new Error("Failed to fetch profiles")
      const data = await response.json()
      setProfiles(data)
    } catch (error) {
      console.error("Error fetching profiles:", error)
      toast({
        title: "Error",
        description: "Failed to load your profiles. Please try again.",
        variant: "destructive",
      })
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
        toast({
          title: "Success",
          description: "Profile deleted successfully",
        })
      } else {
        throw new Error("Failed to delete profile")
      }
    } catch (error) {
      console.error("Error deleting profile:", error)
      toast({
        title: "Error",
        description: "Failed to delete profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const response = await fetch(`/api/profiles/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublic: !currentVisibility,
        }),
      })

      if (response.ok) {
        setProfiles(
          profiles.map((profile) => (profile._id === id ? { ...profile, isPublic: !currentVisibility } : profile)),
        )
        toast({
          title: "Success",
          description: `Profile is now ${!currentVisibility ? "public" : "private"}`,
        })
      } else {
        throw new Error("Failed to update profile visibility")
      }
    } catch (error) {
      console.error("Error updating profile visibility:", error)
      toast({
        title: "Error",
        description: "Failed to update profile visibility. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId) return "Uncategorized"
    const category = categories.find((cat) => cat._id?.toString() === categoryId)
    return category ? category.name : "Uncategorized"
  }

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

  const getCategoryColor = (categoryId: string | undefined) => {
    if (!categoryId) return "#6366f1" // Default indigo color
    const category = categories.find((cat) => cat._id?.toString() === categoryId)
    return category?.color || "#6366f1"
  }

  // Filter and sort profiles
  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      debouncedSearchQuery === "" ||
      profile.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (profile.header?.name && profile.header.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))

    const matchesCategory =
      selectedCategories.length === 0 ||
      (profile.categoryIds && profile.categoryIds.some((id) => selectedCategories.includes(id)))

    return matchesSearch && matchesCategory
  })

  // Sort profiles
  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    if (sortBy === "recent") {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
      return dateB - dateA
    } else if (sortBy === "name") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "views") {
      return (b.viewCount || 0) - (a.viewCount || 0)
    }
    return 0
  })

  // Get recent profiles
  const recentProfiles = [...profiles]
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 3)

  // Get popular profiles
  const popularProfiles = [...profiles].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 3)

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <DashboardSkeleton />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name}</h1>
            <p className="text-muted-foreground mt-1">Manage your profiles and create new ones</p>
          </div>
          <Button size="sm" className="sm:self-start" asChild>
            <Link href="/dashboard/profiles/new">
              <Plus className="mr-2 h-4 w-4" /> Create New Profile
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Total Profiles"
            value={stats.totalProfiles.toString()}
            icon={<LayoutGrid className="h-5 w-5 text-blue-500" />}
            description="Your created profiles"
            trend={profiles.length > 0 ? "+1 this month" : "Create your first!"}
            trendUp={profiles.length > 0}
          />
          <StatsCard
            title="Public Profiles"
            value={stats.publicProfiles.toString()}
            icon={<Eye className="h-5 w-5 text-green-500" />}
            description="Visible to everyone"
            trend={`${Math.round((stats.publicProfiles / Math.max(stats.totalProfiles, 1)) * 100)}% of total`}
            trendUp={stats.publicProfiles > 0}
          />
          <StatsCard
            title="Total Views"
            value={stats.totalViews.toString()}
            icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
            description="Profile impressions"
            trend={stats.totalViews > 10 ? "+12% from last week" : "Share to get more!"}
            trendUp={stats.totalViews > 0}
          />
          <StatsCard
            title="Popular Profile"
            value={stats.mostPopularProfile?.title || "None yet"}
            icon={<Star className="h-5 w-5 text-amber-500" />}
            description="Your most viewed profile"
            trend={
              stats.mostPopularProfile ? `${stats.mostPopularProfile.viewCount || 0} views` : "Create more profiles!"
            }
            trendUp={Boolean(stats.mostPopularProfile)}
            isText
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-1">
          <QuickActionCard
            title="Create New Profile"
            description="Start building a new profile from scratch"
            icon={<Plus className="h-5 w-5" />}
            href="/dashboard/profiles/new"
            color="bg-blue-500"
          />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all">All Profiles</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" title="Filter options">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2">
                      <h4 className="mb-2 text-sm font-medium">Sort by</h4>
                      <div className="space-y-1">
                        <Button
                          variant={sortBy === "recent" ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSortBy("recent")}
                        >
                          <Clock className="mr-2 h-4 w-4" /> Most Recent
                        </Button>
                        <Button
                          variant={sortBy === "name" ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSortBy("name")}
                        >
                          <Filter className="mr-2 h-4 w-4" /> Alphabetical
                        </Button>
                        <Button
                          variant={sortBy === "views" ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setSortBy("views")}
                        >
                          <TrendingUp className="mr-2 h-4 w-4" /> Most Viewed
                        </Button>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <h4 className="mb-2 text-sm font-medium">View</h4>
                      <div className="flex gap-2">
                        <Button
                          variant={viewMode === "grid" ? "default" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={() => setViewMode("grid")}
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={() => setViewMode("list")}
                        >
                          <LayoutList className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {categories.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <div className="p-2">
                          <h4 className="mb-2 text-sm font-medium">Categories</h4>
                          <div className="max-h-[200px] overflow-auto space-y-1">
                            {categories.map((category) => (
                              <div key={category._id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`category-${category._id}`}
                                  checked={selectedCategories.includes(category._id || "")}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedCategories([...selectedCategories, category._id || ""])
                                    } else {
                                      setSelectedCategories(selectedCategories.filter((id) => id !== category._id))
                                    }
                                  }}
                                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label
                                  htmlFor={`category-${category._id}`}
                                  className="text-sm flex items-center gap-1.5"
                                >
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                  ></div>
                                  {category.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <TabsContent value="all" className="mt-6">
              {filteredProfiles.length === 0 ? (
                <EmptyProfilesState />
              ) : viewMode === "grid" ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedProfiles.map((profile) => (
                    <ProfileCard
                      key={profile._id?.toString()}
                      profile={profile}
                      onDelete={handleDeleteProfile}
                      onToggleVisibility={handleToggleVisibility}
                      getCategoryName={getCategoryName}
                      getCategoryIcon={getCategoryIcon}
                      getCategoryColor={getCategoryColor}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedProfiles.map((profile) => (
                    <ProfileListItem
                      key={profile._id?.toString()}
                      profile={profile}
                      onDelete={handleDeleteProfile}
                      onToggleVisibility={handleToggleVisibility}
                      getCategoryName={getCategoryName}
                      getCategoryIcon={getCategoryIcon}
                      getCategoryColor={getCategoryColor}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recently Updated
                </h2>

                {recentProfiles.length === 0 ? (
                  <EmptyProfilesState />
                ) : viewMode === "grid" ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentProfiles.map((profile) => (
                      <ProfileCard
                        key={profile._id?.toString()}
                        profile={profile}
                        onDelete={handleDeleteProfile}
                        onToggleVisibility={handleToggleVisibility}
                        getCategoryName={getCategoryName}
                        getCategoryIcon={getCategoryIcon}
                        getCategoryColor={getCategoryColor}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentProfiles.map((profile) => (
                      <ProfileListItem
                        key={profile._id?.toString()}
                        profile={profile}
                        onDelete={handleDeleteProfile}
                        onToggleVisibility={handleToggleVisibility}
                        getCategoryName={getCategoryName}
                        getCategoryIcon={getCategoryIcon}
                        getCategoryColor={getCategoryColor}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="popular" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Most Viewed Profiles
                </h2>

                {popularProfiles.length === 0 ? (
                  <EmptyProfilesState />
                ) : viewMode === "grid" ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {popularProfiles.map((profile) => (
                      <ProfileCard
                        key={profile._id?.toString()}
                        profile={profile}
                        onDelete={handleDeleteProfile}
                        onToggleVisibility={handleToggleVisibility}
                        getCategoryName={getCategoryName}
                        getCategoryIcon={getCategoryIcon}
                        getCategoryColor={getCategoryColor}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {popularProfiles.map((profile) => (
                      <ProfileListItem
                        key={profile._id?.toString()}
                        profile={profile}
                        onDelete={handleDeleteProfile}
                        onToggleVisibility={handleToggleVisibility}
                        getCategoryName={getCategoryName}
                        getCategoryIcon={getCategoryIcon}
                        getCategoryColor={getCategoryColor}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Component for empty state
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

// Component for profile card in grid view
function ProfileCard({
  profile,
  onDelete,
  onToggleVisibility,
  hideCategoryBadge = false,
  getCategoryName,
  getCategoryIcon,
  getCategoryColor,
}: {
  profile: Profile
  onDelete: (id: string) => void
  onToggleVisibility: (id: string, isPublic: boolean) => void
  hideCategoryBadge?: boolean
  getCategoryName: (id: string | undefined) => string
  getCategoryIcon: (id: string | undefined) => React.ReactNode
  getCategoryColor: (id: string | undefined) => string
}) {
  const primaryPicture = profile.header?.pictures?.find((pic) => pic.isPrimary) || profile.header?.pictures?.[0]

  const updatedDate = new Date(profile.updatedAt)
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: updatedDate.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  }).format(updatedDate)

  const categories =
    profile.categoryIds?.map((id) => ({
      id,
      name: getCategoryName(id),
      icon: getCategoryIcon(id),
      color: getCategoryColor(id),
    })) || []

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden group hover:shadow-md transition-all duration-200 border-opacity-40">
        <div
          className="h-3 w-full"
          style={{
            background: `linear-gradient(to right, ${profile.theme.primaryColor}, ${profile.theme.secondaryColor})`,
          }}
        />

        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${profile.isPublic ? "bg-green-500" : "bg-amber-500"}`} />
              <span className="text-xs font-medium text-muted-foreground">
                {profile.isPublic ? "Public" : "Private"}
              </span>
            </div>

            {!hideCategoryBadge && categories.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-end">
                {categories.map((category, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 bg-background/80">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-xs">{category.name}</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 mb-4">
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

              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${profile.completionPercentage || 50}%`,
                      backgroundColor: profile.theme.primaryColor,
                    }}
                  />
                </div>
                <span className="text-xs font-medium">{profile.completionPercentage || 50}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-muted/50 rounded-md p-2 text-center">
              <span className="text-xs text-muted-foreground block">Sections</span>
              <span className="font-medium">{profile.sections.length}</span>
            </div>
            <div className="bg-muted/50 rounded-md p-2 text-center">
              <span className="text-xs text-muted-foreground block">Views</span>
              <span className="font-medium">{profile.viewCount || 0}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="default" size="sm" asChild>
                <Link href={`/dashboard/profiles/${profile._id?.toString()}/edit`}>
                  <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleVisibility(profile._id?.toString() || "", profile.isPublic)}
              >
                {profile.isPublic ? (
                  <>
                    <EyeOff className="mr-1.5 h-3.5 w-3.5" /> Hide
                  </>
                ) : (
                  <>
                    <Eye className="mr-1.5 h-3.5 w-3.5" /> Publish
                  </>
                )}
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
    </motion.div>
  )
}

// Component for profile list item in list view
function ProfileListItem({
  profile,
  onDelete,
  onToggleVisibility,
  getCategoryName,
  getCategoryIcon,
  getCategoryColor,
}: {
  profile: Profile
  onDelete: (id: string) => void
  onToggleVisibility: (id: string, isPublic: boolean) => void
  getCategoryName: (id: string | undefined) => string
  getCategoryIcon: (id: string | undefined) => React.ReactNode
  getCategoryColor: (id: string | undefined) => string
}) {
  const primaryPicture = profile.header?.pictures?.find((pic) => pic.isPrimary) || profile.header?.pictures?.[0]

  const updatedDate = new Date(profile.updatedAt)
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: updatedDate.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    hour: "numeric",
    minute: "numeric",
  }).format(updatedDate)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden hover:shadow-md transition-all duration-200 group">
        <div className="flex items-stretch">
          <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: profile.theme.primaryColor }} />

          <div className="flex flex-col md:flex-row md:items-center p-4 gap-4 flex-1">
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

                {profile.categoryIds?.map((categoryId) => (
                  <div
                    key={categoryId}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-xs font-medium"
                    style={{
                      backgroundColor: `${getCategoryColor(categoryId)}20`,
                      color: getCategoryColor(categoryId),
                    }}
                  >
                    {getCategoryIcon(categoryId)}
                    <span>{getCategoryName(categoryId)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formattedDate}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{profile.viewCount || 0} views</span>
                </div>
              </div>
            </div>

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

                  <DropdownMenuItem
                    onClick={() => onToggleVisibility(profile._id?.toString() || "", profile.isPublic)}
                    className="cursor-pointer"
                  >
                    {profile.isPublic ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" /> Make Private
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" /> Make Public
                      </>
                    )}
                  </DropdownMenuItem>

                  {profile.isPublic && (
                    <DropdownMenuItem asChild>
                      <Link href={`/p/${profile.slug}`} target="_blank" className="cursor-pointer">
                        <ExternalLink className="mr-2 h-4 w-4" /> View Live
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => onDelete(profile._id?.toString() || "")}
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Component for stats card
function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  trendUp = true,
  isText = false,
}: {
  title: string
  value: string
  icon: React.ReactNode
  description: string
  trend: string
  trendUp?: boolean
  isText?: boolean
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className={`mt-2 font-semibold ${isText ? "text-lg" : "text-3xl"}`}>{value}</h3>
          </div>
          <div className="rounded-full p-2 bg-muted/50">{icon}</div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        <div className={`mt-2 flex items-center text-xs ${trendUp ? "text-green-500" : "text-amber-500"}`}>
          {trendUp ? <ArrowUpRight className="mr-1 h-3 w-3" /> : null}
          <span>{trend}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Component for quick action card
function QuickActionCard({
  title,
  description,
  icon,
  href,
  color,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200">
      <Link href={href} className="block h-full">
        <div className="flex h-full">
          <div className={`w-2 ${color}`}></div>
          <CardContent className="flex-1 p-6">
            <div className="flex items-start gap-4">
              <div className={`rounded-full p-2 ${color} bg-opacity-10`}>{icon}</div>
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  )
}

// Component for dashboard skeleton loading state
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <Skeleton className="h-3 w-32 mt-2" />
                <Skeleton className="h-3 w-20 mt-2" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <div className="h-3 w-full bg-muted" />
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex gap-4 mb-4">
                    <Skeleton className="w-16 h-16 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-3 w-24 mb-2" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Skeleton className="h-12 rounded-md" />
                    <Skeleton className="h-12 rounded-md" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}

