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

// Add React.memo to optimize re-renders
import { memo } from "react"

// Wrap the ProfileBasicInfo component with memo
const MemoizedProfileBasicInfo = memo(ProfileBasicInfo)
const MemoizedProfileHeaderEditor = memo(ProfileHeaderEditor)
const MemoizedProfileThemeEditor = memo(ProfileThemeEditor)
const MemoizedProfileSectionsEditor = memo(ProfileSectionsEditor)
const MemoizedProfileSocialEditor = memo(ProfileSocialEditor)
const MemoizedProfilePreview = memo(ProfilePreview)

interface ProfileEditorTabsProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

export function ProfileEditorTabs({ profile, updateProfile }: ProfileEditorTabsProps) {
  return (
    <Tabs defaultValue="basic">
      <TabsList className="mb-6">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="header">Header</TabsTrigger>
        <TabsTrigger value="theme">Theme</TabsTrigger>
        <TabsTrigger value="sections">Sections</TabsTrigger>
        <TabsTrigger value="social">Social Links</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <Card>
          <CardContent className="pt-6">
            <MemoizedProfileBasicInfo profile={profile} updateProfile={updateProfile} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="header">
        <Card>
          <CardContent className="pt-6">
            <MemoizedProfileHeaderEditor profile={profile} updateProfile={updateProfile} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="theme">
        <Card>
          <CardContent className="pt-6">
            <MemoizedProfileThemeEditor profile={profile} updateProfile={updateProfile} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sections">
        <Card>
          <CardContent className="pt-6">
            <MemoizedProfileSectionsEditor profile={profile} updateProfile={updateProfile} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="social">
        <Card>
          <CardContent className="pt-6">
            <MemoizedProfileSocialEditor profile={profile} updateProfile={updateProfile} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preview">
        <Card>
          <CardContent className="pt-6">
            <MemoizedProfilePreview profile={profile} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

