"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Profile, ProfileSection, ProfileAttribute, ProfileImage, ProfileVideo } from "@/lib/db"
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface SectionContent {
  text?: string
  attributes?: ProfileAttribute[]
  images?: ProfileImage[]
  videos?: ProfileVideo[]
  markdown?: string
  html?: string
}

interface ProfileSectionsEditorProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

export function ProfileSectionsEditor({ profile, updateProfile }: ProfileSectionsEditorProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const handleAddSection = (type: ProfileSection["type"]) => {
    const newSection: ProfileSection = {
      _id: uuidv4(), // Ensure this is always set
      type,
      title: getDefaultTitle(type),
      content: getDefaultContent(type),
      order: profile.sections.length,
    }

    const updatedSections = [...profile.sections, newSection]
    updateProfile({ sections: updatedSections })
    setExpandedSection(newSection._id)
  }

  const ensureSectionIds = (sections: ProfileSection[]): ProfileSection[] => {
    return sections.map((section) => {
      if (!section._id) {
        return {
          ...section,
          _id: uuidv4(),
        }
      }
      return section
    })
  }

  const handleRemoveSection = (id: string) => {
    const updatedSections = profile.sections.filter((section) => section._id !== id)
    updateProfile({ sections: updatedSections })
  }

  const handleSectionChange = (sectionIndex: number, key: keyof ProfileSection, value: string | SectionContent) => {
    const updatedSections = [...profile.sections]
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      [key]: value,
    }
    updateProfile({ sections: ensureSectionIds(updatedSections) })
  }

  const handleTextChange = (sectionIndex: number, text: string) => {
    handleContentChange(sectionIndex, { text })
  }

  const handleMarkdownChange = (sectionIndex: number, markdown: string) => {
    handleContentChange(sectionIndex, { markdown })
  }

  const handleContentChange = (sectionIndex: number, content: Partial<SectionContent>) => {
    const updatedSections = [...profile.sections]
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      content: {
        ...updatedSections[sectionIndex].content,
        ...content,
      },
    }
    updateProfile({ sections: ensureSectionIds(updatedSections) })
  }

  const handleAttributeChange = (
    sectionIndex: number,
    attributeIndex: number,
    key: keyof Omit<ProfileAttribute, "_id">,
    value: string,
  ) => {
    const section = profile.sections[sectionIndex]
    const attributes = [...(section.content.attributes || [])]
    attributes[attributeIndex] = {
      ...attributes[attributeIndex],
      [key]: value,
    }
    handleContentChange(sectionIndex, { attributes })
  }

  const addAttribute = (sectionIndex: number) => {
    const section = profile.sections[sectionIndex]
    const attributes = [
      ...(section.content.attributes || []),
      {
        _id: uuidv4(),
        label: "New Skill",
        value: "Beginner",
      },
    ]
    handleContentChange(sectionIndex, { attributes })
  }

  const removeAttribute = (sectionIndex: number, attributeIndex: number) => {
    const section = profile.sections[sectionIndex]
    const attributes = (section.content.attributes || []).filter((_, i) => i !== attributeIndex)
    handleContentChange(sectionIndex, { attributes })
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

    updateProfile({ sections: ensureSectionIds(updatedSections) })
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

  const getDefaultContent = (type: ProfileSection["type"]): ProfileSection["content"] => {
    const defaultContent = {
      text: "",
      attributes: [],
      images: [],
      videos: [],
      markdown: "",
      html: "",
    }

    switch (type) {
      case "bio":
        return {
          ...defaultContent,
          text: "Write something about yourself...",
        }
      case "attributes":
        return {
          ...defaultContent,
          attributes: [
            {
              _id: uuidv4(),
              label: "Skill",
              value: "Expert",
            },
          ],
        }
      case "gallery":
        return defaultContent
      case "videos":
        return defaultContent
      case "markdown":
        return {
          ...defaultContent,
          markdown: "## Hello World\n\nThis is a markdown section.",
        }
      case "custom":
        return {
          ...defaultContent,
          html: "<div>Custom HTML content</div>",
        }
      default:
        return defaultContent
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
                value={section.content.text || ""}
                onChange={(e) => handleTextChange(profile.sections.indexOf(section), e.target.value)}
                rows={6}
                placeholder="Enter your bio..."
              />
            </div>
          </div>
        )

      case "attributes":
        return (
          <div className="space-y-4">
            {section.content.attributes?.map((attribute, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={attribute.label}
                  onChange={(e) =>
                    handleAttributeChange(profile.sections.indexOf(section), index, "label", e.target.value)
                  }
                  placeholder="Skill/Attribute"
                />
                <Input
                  value={attribute.value}
                  onChange={(e) =>
                    handleAttributeChange(profile.sections.indexOf(section), index, "value", e.target.value)
                  }
                  placeholder="Value/Level"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttribute(profile.sections.indexOf(section), index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addAttribute(profile.sections.indexOf(section))}>
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
              onChange={(e) => handleMarkdownChange(profile.sections.indexOf(section), e.target.value)}
              className="font-mono"
              rows={10}
              placeholder="Enter markdown content..."
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
                      onChange={(e) => handleSectionChange(profile.sections.indexOf(section), "title", e.target.value)}
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

