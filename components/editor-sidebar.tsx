"use client"

import { useState } from "react"
import { useProfile } from "@/components/profile-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Settings,
  Layout,
  Palette,
  Type,
  Layers,
  Share,
  Plus,
  Trash2,
  GripVertical,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
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
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { v4 as uuidv4 } from "uuid"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"

import type { ProfileSection } from "@/lib/db"

interface SortableSectionItemProps {
  section: ProfileSection
  isActive: boolean
  onSelect: (id: string) => void
}

function SortableSectionItem({ section, isActive, onSelect }: SortableSectionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "bio":
        return <Type className="h-4 w-4" />
      case "attributes":
        return <Layers className="h-4 w-4" />
      case "gallery":
        return <Layout className="h-4 w-4" />
      case "videos":
        return <Layout className="h-4 w-4" />
      case "markdown":
        return <Type className="h-4 w-4" />
      case "custom":
        return <Settings className="h-4 w-4" />
      default:
        return <Layers className="h-4 w-4" />
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted",
        isDragging && "bg-accent opacity-80",
      )}
      onClick={() => onSelect(section._id)}
    >
      <div {...attributes} {...listeners} className="mr-2 cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="mr-2 text-muted-foreground">{getSectionIcon(section.type)}</div>

      <div className="flex-1 truncate">
        <span>{section.title || `Untitled ${section.type}`}</span>
      </div>
    </div>
  )
}

export function EditorSidebar() {
  const { profile, activeSection, setActiveSection, addSection, removeSection, moveSection } = useProfile()
  const [addSectionDialogOpen, setAddSectionDialogOpen] = useState(false)
  const [newSectionType, setNewSectionType] = useState<ProfileSection["type"]>("bio")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = profile.sections.findIndex((section) => section._id === active.id)
      const newIndex = profile.sections.findIndex((section) => section._id === over?.id)
      moveSection(oldIndex, newIndex)
    }
  }

  const handleAddSection = () => {
    const newSection: ProfileSection = {
      _id: uuidv4(),
      type: newSectionType,
      title: getDefaultTitle(newSectionType),
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

    addSection(newSection)
    setAddSectionDialogOpen(false)
    toast({
      title: "Section added",
      description: `New ${newSectionType} section has been added to your profile.`,
    })
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

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-4">
        <div className="text-sm font-medium">Profile Settings</div>

        <div className="space-y-1">
          <Button
            variant={activeSection === "basic" ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => setActiveSection("basic")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Basic Info
          </Button>

          <Button
            variant={activeSection === "header" ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => setActiveSection("header")}
          >
            <Type className="mr-2 h-4 w-4" />
            Header
          </Button>

          <Button
            variant={activeSection === "theme" ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => setActiveSection("theme")}
          >
            <Palette className="mr-2 h-4 w-4" />
            Theme
          </Button>

          <Button
            variant={activeSection === "social" ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => setActiveSection("social")}
          >
            <Share className="mr-2 h-4 w-4" />
            Social Links
          </Button>
        </div>
      </div>

      <div className="px-4 py-2 border-t border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">Sections</div>

          <Dialog open={addSectionDialogOpen} onOpenChange={setAddSectionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
                <DialogDescription>Choose the type of section you want to add to your profile.</DialogDescription>
              </DialogHeader>

              <RadioGroup
                value={newSectionType}
                onValueChange={(value) => setNewSectionType(value as ProfileSection["type"])}
                className="grid grid-cols-2 gap-4 py-4"
              >
                <div>
                  <RadioGroupItem value="bio" id="section-bio" className="peer sr-only" />
                  <Label
                    htmlFor="section-bio"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Type className="mb-3 h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Bio</div>
                      <div className="text-xs text-muted-foreground">Text about yourself</div>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="attributes" id="section-attributes" className="peer sr-only" />
                  <Label
                    htmlFor="section-attributes"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Layers className="mb-3 h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Attributes</div>
                      <div className="text-xs text-muted-foreground">Skills, traits, etc.</div>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="gallery" id="section-gallery" className="peer sr-only" />
                  <Label
                    htmlFor="section-gallery"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Layout className="mb-3 h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Gallery</div>
                      <div className="text-xs text-muted-foreground">Image collection</div>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="markdown" id="section-markdown" className="peer sr-only" />
                  <Label
                    htmlFor="section-markdown"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Type className="mb-3 h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">Markdown</div>
                      <div className="text-xs text-muted-foreground">Formatted text</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAddSectionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSection}>Add Section</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={profile.sections.map((section) => section._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1">
                {profile.sections.map((section) => (
                  <div key={section._id} className="group relative">
                    <SortableSectionItem
                      section={section}
                      isActive={activeSection === section._id}
                      onSelect={setActiveSection}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this section?")) {
                          removeSection(section._id)
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                ))}

                {profile.sections.length === 0 && (
                  <div className="text-center py-8 px-2">
                    <div className="text-sm text-muted-foreground mb-2">No sections yet</div>
                    <Button variant="outline" size="sm" onClick={() => setAddSectionDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Section
                    </Button>
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </ScrollArea>
      </div>

      <div className="p-4 mt-auto">
        <Button variant="outline" size="sm" className="w-full justify-between" asChild>
          <Link href={`/p/${profile.slug}`} target="_blank" rel="noopener noreferrer">
            <span className="flex items-center">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Live Profile
            </span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

