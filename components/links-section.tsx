"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, GripVertical, ExternalLink } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { v4 as uuidv4 } from "uuid"

import type { ProfileSection, LinkItem } from "@/lib/db"

interface SortableLinkItemProps {
  link: LinkItem
  onRemove: (id: string) => void
  onChange: (id: string, field: string, value: string) => void
}

function SortableLinkItem({ link, onRemove, onChange }: SortableLinkItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Common social media platforms and their icons
  const socialPlatforms = [
    { value: "link", label: "Generic Link" },
    { value: "github", label: "GitHub" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "twitch", label: "Twitch" },
    { value: "dribbble", label: "Dribbble" },
    { value: "behance", label: "Behance" },
    { value: "medium", label: "Medium" },
    { value: "email", label: "Email" },
  ]

  return (
    <div ref={setNodeRef} style={style} className={`border rounded-md p-4 ${isDragging ? "bg-accent" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <Button variant="ghost" size="sm" onClick={() => onRemove(link.id)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`link-title-${link.id}`}>Title</Label>
            <Input
              id={`link-title-${link.id}`}
              value={link.title}
              onChange={(e) => onChange(link.id, "title", e.target.value)}
              placeholder="Link Title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`link-platform-${link.id}`}>Platform</Label>
            <Select value={link.icon || "link"} onValueChange={(value) => onChange(link.id, "icon", value)}>
              <SelectTrigger id={`link-platform-${link.id}`}>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {socialPlatforms.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`link-url-${link.id}`}>URL</Label>
            <Input
              id={`link-url-${link.id}`}
              value={link.url}
              onChange={(e) => onChange(link.id, "url", e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          {link.url && (
            <div className="pt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Test Link
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function LinksSection({ section }: { section: ProfileSection }) {
  const { updateSection } = useProfile()
  const [links, setLinks] = useState<LinkItem[]>(section.content?.links || [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    updateSection(section._id, {
      content: {
        ...section.content,
        links,
      },
    })
  }, [links, section._id, section.content, updateSection])

  const handleAddLink = () => {
    setLinks([
      ...links,
      {
        id: uuidv4(),
        title: "",
        url: "",
        icon: "link",
      },
    ])
  }

  const handleRemoveLink = (linkId: string) => {
    setLinks(links.filter((link) => link.id !== linkId))
  }

  const handleLinkChange = (linkId: string, field: string, value: string) => {
    setLinks(links.map((link) => (link.id === linkId ? { ...link, [field]: value } : link)))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id)
      const newIndex = links.findIndex((link) => link.id === over?.id)
      setLinks(arrayMove(links, oldIndex, newIndex))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Links</CardTitle>
        <CardDescription>Add links to your social media profiles or other websites</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={links.map((link) => link.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {links.map((link) => (
                <SortableLinkItem key={link.id} link={link} onRemove={handleRemoveLink} onChange={handleLinkChange} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <Button onClick={handleAddLink} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </CardContent>
    </Card>
  )
}

