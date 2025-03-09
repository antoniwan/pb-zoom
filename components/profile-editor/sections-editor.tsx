"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Profile, ProfileSection, ProfileAttribute } from "@/lib/db"
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface ProfileSectionsEditorProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

export function ProfileSectionsEditor({ profile, updateProfile }: ProfileSectionsEditorProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const handleTextChange = (sectionId: string, text: string) => {
    const section = profile.sections.find(s => s._id === sectionId) as ProfileSection | undefined
    if (!section) return

    updateProfile({
      sections: profile.sections.map((section) =>
        section._id === sectionId ? { ...section, content: { ...section.content, text } } : section
      ),
    })
  }

  const handleMarkdownChange = (sectionId: string, markdown: string) => {
    const section = profile.sections.find(s => s._id === sectionId) as ProfileSection | undefined
    if (!section) return

    updateProfile({
      sections: profile.sections.map((section) =>
        section._id === sectionId ? { ...section, content: { ...section.content, markdown } } : section
      ),
    })
  }

  const handleAddSection = (type: "bio" | "attributes" | "gallery" | "videos" | "markdown" | "custom") => {
    const newSection: ProfileSection = {
      _id: uuidv4(),
      type,
      title: "New Section",
      content: {
        text: "",
        attributes: [],
        images: [],
        videos: [],
        markdown: "",
        html: ""
      },
      order: profile.sections.length
    }
    updateProfile({
      sections: [...profile.sections, newSection],
    })
    setExpandedSection(newSection._id)
  }

  const handleDeleteSection = (sectionId: string) => {
    updateProfile({
      sections: profile.sections.filter((section) => section._id !== sectionId),
    })
  }

  const handleSectionChange = (sectionId: string, updates: Partial<ProfileSection>) => {
    updateProfile({
      sections: profile.sections.map((section) =>
        section._id === sectionId ? { ...section, ...updates } : section,
      ),
    })
  }

  const handleMoveSection = (sectionId: string, direction: "up" | "down") => {
    const sectionIndex = profile.sections.findIndex((section) => section._id === sectionId)
    if (sectionIndex === -1) return
    if (direction === "up" && sectionIndex === 0) return
    if (direction === "down" && sectionIndex === profile.sections.length - 1) return

    const newSections = [...profile.sections]
    const targetIndex = direction === "up" ? sectionIndex - 1 : sectionIndex + 1
    const temp = newSections[targetIndex]
    newSections[targetIndex] = { ...newSections[sectionIndex], order: targetIndex }
    newSections[sectionIndex] = { ...temp, order: sectionIndex }

    // Update order values
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }))

    updateProfile({
      sections: updatedSections,
    })
  }

  const handleAddAttribute = (sectionId: string) => {
    const section = profile.sections.find((section) => section._id === sectionId) as ProfileSection | undefined
    if (!section) return

    const newAttribute: ProfileAttribute = {
      _id: uuidv4(),
      label: "",
      value: ""
    }

    handleSectionChange(sectionId, {
      content: {
        ...section.content,
        text: section.content.text,
        attributes: [...section.content.attributes, newAttribute],
        images: section.content.images,
        videos: section.content.videos,
        markdown: section.content.markdown,
        html: section.content.html
      }
    })
  }

  const handleDeleteAttribute = (sectionId: string, attributeIndex: number) => {
    const section = profile.sections.find((section) => section._id === sectionId) as ProfileSection | undefined
    if (!section) return

    handleSectionChange(sectionId, {
      content: {
        ...section.content,
        text: section.content.text,
        attributes: section.content.attributes.filter((_, index) => index !== attributeIndex),
        images: section.content.images,
        videos: section.content.videos,
        markdown: section.content.markdown,
        html: section.content.html
      }
    })
  }

  const handleAttributeChange = (sectionId: string, attributeIndex: number, updates: Partial<ProfileAttribute>) => {
    const section = profile.sections.find((section) => section._id === sectionId) as ProfileSection | undefined
    if (!section) return

    handleSectionChange(sectionId, {
      content: {
        ...section.content,
        text: section.content.text,
        attributes: section.content.attributes.map((attr, index) => 
          index === attributeIndex ? { ...attr, ...updates } : attr
        ),
        images: section.content.images,
        videos: section.content.videos,
        markdown: section.content.markdown,
        html: section.content.html
      }
    })
  }

  const renderSectionEditor = (section: ProfileSection) => {
    switch (section.type) {
      case "bio":
        return (
          <div className="space-y-2">
            <Label htmlFor={`section-${section._id}-content`}>Bio Content</Label>
            <Textarea
              id={`section-${section._id}-content`}
              value={section.content.text || ""}
              onChange={(e) => handleTextChange(section._id, e.target.value)}
              rows={6}
              placeholder="Enter your bio..."
            />
          </div>
        )

      case "attributes":
        return (
          <div className="space-y-4">
            {section.content.attributes?.map((attribute, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={attribute.label}
                  onChange={(e) => handleAttributeChange(section._id, index, { label: e.target.value })}
                  placeholder="Skill/Attribute"
                />
                <Input
                  value={attribute.value}
                  onChange={(e) => handleAttributeChange(section._id, index, { value: e.target.value })}
                  placeholder="Value/Level"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAttribute(section._id, index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => handleAddAttribute(section._id)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Attribute
            </Button>
          </div>
        )

      case "markdown":
        return (
          <div className="space-y-2">
            <Label htmlFor={`section-${section._id}-markdown`}>Markdown Content</Label>
            <Textarea
              id={`section-${section._id}-markdown`}
              value={section.content.markdown || ""}
              onChange={(e) => handleMarkdownChange(section._id, e.target.value)}
              className="font-mono"
              rows={10}
              placeholder="Enter markdown content..."
            />
            <p className="text-sm text-muted-foreground">
              Use Markdown to format your content. Supports headings, lists, links, and more.
            </p>
          </div>
        )

      default:
        return <div className="p-4 text-center text-muted-foreground">Editor not available for this section type.</div>
    }
  }

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
                      onChange={(e) => handleSectionChange(section._id, { title: e.target.value })}
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
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteSection(section._id)}>
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
          <Button variant="outline" className="h-auto flex-col p-4" onClick={() => handleAddSection("bio")}>
            <span className="mb-2">Bio</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col p-4" onClick={() => handleAddSection("attributes")}>
            <span className="mb-2">Attributes</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col p-4" onClick={() => handleAddSection("gallery")}>
            <span className="mb-2">Gallery</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col p-4" onClick={() => handleAddSection("videos")}>
            <span className="mb-2">Videos</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col p-4" onClick={() => handleAddSection("markdown")}>
            <span className="mb-2">Markdown</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col p-4" onClick={() => handleAddSection("custom")}>
            <span className="mb-2">Custom</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

