"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Profile, ProfileSection, ProfileAttribute } from "@/lib/db"
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  FileText,
  ListChecks,
  Image,
  Video,
  Code,
  PanelRight,
} from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface ProfileSectionsEditorProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

export function ProfileSectionsEditor({ profile, updateProfile }: ProfileSectionsEditorProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const handleTextChange = (sectionId: string, text: string) => {
    const section = profile.sections.find((s) => s._id === sectionId) as ProfileSection | undefined
    if (!section) return

    updateProfile({
      sections: profile.sections.map((section) =>
        section._id === sectionId ? { ...section, content: { ...section.content, text } } : section,
      ),
    })
  }

  const handleMarkdownChange = (sectionId: string, markdown: string) => {
    const section = profile.sections.find((s) => s._id === sectionId) as ProfileSection | undefined
    if (!section) return

    updateProfile({
      sections: profile.sections.map((section) =>
        section._id === sectionId ? { ...section, content: { ...section.content, markdown } } : section,
      ),
    })
  }

  const handleAddSection = (type: "bio" | "attributes" | "gallery" | "videos" | "markdown" | "custom") => {
    const newSection: ProfileSection = {
      _id: uuidv4(),
      type,
      title: getSectionDefaultTitle(type),
      content: {
        text: "",
        attributes: [],
        images: [],
        videos: [],
        markdown: "",
        html: "",
      },
      order: profile.sections.length,
    }
    updateProfile({
      sections: [...profile.sections, newSection],
    })
    setExpandedSection(newSection._id)
  }

  const getSectionDefaultTitle = (type: string): string => {
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

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "bio":
        return <FileText className="h-4 w-4" />
      case "attributes":
        return <ListChecks className="h-4 w-4" />
      case "gallery":
        return <Image className="h-4 w-4" />
      case "videos":
        return <Video className="h-4 w-4" />
      case "markdown":
        return <Code className="h-4 w-4" />
      case "custom":
        return <PanelRight className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleDeleteSection = (sectionId: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return

    updateProfile({
      sections: profile.sections.filter((section) => section._id !== sectionId),
    })
  }

  const handleSectionChange = (sectionId: string, updates: Partial<ProfileSection>) => {
    updateProfile({
      sections: profile.sections.map((section) => (section._id === sectionId ? { ...section, ...updates } : section)),
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
      value: "",
    }

    handleSectionChange(sectionId, {
      content: {
        ...section.content,
        text: section.content.text,
        attributes: [...section.content.attributes, newAttribute],
        images: section.content.images,
        videos: section.content.videos,
        markdown: section.content.markdown,
        html: section.content.html,
      },
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
        html: section.content.html,
      },
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
          index === attributeIndex ? { ...attr, ...updates } : attr,
        ),
        images: section.content.images,
        videos: section.content.videos,
        markdown: section.content.markdown,
        html: section.content.html,
      },
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
              className="resize-y min-h-[150px]"
            />
          </div>
        )

      case "attributes":
        return (
          <div className="space-y-4">
            {section.content.attributes?.map((attribute, index) => (
              <motion.div
                key={attribute._id || index}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="flex-shrink-0 text-muted-foreground">
                  <GripVertical className="h-5 w-5" />
                </div>
                <Input
                  value={attribute.label}
                  onChange={(e) => handleAttributeChange(section._id, index, { label: e.target.value })}
                  placeholder="Skill/Attribute"
                  className="flex-1"
                />
                <Input
                  value={attribute.value}
                  onChange={(e) => handleAttributeChange(section._id, index, { value: e.target.value })}
                  placeholder="Value/Level"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteAttribute(section._id, index)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
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
              className="font-mono resize-y min-h-[200px]"
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

  const sectionTypes = [
    { type: "bio", label: "Bio", icon: <FileText className="h-5 w-5 mb-2" /> },
    { type: "attributes", label: "Attributes", icon: <ListChecks className="h-5 w-5 mb-2" /> },
    { type: "gallery", label: "Gallery", icon: <Image className="h-5 w-5 mb-2" /> },
    { type: "videos", label: "Videos", icon: <Video className="h-5 w-5 mb-2" /> },
    { type: "markdown", label: "Markdown", icon: <Code className="h-5 w-5 mb-2" /> },
    { type: "custom", label: "Custom", icon: <PanelRight className="h-5 w-5 mb-2" /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Profile Sections</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sectionTypes.map((item) => (
              <DropdownMenuItem
                key={item.type}
                onClick={() => handleAddSection(item.type as any)}
                className="flex items-center gap-2 cursor-pointer"
              >
                {getSectionIcon(item.type)}
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        {profile.sections.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 rounded-full bg-muted p-3">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-medium">No sections yet</h3>
              <p className="mb-4 text-center text-muted-foreground">
                Add sections to your profile to showcase your content
              </p>
              <Button onClick={() => handleAddSection("bio")}>
                <Plus className="mr-2 h-4 w-4" /> Add First Section
              </Button>
            </CardContent>
          </Card>
        ) : (
          profile.sections.map((section, index) => (
            <motion.div
              key={section._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden group hover:shadow-md transition-all duration-200">
                <CardHeader className="p-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 cursor-grab">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          {getSectionIcon(section.type)}
                          <CardTitle className="text-base">
                            <Input
                              value={section.title}
                              onChange={(e) => handleSectionChange(section._id, { title: e.target.value })}
                              className="h-7 px-2 py-1 bg-transparent focus:bg-background"
                            />
                          </CardTitle>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {section.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveSection(section._id, "up")}
                        disabled={section.order === 0}
                        className="h-8 w-8"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveSection(section._id, "down")}
                        disabled={section.order === profile.sections.length - 1}
                        className="h-8 w-8"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setExpandedSection(expandedSection === section._id ? null : section._id)}
                        className="h-8 w-8"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expandedSection === section._id ? "rotate-180" : ""}`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSection(section._id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {expandedSection === section._id && (
                  <CardContent className="p-4 pt-4 border-t">{renderSectionEditor(section)}</CardContent>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {profile.sections.length > 0 && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-sm font-medium">Add More Sections</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            {sectionTypes.map((item) => (
              <Button
                key={item.type}
                variant="outline"
                className="h-auto flex-col p-4"
                onClick={() => handleAddSection(item.type as any)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

