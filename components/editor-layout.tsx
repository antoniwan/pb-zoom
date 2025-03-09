"use client"

import { ProfileEditHeader } from "@/components/profile-edit-header"
import { ProfileEditSidebar } from "@/components/profile-edit-sidebar"
import { ProfileEditContent } from "@/components/profile-edit-content"

export function EditorLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ProfileEditHeader />
      <div className="flex flex-1">
        <ProfileEditSidebar />
        <ProfileEditContent />
      </div>
    </div>
  )
}

