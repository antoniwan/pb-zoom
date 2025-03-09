"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, GripVertical, Upload, Loader2 } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"
import { v4 as uuidv4 } from "uuid"

import type { ProfileSection } from "@/lib/db"

interface GalleryItem {
  id: string
  url: string
  altText?: string
  caption?: string
}

interface SortableGalleryItemProps {
  item: GalleryItem
  onRemove: (id: string) => void
  onChange: (id: string, field: string, value: string) => void
  onUpload: (id: string, file: File) => void
  isUploading: boolean
}

function SortableGalleryItem({ item, onRemove, onChange, onUpload, isUploading }: SortableGalleryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-md p-4 ${isDragging ? "bg-accent" : ""}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          {item.url ? (
            <div className="relative aspect-video mb-2 bg-muted rounded-md overflow-hidden">
              <Image
                src={item.url || "/placeholder.svg"}
                alt={item.altText || "Gallery image"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="relative aspect-video mb-2 bg-muted rounded-md flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Upload an image</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              id={`gallery-upload-${item.id}`}
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onUpload(item.id, e.target.files[0])
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                document.getElementById(`gallery-upload-${item.id}`)?.click()
              }}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {item.url ? "Replace" : "Upload"}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`gallery-url-${item.id}`}>Image URL</Label>
            <Input
              id={`gallery-url-${item.id}`}
              value={item.url}
              onChange={(e) => onChange(item.id, "url", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`gallery-alt-${item.id}`}>Alt Text</Label>
            <Input
              id={`gallery-alt-${item.id}`}
              value={item.altText || ""}
              onChange={(e) => onChange(item.id, "altText", e.target.value)}
              placeholder="Descriptive text for the image"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`gallery-caption-${item.id}`}>Caption</Label>
            <Textarea
              id={`gallery-caption-${item.id}`}
              value={item.caption || ""}
              onChange={(e) => onChange(item.id, "caption", e.target.value)}
              placeholder="Optional caption for the image"
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function GallerySection({ section }: { section: ProfileSection }) {
  const { updateSection } = useProfile()
  const [items, setItems] = useState<GalleryItem[]>(() => 
    (section.content?.images || []).map(img => ({
      id: uuidv4(), // Generate a unique ID for each image
      url: img.url,
      altText: img.altText || "",
      caption: "",
    }))
  )
  const [isUploading, setIsUploading] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    updateSection(section._id, {
      content: {
        ...section.content,
        images: items.map(item => ({
          _id: item.id,
          url: item.url,
          altText: item.altText || "",
          isPrimary: false,
        })),
      },
    })
  }, [items, section._id, section.content, updateSection])

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: uuidv4(),
        url: "",
        altText: "",
        caption: "",
      },
    ])
  }

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const handleItemChange = (itemId: string, field: string, value: string) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over?.id)
      setItems(arrayMove(items, oldIndex, newIndex))
    }
  }

  const handleFileUpload = async (itemId: string, file: File) => {
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      handleItemChange(itemId, "url", data.url)
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery</CardTitle>
        <CardDescription>Add and arrange images for this section</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {items.map((item) => (
                <SortableGalleryItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onChange={handleItemChange}
                  onUpload={handleFileUpload}
                  isUploading={isUploading}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <Button onClick={handleAddItem} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Image
        </Button>
      </CardContent>
    </Card>
  )
}

