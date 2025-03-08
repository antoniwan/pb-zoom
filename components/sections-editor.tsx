"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Profile, ProfileSection } from "@/lib/models"
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface ProfileSectionsEditorProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

export function ProfileSectionsEditor({ profile, updateProfile }: ProfileSectionsEditorProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const handleAddSection = (type: ProfileSection["type"]) => {
    const newSection: ProfileSection = {
      _id: uuidv4(),
      type,
      title: getDefaultTitle(type),
      content: getDefaultContent(type),
      order: profile.sections.length,
    }

    const updatedSections = [...profile.sections, newSection]
    updateProfile({ sections: updatedSections })
    setExpandedSection(newSection._id)
  }

  const handleRemoveSection = (id: string) => {
    const updatedSections = profile.sections.filter((section) => section._id !== id)
    updateProfile({ sections: updatedSections })
  }

  const handleUpdateSection = (id: string, updates: Partial<ProfileSection>) => {
    const updatedSections = profile.sections.map((section) =>
      section._id === id ? { ...section, ...updates } : section,
    )
    updateProfile({ sections: updatedSections })
  }

  const handleMoveSection = (id: string, direction: "up" | "down") => {
    const sectionIndex = profile.sections.findIndex((section) => section._id === id)

    if (
      (direction === "up" && sectionIndex === 0) ||
      (direction === "down" && sectionIndex === profile.sections.length - 1)
    ) {
      return
    }

    const newIndex = direction === "up" ? sectionIndex - 1 : sectionIndex + 1
    const updatedSections = [...profile.sections]

    // Swap the sections
    const temp = updatedSections[sectionIndex]
    updatedSections[sectionIndex] = updatedSections[newIndex]
    updatedSections[newIndex] = temp

    // Update order property
    updatedSections.forEach((section, index) => {
      section.order = index
    })

    updateProfile({ sections: updatedSections })
  }

  const getDefaultTitle = (type: ProfileSection["type"]): string => {
    switch (type) {
      case "bio":
        return "About Me"
      case "attributes":
        return "Skills & Attributes"
      case "gallery":
        return "Gallery"
      case "videos":
        return "Videos"
      case "markdown":
        return "Custom Content"
      case "custom":
        return "Custom Section"
      default:
        return "New Section"
    }
  }

  const getDefaultContent = (type: ProfileSection["type"]) => {
    switch (type) {
      case "bio":
        return { text: "Write something about yourself..." }
      case "attributes":
        return { items: [{ label: "Skill", value: "Expert" }] }
      case "gallery":
        return { images: [] }
      case "videos":
        return { videos: [] }
      case "markdown":
        return { markdown: "## Hello World\n\nThis is a markdown section." }
      case "custom":
        return { html: "<div>Custom HTML content</div>" }
      default:
        return {}
    }
  }

  const renderSectionEditor = (section: ProfileSection) => {
    switch (section.type) {
      case "bio":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`section-${section._id}-content`}>Bio Text</Label>
              <Textarea
                id={`section-${section._id}-content`}
                value={section.content.text}
                onChange={(e) =>
                  handleUpdateSection(section._id, {
                    content: { ...section.content, text: e.target.value },
                  })
                }
                rows={6}
              />
            </div>
          </div>
        )

      case "attributes":
        return (
          <div className="space-y-4">
            {section.content.items.map((item: any, index: number) => (
              <div key={`attribute-${section._id}-${index}`} className="flex items-center space-x-2">
                <Input
                  value={item.label}
                  onChange={(e) => {
                    const updatedItems = [...section.content.items]
                    updatedItems[index] = { ...item, label: e.target.value }
                    handleUpdateSection(section._id, {
                      content: { ...section.content, items: updatedItems },
                    })
                  }}
                  placeholder="Skill/Attribute"
                />
                <Input
                  value={item.value}
                  onChange={(e) => {
                    const updatedItems = [...section.content.items]
                    updatedItems[index] = { ...item, value: e.target.value }
                    handleUpdateSection(section._id, {
                      content: { ...section.content, items: updatedItems },
                    })
                  }}
                  placeholder="Value/Level"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const updatedItems = section.content.items.filter((_: any, i: number) => i !== index)
                    handleUpdateSection(section._id, {
                      content: { ...section.content, items: updatedItems },
                    })
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const updatedItems = [...section.content.items, { label: "New Skill", value: "Beginner" }]
                handleUpdateSection(section._id, {
                  content: { ...section.content, items: updatedItems },
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Attribute
            </Button>
          </div>
        )

      case "markdown":
        return (
          <div className="space-y-2">
            <Label htmlFor={`section-${section._id}-markdown`}>Markdown Content</Label>
            <Textarea
              id={`section-${section._id}-markdown`}
              value={section.content.markdown}
              onChange={(e) =>
                handleUpdateSection(section._id, {
                  content: { ...section.content, markdown: e.target.value },
                })
              }
              className="font-mono"
              rows={10}
            />
            <p className="text-sm text-muted-foreground">
              Use Markdown to format your content. Supports headings, lists, links, and more.
            </p>
          </div>
        )

      // Add more section type editors as needed

      default:
        return <div className="p-4 text-center text-muted-foreground">Editor not available for this section type.</div>
    }
  }

  // Define section types with their labels for the "Add New Section" buttons
  const sectionTypes = [
    { type: "bio" as const, label: "Bio" },
    { type: "attributes" as const, label: "Attributes" },
    { type: "gallery" as const, label: "Gallery" },
    { type: "videos" as const, label: "Videos" },
    { type: "markdown" as const, label: "Markdown" },
    { type: "custom" as const, label: "Custom" },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {profile.sections.map((section) => (
          <Card key={section._id}>
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">
                    <Input
                      value={section.title}
                      onChange={(e) => handleUpdateSection(section._id, { title: e.target.value })}
                      className="h-7 px-2 py-1"
                    />
                  </CardTitle>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">{section.type}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveSection(section._id, "up")}
                    disabled={section.order === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveSection(section._id, "down")}
                    disabled={section.order === profile.sections.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setExpandedSection(expandedSection === section._id ? null : section._id)}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${expandedSection === section._id ? "rotate-180" : ""}`}
                    />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveSection(section._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {expandedSection === section._id && (
              <CardContent className="p-4 pt-0">{renderSectionEditor(section)}</CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-sm font-medium">Add New Section</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {sectionTypes.map((sectionType) => (
            <Button
              key={`add-section-${sectionType.type}`}
              variant="outline"
              className="h-auto flex-col p-4"
              onClick={() => handleAddSection(sectionType.type)}
            >
              <span className="mb-2">{sectionType.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

