"use client"

import { useProfile } from "@/components/profile-context"
import { ProfileSettings } from "@/components/profile-settings"
import { SectionEditor } from "@/components/section-editor"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ProfileEditContent() {
  const { profile, activeSection } = useProfile()

  const currentSection = profile.sections.find((section) => section._id === activeSection)

  return (
    <ScrollArea className="flex-1 p-6">
      {activeSection === "settings" ? (
        <ProfileSettings />
      ) : currentSection ? (
        <SectionEditor section={currentSection} />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Select a section to edit or create a new one
        </div>
      )}
    </ScrollArea>
  )
}

