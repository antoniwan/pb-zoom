"use client"

import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { SectionItem } from "@/components/section-item"
import { AddSectionDialog } from "@/components/add-section-dialog"
import type { ProfileSection } from "@/lib/db"

export function SectionsEditor() {
  const { profile, updateProfile } = useProfile()

  if (!profile) return null

  const sections = profile.sections || []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = sections.findIndex((section) => section._id === active.id)
      const newIndex = sections.findIndex((section) => section._id === over.id)

      const updatedSections = arrayMove(sections, oldIndex, newIndex)
      updateProfile({ sections: updatedSections })
    }
  }

  const handleUpdateSection = (sectionId: string, updates: Partial<ProfileSection>) => {
    const updatedSections = sections.map((section) =>
      section._id === sectionId ? { ...section, ...updates } : section
    )
    updateProfile({ sections: updatedSections })
  }

  const handleRemoveSection = (sectionId: string) => {
    const updatedSections = sections.filter((section) => section._id !== sectionId)
    updateProfile({ sections: updatedSections })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Sections</CardTitle>
              <CardDescription>
                Add and arrange sections for your profile
              </CardDescription>
            </div>
            <AddSectionDialog />
          </div>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {sections.map((section) => (
                  <SectionItem
                    key={section._id}
                    section={section}
                    onUpdate={(updates) => handleUpdateSection(section._id, updates)}
                    onRemove={() => handleRemoveSection(section._id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  )
} 