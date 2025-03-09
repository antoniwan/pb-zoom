"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mode, setMode] = useState<"visual" | "html">("visual")
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    handleContentChange()
    editorRef.current?.focus()
  }

  const handleHtmlChange = (html: string) => {
    onChange(html)
    if (editorRef.current) {
      editorRef.current.innerHTML = html
    }
  }

  return (
    <div className="border rounded-lg">
      <Tabs value={mode} onValueChange={(value) => setMode(value as "visual" | "html")}>
        <div className="flex items-center justify-between border-b px-4">
          <TabsList>
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>

          {mode === "visual" && (
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => execCommand("bold")} title="Bold">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => execCommand("italic")} title="Italic">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => execCommand("underline")} title="Underline">
                <Underline className="h-4 w-4" />
              </Button>
              <span className="mx-1 h-4 w-px bg-muted" />
              <Button variant="ghost" size="icon" onClick={() => execCommand("formatBlock", "<h1>")} title="Heading 1">
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => execCommand("formatBlock", "<h2>")} title="Heading 2">
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => execCommand("formatBlock", "<h3>")} title="Heading 3">
                <Heading3 className="h-4 w-4" />
              </Button>
              <span className="mx-1 h-4 w-px bg-muted" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => execCommand("insertUnorderedList")}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => execCommand("insertOrderedList")}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <span className="mx-1 h-4 w-px bg-muted" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const url = prompt("Enter link URL")
                  if (url) execCommand("createLink", url)
                }}
                title="Insert Link"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const url = prompt("Enter image URL")
                  if (url) execCommand("insertImage", url)
                }}
                title="Insert Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <span className="mx-1 h-4 w-px bg-muted" />
              <Button variant="ghost" size="icon" onClick={() => execCommand("justifyLeft")} title="Align Left">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => execCommand("justifyCenter")} title="Align Center">
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => execCommand("justifyRight")} title="Align Right">
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="visual" className="p-0">
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[200px] p-4 focus:outline-none"
            onInput={handleContentChange}
            onBlur={handleContentChange}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </TabsContent>

        <TabsContent value="html" className="p-0">
          <Textarea
            value={value}
            onChange={(e) => handleHtmlChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[200px] font-mono text-sm border-0 rounded-none focus-visible:ring-0"
            rows={10}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

