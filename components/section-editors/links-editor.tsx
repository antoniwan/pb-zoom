"use client"

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GripVertical, Trash2, Plus, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProfileSection, LinkItem } from "@/lib/db"

interface LinksEditorProps {
  content: ProfileSection["content"]
  onChange: (content: ProfileSection["content"]) => void
}

interface LinkItemProps {
  link: LinkItem
  onUpdate: (updates: Partial<LinkItem>) => void
  onRemove: () => void
}

function LinkItemEditor({ link, onUpdate, onRemove }: LinkItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("relative p-4 border rounded-lg", isDragging && "opacity-50 bg-muted")}
    >
      <div className="flex items-start gap-4">
        <button
          {...attributes}
          {...listeners}
          className="p-2 -mt-2 -ml-2 rounded-md hover:bg-muted cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={link.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Link Title" />
          </div>

          <div className="space-y-2">
            <Label>URL</Label>
            <div className="flex gap-2">
              <Input value={link.url} onChange={(e) => onUpdate({ url: e.target.value })} placeholder="https://" />
              {link.url && (
                <Button variant="outline" size="icon" onClick={() => window.open(link.url, "_blank")}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={link.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Describe the link"
            />
          </div>
        </div>

        <Button variant="destructive" size="icon" onClick={onRemove} className="-mt-2 -mr-2">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function LinksEditor({ content, onChange }: LinksEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = content.links.findIndex((link) => link._id === active.id)
      const newIndex = content.links.findIndex((link) => link._id === over.id)

      const newLinks = arrayMove(content.links, oldIndex, newIndex)
      onChange({ ...content, links: newLinks })
    }
  }

  const handleAddLink = () => {
    const newLink: LinkItem = {
      _id: crypto.randomUUID(),
      title: "",
      url: "",
      description: "",
    }

    onChange({
      ...content,
      links: [...(content.links || []), newLink],
    })
  }

  const handleUpdateLink = (id: string, updates: Partial<LinkItem>) => {
    const newLinks = content.links.map((link) => (link._id === id ? { ...link, ...updates } : link))
    onChange({ ...content, links: newLinks })
  }

  const handleRemoveLink = (id: string) => {
    const newLinks = content.links.filter((link) => link._id !== id)
    onChange({ ...content, links: newLinks })
  }

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={content.links?.map((link) => link._id) || []}>
          <div className="space-y-4">
            {content.links?.map((link) => (
              <LinkItemEditor
                key={link._id}
                link={link}
                onUpdate={(updates) => handleUpdateLink(link._id, updates)}
                onRemove={() => handleRemoveLink(link._id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button onClick={handleAddLink} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Link
      </Button>
    </div>
  )
}

