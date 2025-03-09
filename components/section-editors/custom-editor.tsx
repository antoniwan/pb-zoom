"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ProfileSection } from "@/lib/db"

interface CustomEditorProps {
  content: ProfileSection["content"]
  onChange: (content: ProfileSection["content"]) => void
}

export function CustomEditor({ content, onChange }: CustomEditorProps) {
  const handleHTMLChange = (html: string) => {
    onChange({
      ...content,
      html,
    })
  }

  const handleCSSChange = (customCSS: string) => {
    onChange({
      ...content,
      customCSS,
    })
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="html">
        <TabsList>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="html" className="mt-4">
          <div className="space-y-2">
            <Label>HTML Content</Label>
            <Textarea
              value={content.html}
              onChange={(e) => handleHTMLChange(e.target.value)}
              placeholder="<div>Your custom HTML here</div>"
              className="font-mono min-h-[300px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="css" className="mt-4">
          <div className="space-y-2">
            <Label>Custom CSS</Label>
            <Textarea
              value={content.customCSS}
              onChange={(e) => handleCSSChange(e.target.value)}
              placeholder=".my-custom-class { ... }"
              className="font-mono min-h-[300px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div className="border rounded-lg p-4">
            <style>{content.customCSS}</style>
            <div dangerouslySetInnerHTML={{ __html: content.html }} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

