"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GripVertical, Trash2, ChevronDown, ChevronUp, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useProfile } from "@/components/profile-context"
import type { ProfileSection } from "@/lib/db"

// Import section editors
import { MarkdownEditor } from "@/components/section-editors/markdown-editor"
import { GalleryEditor } from "@/components/section-editors/gallery-editor"
import { LinksEditor } from "@/components/section-editors/links-editor"
import { AttributesEditor } from "@/components/section-editors/attributes-editor"
import { CustomEditor } from "@/components/section-editors/custom-editor"

interface SectionItemProps {
  section: ProfileSection
  onUpdate: (updates: Partial<ProfileSection>) => void
  onRemove: () => void
}

export function SectionItem({ section, onUpdate, onRemove }: SectionItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [localTitle, setLocalTitle] = useState(section.title)
  const { saveProfile, isSaving } = useProfile()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Update local title when section title changes
  useEffect(() => {
    setLocalTitle(section.title)
  }, [section.title])

  // Handle title change with debounce
  useEffect(() => {
    if (localTitle === section.title) return

    const timer = setTimeout(() => {
      onUpdate({ title: localTitle })
    }, 500)

    return () => clearTimeout(timer)
  }, [localTitle, section.title, onUpdate])

  const handleSave = async () => {
    await saveProfile()
  }

  const renderEditor = () => {
    switch (section.type) {
      case "markdown":
        return <MarkdownEditor content={section.content} onChange={(content) => onUpdate({ content })} />
      case "gallery":
        return <GalleryEditor content={section.content} onChange={(content) => onUpdate({ content })} />
      case "links":
        return <LinksEditor content={section.content} onChange={(content) => onUpdate({ content })} />
      case "attributes":
        return <AttributesEditor content={section.content} onChange={(content) => onUpdate({ content })} />
      case "custom":
        return <CustomEditor content={section.content} onChange={(content) => onUpdate({ content })} />
      default:
        return null
    }
  }

  return (
    <div ref={setNodeRef} style={style} className={cn("relative", isDragging && "z-50")}>
      <Card className={cn("flex flex-col", isDragging && "opacity-50 bg-muted")}>
        <div className="p-4 flex items-start gap-4">
          <button
            {...attributes}
            {...listeners}
            className="p-2 -mt-2 -ml-2 rounded-md hover:bg-muted cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="flex-1 space-y-2">
            <Label>Title</Label>
            <Input value={localTitle} onChange={(e) => setLocalTitle(e.target.value)} placeholder="Section Title" />
          </div>

          <div className="flex items-start gap-2 -mt-2 -mr-2">
            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button variant="destructive" size="icon" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <>
            <div className="px-4 pb-4 pt-2 border-t">{renderEditor()}</div>
            <div className="px-4 pb-4 flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

