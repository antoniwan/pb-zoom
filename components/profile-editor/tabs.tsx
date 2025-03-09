"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import type { Profile } from "@/lib/db"
import { ProfileBasicInfo } from "@/components/profile-editor/basic-info"
import { ProfileHeaderEditor } from "@/components/profile-editor/header-editor"
import { ThemeEditor } from "@/components/profile-editor/theme-editor"
import { ProfileSectionsEditor } from "@/components/profile-editor/sections-editor"
import { ProfileSocialEditor } from "@/components/profile-editor/social-editor"
import { ProfilePreview } from "@/components/profile-preview"

interface ProfileEditorTabsProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

export function ProfileEditorTabs({ profile, updateProfile }: ProfileEditorTabsProps) {
  return (
    <Tabs defaultValue="basic" className="space-y-6">
      <TabsList className="grid grid-cols-3 sm:grid-cols-6">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="header">Header</TabsTrigger>
        <TabsTrigger value="theme">Theme</TabsTrigger>
        <TabsTrigger value="sections">Sections</TabsTrigger>
        <TabsTrigger value="social">Social</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <Card className="p-4 sm:p-6">
          <ProfileBasicInfo profile={profile} updateProfile={updateProfile} />
        </Card>
      </TabsContent>

      <TabsContent value="header">
        <Card className="p-4 sm:p-6">
          <ProfileHeaderEditor profile={profile} updateProfile={updateProfile} />
        </Card>
      </TabsContent>

      <TabsContent value="theme">
        <Card className="p-4 sm:p-6">
          <ThemeEditor profile={profile} updateProfile={updateProfile} />
        </Card>
      </TabsContent>

      <TabsContent value="sections">
        <Card className="p-4 sm:p-6">
          <ProfileSectionsEditor profile={profile} updateProfile={updateProfile} />
        </Card>
      </TabsContent>

      <TabsContent value="social">
        <Card className="p-4 sm:p-6">
          <ProfileSocialEditor profile={profile} updateProfile={updateProfile} />
        </Card>
      </TabsContent>

      <TabsContent value="preview">
        <Card className="p-4 sm:p-6">
          <ProfilePreview profile={profile} />
        </Card>
      </TabsContent>
    </Tabs>
  )
}

