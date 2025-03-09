"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileBasicInfo } from "@/components/profile-editor/basic-info"
import { ProfileHeaderEditor } from "@/components/profile-editor/header-editor"
import { ProfileThemeEditor } from "@/components/profile-editor/theme-editor"
import { ProfileSectionsEditor } from "@/components/profile-editor/sections-editor"
import { ProfileSocialEditor } from "@/components/profile-editor/social-editor"
import { ProfilePreview } from "@/components/profile-preview"
import type { Profile } from "@/lib/models"

interface ProfileEditorTabsProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

export function ProfileEditorTabs({ profile, updateProfile }: ProfileEditorTabsProps) {
  return (
    <Tabs defaultValue="basic">
      <TabsList className="mb-6 w-full overflow-x-auto flex-wrap">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="header">Header</TabsTrigger>
        <TabsTrigger value="theme">Theme</TabsTrigger>
        <TabsTrigger value="sections">Sections</TabsTrigger>
        <TabsTrigger value="social">Social Links</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <Card>
          <CardContent className="p-3 pt-4 sm:p-6 sm:pt-6">
            <ProfileBasicInfo profile={profile} updateProfile={updateProfile} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="header">
        <Card>
          <CardContent className="p-3 pt-4 sm:p-6 sm:pt-6">
            <ProfileHeaderEditor profile={profile} updateProfile={updateProfile} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="theme">
        <Card>
          <CardContent className="p-3 pt-4 sm:p-6 sm:pt-6">
            <ProfileThemeEditor profile={profile} updateProfile={updateProfile} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sections">
        <Card>
          <CardContent className="p-3 pt-4 sm:p-6 sm:pt-6">
            <ProfileSectionsEditor profile={profile} updateProfile={updateProfile} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="social">
        <Card>
          <CardContent className="p-3 pt-4 sm:p-6 sm:pt-6">
            <ProfileSocialEditor profile={profile} updateProfile={updateProfile} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preview">
        <Card>
          <CardContent className="p-3 pt-4 sm:p-6 sm:pt-6">
            <ProfilePreview profile={profile} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

