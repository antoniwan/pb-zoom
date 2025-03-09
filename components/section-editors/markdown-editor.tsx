"use client"

import { useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Link, List, ListOrdered } from "lucide-react"
import type { ProfileSection } from "@/lib/db"

interface MarkdownEditorProps {
  content: ProfileSection["content"]
  onChange: (content: ProfileSection["content"]) => void
}

export function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const insertMarkdown = useCallback((prefix: string, suffix = "") => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const before = text.substring(0, start)
    const selection = text.substring(start, end)
    const after = text.substring(end)

    const newText = before + prefix + selection + suffix + after
    const newContent = { ...content, markdown: newText }
    onChange(newContent)

    // Reset cursor position
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      )
    })
  }, [content, onChange])

  const handleMarkdownChange = (markdown: string) => {
    onChange({
      ...content,
      markdown,
      html: "", // Clear HTML when markdown changes
    })
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="write">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => insertMarkdown("**", "**")}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => insertMarkdown("*", "*")}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => insertMarkdown("[", "](url)")}
              title="Link"
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => insertMarkdown("\n- ")}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => insertMarkdown("\n1. ")}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="write" className="mt-0">
          <Textarea
            value={content.markdown}
            onChange={(e) => handleMarkdownChange(e.target.value)}
            placeholder="Write your content in Markdown..."
            className="min-h-[200px] font-mono"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div
            className="prose prose-sm max-w-none border rounded-md p-4"
            dangerouslySetInnerHTML={{ __html: content.html }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 