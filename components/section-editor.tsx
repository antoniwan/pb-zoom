"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { TextSection } from "./text-section"
import { GallerySection } from "./gallery-section"
import { LinksSection } from "./links-section"
import { CustomSection } from "./custom-section"

import type { ProfileSection } from "@/lib/db"

export function SectionEditor({ section }: { section: ProfileSection }) {
  const { updateSection } = useProfile()
  const [title, setTitle] = useState(section.title)
  const [isVisible, setIsVisible] = useState(section.isVisible !== false)

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSection(section._id, { title })
    }, 500)
    return () => clearTimeout(timer)
  }, [title, section._id, updateSection])

  useEffect(() => {
    updateSection(section._id, { isVisible })
  }, [isVisible, section._id, updateSection])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Section Settings</CardTitle>
              <CardDescription>Configure this section&apos;s basic settings</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor={`section-visible-${section._id}`} className="text-sm">
                {isVisible ? "Visible" : "Hidden"}
              </Label>
              <Switch id={`section-visible-${section._id}`} checked={isVisible} onCheckedChange={setIsVisible} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`section-title-${section._id}`}>Section Title</Label>
            <Input
              id={`section-title-${section._id}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter section title"
            />
          </div>
        </CardContent>
      </Card>

      {section.type === "bio" && <TextSection section={section} />}
      {section.type === "gallery" && <GallerySection section={section} />}
      {section.type === "links" && <LinksSection section={section} />}
      {section.type === "custom" && <CustomSection section={section} />}
    </div>
  )
}

