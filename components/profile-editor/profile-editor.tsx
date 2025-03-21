"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Icons
import {
  Settings2,
  User2,
  Palette,
  Link2,
  LayoutGrid,
  Eye,
  Save,
  ChevronLeft,
  MoreHorizontal,
  ExternalLink,
  ArrowUpRight,
  Clock,
} from "lucide-react"

// Editor Components
import { ProfileBasicInfo } from "@/components/profile-editor/basic-info"
import { ProfileHeaderEditor } from "@/components/profile-editor/header-editor"
import { ThemeEditor } from "@/components/profile-editor/theme-editor"
import { ProfileSectionsEditor } from "@/components/profile-editor/sections-editor"
import { ProfileSocialEditor } from "@/components/profile-editor/social-editor"
import { ProfilePreview } from "@/components/profile-preview"

// Define the props interface
export interface ProfileEditorProps {
  profile: any // Replace with your actual Profile type
  updateProfile: (updates: any) => void
  saveProfile: () => Promise<any>
  isLoading?: boolean
  onBack?: () => void
}

// Default empty profile for development and testing
const DEFAULT_PROFILE = {
  _id: "sample-id",
  title: "Sample Profile",
  slug: "sample-profile",
  isPublic: false,
  updatedAt: new Date().toISOString(),
  completionPercentage: 30,
  sections: [],
  viewCount: 0,
  socialLinks: [],
  theme: {
    primaryColor: "#1d4ed8",
    secondaryColor: "#67e8f9",
    backgroundColor: "#faf8f9",
    textColor: "#352f44",
    fontFamily: "Inter",
  },
  header: {
    name: "John Doe",
    title: "Web Developer",
    subtitle: "Building amazing web experiences",
    shortBio: "I love creating websites and applications that people enjoy using.",
    pictures: [],
  },
  layout: "standard",
  layoutOptions: {},
  categoryIds: [],
}

export function ProfileEditor({
  profile = DEFAULT_PROFILE,
  updateProfile = () => {},
  saveProfile = async () => {},
  isLoading = false,
  onBack = () => {},
}: ProfileEditorProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(profile?.updatedAt ? new Date(profile.updatedAt) : null)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveProfile()
      setLastSaved(new Date())
      // Success message would go here
    } catch (error) {
      console.error("Error saving profile:", error)
      // Error message would go here
    } finally {
      setIsSaving(false)
    }
  }

  const formatLastSaved = () => {
    if (!lastSaved) return "Not saved yet"

    const now = new Date()
    const diffMs = now.getTime() - lastSaved.getTime()
    const diffMins = Math.round(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins === 1) return "1 minute ago"
    if (diffMins < 60) return `${diffMins} minutes ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours === 1) return "1 hour ago"
    if (diffHours < 24) return `${diffHours} hours ago`

    return lastSaved.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
            <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-24 bg-muted animate-pulse rounded"></div>
                  </CardContent>
                </Card>
              ))}
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="h-64 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const tabItems = [
    { icon: <Settings2 className="h-4 w-4" />, label: "Basic Info", value: "basic" },
    { icon: <User2 className="h-4 w-4" />, label: "Header", value: "header" },
    { icon: <Palette className="h-4 w-4" />, label: "Theme", value: "theme" },
    { icon: <Link2 className="h-4 w-4" />, label: "Social", value: "social" },
    { icon: <LayoutGrid className="h-4 w-4" />, label: "Sections", value: "sections" },
    { icon: <Eye className="h-4 w-4" />, label: "Preview", value: "preview" },
  ]

  // Safely access sections with fallback to empty array
  const sections = profile?.sections || []
  const viewCount = profile?.viewCount || 0
  const isPublic = profile?.isPublic || false
  const completionPercentage = profile?.completionPercentage || 0

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col space-y-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={onBack}>
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{profile?.title || "Untitled Profile"}</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2.5 h-2.5 rounded-full ${isPublic ? "bg-green-500" : "bg-amber-500"}`} />
                <span className="text-sm text-muted-foreground">{isPublic ? "Public" : "Private"}</span>
                {lastSaved && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Last saved: {formatLastSaved()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isPublic && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/p/${profile?.slug}`} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" /> View Live
                </Link>
              </Button>
            )}
            <Button size="sm" onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/profiles/${profile?._id}/preview`}>
                    <Eye className="mr-2 h-4 w-4" /> Preview
                  </Link>
                </DropdownMenuItem>
                {isPublic && (
                  <DropdownMenuItem asChild>
                    <Link href={`/p/${profile?.slug}`} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" /> View Live
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Completion"
            value={`${completionPercentage}%`}
            icon={<LayoutGrid className="h-5 w-5 text-blue-500" />}
            description="Profile completion"
            trend={completionPercentage >= 80 ? "Almost complete!" : "Keep adding content"}
            trendUp={completionPercentage >= 50}
          />
          <StatsCard
            title="Sections"
            value={sections.length.toString()}
            icon={<LayoutGrid className="h-5 w-5 text-green-500" />}
            description="Content sections"
            trend={sections.length > 0 ? `${sections.length} sections added` : "Add your first section"}
            trendUp={sections.length > 0}
          />
          <StatsCard
            title="Visibility"
            value={isPublic ? "Public" : "Private"}
            icon={<Eye className="h-5 w-5 text-purple-500" />}
            description="Profile visibility"
            trend={isPublic ? "Visible to everyone" : "Only visible to you"}
            trendUp={isPublic}
          />
          <StatsCard
            title="Views"
            value={viewCount.toString()}
            icon={<ArrowUpRight className="h-5 w-5 text-amber-500" />}
            description="Total profile views"
            trend={viewCount > 0 ? `${viewCount} impressions` : "Share to get views"}
            trendUp={viewCount > 0}
          />
        </div>

        {/* Main Content */}
        <Card className="overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start p-0 bg-muted/50 rounded-none border-b">
              {tabItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <CardContent className="p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="basic" className="mt-0">
                  <ProfileBasicInfo profile={profile} updateProfile={updateProfile} />
                </TabsContent>
                <TabsContent value="header" className="mt-0">
                  <ProfileHeaderEditor profile={profile} updateProfile={updateProfile} />
                </TabsContent>
                <TabsContent value="theme" className="mt-0">
                  <ThemeEditor profile={profile} updateProfile={updateProfile} />
                </TabsContent>
                <TabsContent value="social" className="mt-0">
                  <ProfileSocialEditor profile={profile} updateProfile={updateProfile} />
                </TabsContent>
                <TabsContent value="sections" className="mt-0">
                  <ProfileSectionsEditor profile={profile} updateProfile={updateProfile} />
                </TabsContent>
                <TabsContent value="preview" className="mt-0">
                  {profile && <ProfilePreview profile={profile} />}
                </TabsContent>
              </motion.div>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
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
}: {
  title: string
  value: string
  icon: React.ReactNode
  description: string
  trend: string
  trendUp?: boolean
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="mt-2 font-semibold text-3xl">{value}</h3>
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

