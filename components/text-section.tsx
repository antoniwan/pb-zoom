"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/rich-text-editor"

import type { ProfileSection } from "@/lib/db"

export function TextSection({ section }: { section: ProfileSection }) {
  const { updateSection } = useProfile()
  const [text, setText] = useState(section.content?.text || "")

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSection(section._id, {
        content: {
          ...section.content,
          text,
        },
      })
    }, 500)
    return () => clearTimeout(timer)
  }, [text, section._id, section.content, updateSection])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Content</CardTitle>
        <CardDescription>Add and format text content for this section</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edit">
          <TabsList className="mb-4">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <RichTextEditor value={text} onChange={setText} placeholder="Start writing..." />
          </TabsContent>

          <TabsContent value="preview">
            <div className="border rounded-md p-4 min-h-[200px] prose max-w-none">
              {text ? (
                <div dangerouslySetInnerHTML={{ __html: text }} />
              ) : (
                <p className="text-muted-foreground italic">No content yet. Start editing to add content.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

