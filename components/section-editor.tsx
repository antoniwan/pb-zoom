"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Trash2,
  ImageIcon,
  Link,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Loader2,
} from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { toast } from "@/hooks/use-toast"

import type { ProfileSection, ProfileAttribute } from "@/lib/db"

export function SectionEditor({ section }: { section: ProfileSection }) {
  const { updateSection } = useProfile()
  const [title, setTitle] = useState(section.title)
  const [isVisible, setIsVisible] = useState(section.isVisible !== false)
  const [activeTab, setActiveTab] = useState("content")
  const [isUploading, setIsUploading] = useState(false)

  // Update section title with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      updateSection(section._id, { title })
    }, 500)
    return () => clearTimeout(timer)
  }, [title, section._id, updateSection])

  // Update visibility immediately
  useEffect(() => {
    updateSection(section._id, { isVisible })
  }, [isVisible, section._id, updateSection])

  const handleTextChange = (text: string) => {
    updateSection(section._id, {
      content: {
        ...section.content,
        text,
      },
    })
  }

  const handleMarkdownChange = (markdown: string) => {
    updateSection(section._id, {
      content: {
        ...section.content,
        markdown,
      },
    })
  }

  const handleAddAttribute = () => {
    const newAttribute: ProfileAttribute = {
      _id: uuidv4(),
      label: "New Skill",
      value: "Beginner",
    }

    updateSection(section._id, {
      content: {
        ...section.content,
        attributes: [...(section.content.attributes || []), newAttribute],
      },
    })
  }

  const handleUpdateAttribute = (index: number, field: "label" | "value", value: string) => {
    const attributes = [...(section.content.attributes || [])]
    attributes[index] = {
      ...attributes[index],
      [field]: value,
    }

    updateSection(section._id, {
      content: {
        ...section.content,
        attributes,
      },
    })
  }

  const handleRemoveAttribute = (index: number) => {
    const attributes = (section.content.attributes || []).filter((_, i) => i !== index)

    updateSection(section._id, {
      content: {
        ...section.content,
        attributes,
      },
    })
  }

  const handleAddImage = async (file?: File) => {
    if (!file) return

    setIsUploading(true)
    try {
      // Simulate image upload - in a real app, you would upload to a server
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newImage = {
        _id: uuidv4(),
        url: URL.createObjectURL(file),
        altText: file.name,
        isPrimary: false,
      }

      updateSection(section._id, {
        content: {
          ...section.content,
          images: [...(section.content.images || []), newImage],
        },
      })

      toast({
        title: "Image added",
        description: "Your image has been added to the gallery.",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    const images = (section.content.images || []).filter((_, i) => i !== index)

    updateSection(section._id, {
      content: {
        ...section.content,
        images,
      },
    })
  }

  // Render different editors based on section type
  const renderContentEditor = () => {
    switch (section.type) {
      case "bio":
        return (
          <div className="space-y-4">
            <div className="border rounded-md p-2">
              <div className="flex flex-wrap gap-1 mb-2 border-b pb-2">
                <Button variant="ghost" size="sm" onClick={() => document.execCommand("bold")}>
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => document.execCommand("italic")}>
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => document.execCommand("insertUnorderedList")}>
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => document.execCommand("insertOrderedList")}>
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => document.execCommand("formatBlock", false, "<h1>")}>
                  <Heading1 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => document.execCommand("formatBlock", false, "<h2>")}>
                  <Heading2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => document.execCommand("formatBlock", false, "<h3>")}>
                  <Heading3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const url = prompt("Enter link URL")
                    if (url) document.execCommand("createLink", false, url)
                  }}
                >
                  <Link className="h-4 w-4" />
                </Button>
              </div>
              <div
                className="min-h-[200px] p-3 focus:outline-none"
                contentEditable
                dangerouslySetInnerHTML={{ __html: section.content.text || "" }}
                onBlur={(e) => handleTextChange(e.currentTarget.innerHTML)}
              />
            </div>
          </div>
        )

      case "attributes":
        return (
          <div className="space-y-4">
            {(section.content.attributes || []).map((attribute, index) => (
              <div key={attribute._id} className="flex items-center gap-2">
                <Input
                  value={attribute.label}
                  onChange={(e) => handleUpdateAttribute(index, "label", e.target.value)}
                  placeholder="Skill/Attribute"
                  className="flex-1"
                />
                <Input
                  value={attribute.value}
                  onChange={(e) => handleUpdateAttribute(index, "value", e.target.value)}
                  placeholder="Value/Level"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveAttribute(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" size="sm" onClick={handleAddAttribute}>
              <Plus className="mr-2 h-4 w-4" />
              Add Attribute
            </Button>
          </div>
        )

      case "gallery":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(section.content.images || []).map((image, index) => (
                <div key={image._id} className="relative group">
                  <div className="aspect-square rounded-md overflow-hidden border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.altText || "Gallery image"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="aspect-square rounded-md border border-dashed flex flex-col items-center justify-center bg-muted/50">
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleAddImage(e.target.files?.[0])}
                />
                <Button
                  variant="ghost"
                  disabled={isUploading}
                  onClick={() => document.getElementById("image-upload")?.click()}
                  className="flex flex-col h-auto py-8"
                >
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  ) : (
                    <ImageIcon className="h-8 w-8 mb-2" />
                  )}
                  <span>{isUploading ? "Uploading..." : "Add Image"}</span>
                </Button>
              </div>
            </div>
          </div>
        )

      case "markdown":
        return (
          <div className="space-y-4">
            <Tabs defaultValue="edit">
              <TabsList>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="edit">
                <Textarea
                  value={section.content.markdown || ""}
                  onChange={(e) => handleMarkdownChange(e.target.value)}
                  placeholder="# Markdown content\nWrite your content using markdown syntax."
                  className="min-h-[300px] font-mono"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Use Markdown syntax: # for headings, * for lists, ** for bold, etc.
                </p>
              </TabsContent>
              <TabsContent value="preview">
                <div className="border rounded-md p-4 min-h-[300px] prose max-w-none">
                  {/* In a real app, you would render markdown here */}
                  <div dangerouslySetInnerHTML={{ __html: section.content.markdown || "" }} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )

      case "custom":
        return (
          <div className="space-y-4">
            <Tabs defaultValue="html">
              <TabsList>
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="html">
                <Textarea
                  value={section.content.html || ""}
                  onChange={(e) =>
                    updateSection(section._id, {
                      content: {
                        ...section.content,
                        html: e.target.value,
                      },
                    })
                  }
                  placeholder="<div>Your custom HTML here</div>"
                  className="min-h-[300px] font-mono"
                />
              </TabsContent>
              <TabsContent value="css">
                <Textarea
                  value={section.content.customCSS || ""}
                  onChange={(e) =>
                    updateSection(section._id, {
                      content: {
                        ...section.content,
                        customCSS: e.target.value,
                      },
                    })
                  }
                  placeholder=".custom-class { color: blue; }"
                  className="min-h-[300px] font-mono"
                />
              </TabsContent>
              <TabsContent value="preview">
                <div className="border rounded-md p-4 min-h-[300px]">
                  <style>{section.content.customCSS}</style>
                  <div dangerouslySetInnerHTML={{ __html: section.content.html || "" }} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )

      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            This section type is not supported in the editor yet.
          </div>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-semibold h-auto px-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Section Title"
              />
            </CardTitle>
            <CardDescription>{section.type.charAt(0).toUpperCase() + section.type.slice(1)} section</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor={`section-visible-${section._id}`} className="text-sm">
              {isVisible ? "Visible" : "Hidden"}
            </Label>
            <Switch id={`section-visible-${section._id}`} checked={isVisible} onCheckedChange={setIsVisible} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content">{renderContentEditor()}</TabsContent>

          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`section-order-${section._id}`}>Display Order</Label>
                <Input
                  id={`section-order-${section._id}`}
                  type="number"
                  value={section.order}
                  onChange={(e) => updateSection(section._id, { order: Number.parseInt(e.target.value) })}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first. You can also drag and drop sections in the sidebar.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`section-class-${section._id}`}>Custom CSS Class</Label>
                <Input
                  id={`section-class-${section._id}`}
                  value={section.content?.customCSS || ""}
                  onChange={(e) => updateSection(section._id, { 
                    content: {
                      ...section.content,
                      customCSS: e.target.value
                    }
                  })}
                  placeholder="my-custom-section"
                />
                <p className="text-xs text-muted-foreground">
                  Add a custom CSS class to this section for styling purposes.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

