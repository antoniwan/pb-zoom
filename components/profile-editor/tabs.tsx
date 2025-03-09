"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { Profile } from "@/lib/db"
import { ProfileBasicInfo } from "@/components/profile-editor/basic-info"
import { ProfileHeaderEditor } from "@/components/profile-editor/header-editor"
import { ThemeEditor } from "@/components/profile-editor/theme-editor"
import { ProfileSectionsEditor } from "@/components/profile-editor/sections-editor"
import { ProfileSocialEditor } from "@/components/profile-editor/social-editor"
import { ProfilePreview } from "@/components/profile-preview"
import { Settings2, User2, Palette, Link2, LayoutGrid, Eye } from "lucide-react"

interface ProfileEditorTabsProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

export function ProfileEditorTabs({ profile, updateProfile }: ProfileEditorTabsProps) {
  const tabItems = [
    { icon: <Settings2 className="h-4 w-4" />, label: "Basic Info", value: "basic" },
    { icon: <User2 className="h-4 w-4" />, label: "Header", value: "header" },
    { icon: <Palette className="h-4 w-4" />, label: "Theme", value: "theme" },
    { icon: <LayoutGrid className="h-4 w-4" />, label: "Sections", value: "sections" },
    { icon: <Link2 className="h-4 w-4" />, label: "Social", value: "social" },
    { icon: <Eye className="h-4 w-4" />, label: "Preview", value: "preview" },
  ]

  return (
    <Tabs defaultValue="basic" className="space-y-6">
      <TabsList className="grid grid-cols-3 sm:grid-cols-6">
        {tabItems.map((item) => (
          <TabsTrigger key={item.value} value={item.value} className="flex items-center gap-2">
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabItems.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <Card className="overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                {item.value === "basic" && <ProfileBasicInfo profile={profile} updateProfile={updateProfile} />}
                {item.value === "header" && <ProfileHeaderEditor profile={profile} updateProfile={updateProfile} />}
                {item.value === "theme" && <ThemeEditor profile={profile} updateProfile={updateProfile} />}
                {item.value === "sections" && <ProfileSectionsEditor profile={profile} updateProfile={updateProfile} />}
                {item.value === "social" && <ProfileSocialEditor profile={profile} updateProfile={updateProfile} />}
                {item.value === "preview" && <ProfilePreview profile={profile} />}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

