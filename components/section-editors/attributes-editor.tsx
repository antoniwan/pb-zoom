"use client"

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { GripVertical, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProfileSection, ProfileAttribute } from "@/lib/db"

interface AttributesEditorProps {
  content: ProfileSection["content"]
  onChange: (content: ProfileSection["content"]) => void
}

interface AttributeItemProps {
  attribute: ProfileAttribute
  onUpdate: (updates: Partial<ProfileAttribute>) => void
  onRemove: () => void
}

function AttributeItem({ attribute, onUpdate, onRemove }: AttributeItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: attribute._id })

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
            <Label>Name</Label>
            <Input
              value={attribute.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Skill or attribute name"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Rating</Label>
              <span className="text-sm text-muted-foreground">{attribute.value}%</span>
            </div>
            <Slider
              value={[attribute.value]}
              onValueChange={([value]) => onUpdate({ value })}
              min={0}
              max={100}
              step={5}
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

export function AttributesEditor({ content, onChange }: AttributesEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = content.attributes.findIndex((attr) => attr._id === active.id)
      const newIndex = content.attributes.findIndex((attr) => attr._id === over.id)

      const newAttributes = arrayMove(content.attributes, oldIndex, newIndex)
      onChange({ ...content, attributes: newAttributes })
    }
  }

  const handleAddAttribute = () => {
    const newAttribute: ProfileAttribute = {
      _id: crypto.randomUUID(),
      name: "",
      value: 50,
    }

    onChange({
      ...content,
      attributes: [...(content.attributes || []), newAttribute],
    })
  }

  const handleUpdateAttribute = (id: string, updates: Partial<ProfileAttribute>) => {
    const newAttributes = content.attributes.map((attr) => (attr._id === id ? { ...attr, ...updates } : attr))
    onChange({ ...content, attributes: newAttributes })
  }

  const handleRemoveAttribute = (id: string) => {
    const newAttributes = content.attributes.filter((attr) => attr._id !== id)
    onChange({ ...content, attributes: newAttributes })
  }

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={content.attributes?.map((attr) => attr._id) || []}>
          <div className="space-y-4">
            {content.attributes?.map((attribute) => (
              <AttributeItem
                key={attribute._id}
                attribute={attribute}
                onUpdate={(updates) => handleUpdateAttribute(attribute._id, updates)}
                onRemove={() => handleRemoveAttribute(attribute._id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button onClick={handleAddAttribute} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Attribute
      </Button>
    </div>
  )
}

