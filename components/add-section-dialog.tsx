"use client"

import { useState } from "react"
import { useProfile } from "@/components/profile-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProfileSection } from "@/lib/db"

const sectionTypes = [
  {
    id: "markdown" as const,
    name: "Text",
    description: "Add a text block with rich formatting",
    icon: "📝",
    defaultContent: {
      text: "",
      attributes: [],
      images: [],
      videos: [],
      markdown: "",
      html: "",
    },
  },
  {
    id: "gallery" as const,
    name: "Gallery",
    description: "Display a collection of images",
    icon: "🖼️",
    defaultContent: {
      text: "",
      attributes: [],
      images: [],
      videos: [],
      markdown: "",
      html: "",
    },
  },
  {
    id: "links" as const,
    name: "Links",
    description: "Add a collection of links",
    icon: "🔗",
    defaultContent: {
      text: "",
      attributes: [],
      images: [],
      videos: [],
      markdown: "",
      html: "",
      links: [],
    },
  },
  {
    id: "attributes" as const,
    name: "Skills",
    description: "List your skills with ratings",
    icon: "⭐",
    defaultContent: {
      text: "",
      attributes: [],
      images: [],
      videos: [],
      markdown: "",
      html: "",
    },
  },
  {
    id: "custom" as const,
    name: "Custom",
    description: "Create a custom section with HTML",
    icon: "🎨",
    defaultContent: {
      text: "",
      attributes: [],
      images: [],
      videos: [],
      markdown: "",
      html: "",
      customCSS: "",
    },
  },
]

export function AddSectionDialog() {
  const { profile, updateProfile } = useProfile()
  const [isOpen, setIsOpen] = useState(false)

  if (!profile) return null

  const handleAddSection = (type: typeof sectionTypes[number]["id"]) => {
    const sections = profile.sections || []
    const maxOrder = sections.length > 0
      ? Math.max(...sections.map(s => s.order))
      : -1

    const sectionType = sectionTypes.find(t => t.id === type)
    if (!sectionType) return

    const newSection: ProfileSection = {
      _id: crypto.randomUUID(),
      type,
      title: `New ${sectionType.name} Section`,
      content: sectionType.defaultContent,
      order: maxOrder + 1,
    }

    const updatedSections = [...sections, newSection]
    updateProfile({ sections: updatedSections })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
          <DialogDescription>
            Choose a section type to add to your profile
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {sectionTypes.map((type) => (
            <button
              key={type.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg text-left",
                "hover:bg-accent hover:text-accent-foreground",
                "transition-colors"
              )}
              onClick={() => handleAddSection(type.id)}
            >
              <div className="text-2xl">{type.icon}</div>
              <div>
                <h3 className="font-medium">{type.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 