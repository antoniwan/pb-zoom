"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

import type { ProfileSection } from "@/lib/db"

export function CustomSection({ section }: { section: ProfileSection }) {
  const { updateSection } = useProfile()
  const [customHtml, setCustomHtml] = useState(section.content?.html || "")
  const [customCss, setCustomCss] = useState(section.content?.customCSS || "")

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSection(section._id, {
        content: {
          ...section.content,
          html: customHtml,
          customCSS: customCss,
        },
      })
    }, 500)
    return () => clearTimeout(timer)
  }, [customHtml, customCss, section._id, section.content, updateSection])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Content</CardTitle>
        <CardDescription>Add custom HTML and CSS for advanced customization</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Custom HTML and CSS gives you more flexibility but may affect your profile&apos;s security and appearance.
            Use with caution.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="html">
          <TabsList className="mb-4">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="html">
            <div className="space-y-2">
              <Label htmlFor="custom-html">Custom HTML</Label>
              <Textarea
                id="custom-html"
                value={customHtml}
                onChange={(e) => setCustomHtml(e.target.value)}
                placeholder="<div>Your custom HTML here</div>"
                className="font-mono text-sm"
                rows={10}
              />
            </div>
          </TabsContent>

          <TabsContent value="css">
            <div className="space-y-2">
              <Label htmlFor="custom-css">Custom CSS</Label>
              <Textarea
                id="custom-css"
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                placeholder=".custom-class { color: blue; }"
                className="font-mono text-sm"
                rows={10}
              />
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="border rounded-md p-4 min-h-[200px]">
              <style>{customCss}</style>
              {customHtml ? (
                <div dangerouslySetInnerHTML={{ __html: customHtml }} />
              ) : (
                <p className="text-muted-foreground italic">No custom HTML content yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

