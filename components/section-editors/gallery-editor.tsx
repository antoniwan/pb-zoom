"use client"

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUploader } from "@/components/image-uploader"
import { GripVertical, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProfileSection, ProfileImage } from "@/lib/db"

interface GalleryEditorProps {
  content: ProfileSection["content"]
  onChange: (content: ProfileSection["content"]) => void
}

interface GalleryItemProps {
  image: ProfileImage
  onUpdate: (updates: Partial<ProfileImage>) => void
  onRemove: () => void
}

function GalleryItem({ image, onUpdate, onRemove }: GalleryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative p-4 border rounded-lg",
        isDragging && "opacity-50 bg-muted"
      )}
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
          <ImageUploader
            value={image.url}
            onChange={(url) => onUpdate({ url })}
            aspectRatio="square"
            maxSize={2}
          />

          <div className="space-y-2">
            <Label>Alt Text</Label>
            <Input
              value={image.altText}
              onChange={(e) => onUpdate({ altText: e.target.value })}
              placeholder="Describe the image"
            />
          </div>

          <div className="space-y-2">
            <Label>Caption</Label>
            <Input
              value={image.caption}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="Add a caption"
            />
          </div>
        </div>

        <Button
          variant="destructive"
          size="icon"
          onClick={onRemove}
          className="-mt-2 -mr-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function GalleryEditor({ content, onChange }: GalleryEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = content.images.findIndex((img) => img.id === active.id)
      const newIndex = content.images.findIndex((img) => img.id === over.id)

      const newImages = arrayMove(content.images, oldIndex, newIndex)
      onChange({ ...content, images: newImages })
    }
  }

  const handleAddImage = () => {
    const newImage: ProfileImage = {
      id: crypto.randomUUID(),
      url: "",
      altText: "",
      caption: "",
    }

    onChange({
      ...content,
      images: [...content.images, newImage],
    })
  }

  const handleUpdateImage = (id: string, updates: Partial<ProfileImage>) => {
    const newImages = content.images.map((img) =>
      img.id === id ? { ...img, ...updates } : img
    )
    onChange({ ...content, images: newImages })
  }

  const handleRemoveImage = (id: string) => {
    const newImages = content.images.filter((img) => img.id !== id)
    onChange({ ...content, images: newImages })
  }

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={content.images.map((img) => img.id)}>
          <div className="space-y-4">
            {content.images.map((image) => (
              <GalleryItem
                key={image.id}
                image={image}
                onUpdate={(updates) => handleUpdateImage(image.id, updates)}
                onRemove={() => handleRemoveImage(image.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button onClick={handleAddImage} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Image
      </Button>
    </div>
  )
} 