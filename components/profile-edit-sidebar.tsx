"use client"

import { useEffect } from "react"
import { useProfile } from "@/components/profile-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, Plus, GripVertical, Trash2, ChevronRight } from "lucide-react"
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
import type { ProfileSection } from "@/lib/db"

interface SortableItemProps {
  section: ProfileSection
  isActive: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
}

function SortableItem({ section, isActive, onSelect, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center rounded-md p-2 text-sm",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted",
        isDragging && "bg-accent opacity-80",
      )}
      onClick={() => onSelect(section._id)}
    >
      <div {...attributes} {...listeners} className="mr-2 cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex-1 truncate">
        <span>{section.title || `Untitled ${section.type}`}</span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation()
          if (confirm("Are you sure you want to delete this section?")) {
            onRemove(section._id)
          }
        }}
      >
        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
    </div>
  )
}

export function ProfileEditSidebar() {
  const {
    profile,
    activeSection,
    setActiveSection,
    addSection,
    removeSection,
    moveSection,
    categories,
    setCategories,
  } = useProfile()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Fetch categories if needed
  useEffect(() => {
    if (categories.length === 0) {
      const fetchCategories = async () => {
        try {
          const response = await fetch("/api/categories")
          if (response.ok) {
            const data = await response.json()
            setCategories(data)
          }
        } catch (error) {
          console.error("Error fetching categories:", error)
        }
      }

      fetchCategories()
    }
  }, [categories.length, setCategories])

  const handleAddSection = () => {
    const newSection: ProfileSection = {
      _id: uuidv4(),
      type: "bio",
      title: "New Section",
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
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = profile.sections.findIndex((section: ProfileSection) => section._id === active.id)
      const newIndex = profile.sections.findIndex((section: ProfileSection) => section._id === over?.id)
      moveSection(oldIndex, newIndex)
    }
  }

  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        <Button variant="outline" className="w-full justify-start" onClick={() => setActiveSection("settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Profile Settings
        </Button>
      </div>

      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-sm font-medium">Sections</h3>
        <Button size="sm" variant="ghost" onClick={handleAddSection}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={profile.sections.map((section) => section._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="p-2 space-y-1">
              {profile.sections.map((section: ProfileSection) => (
                <SortableItem
                  key={section._id}
                  section={section}
                  isActive={activeSection === section._id}
                  onSelect={setActiveSection}
                  onRemove={removeSection}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-between" asChild>
          <a href={`/p/${profile.slug}`} target="_blank" rel="noopener noreferrer">
            View Live Profile
            <ChevronRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}

