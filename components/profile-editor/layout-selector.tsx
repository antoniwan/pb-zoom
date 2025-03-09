"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface LayoutSelectorProps {
  value: string
  customOptions?: {
    columnCount?: number
    sectionSpacing?: number
    fullWidth?: boolean
  }
  onChange: (layout: string, options?: {
    columnCount?: number
    sectionSpacing?: number
    fullWidth?: boolean
  }) => void
}

const layouts = [
  {
    id: "standard",
    name: "Standard",
    description: "Single column layout with sections stacked vertically",
    preview: (
      <div className="space-y-2">
        <div className="h-2 w-full bg-muted rounded"></div>
        <div className="h-2 w-full bg-muted rounded"></div>
        <div className="h-2 w-full bg-muted rounded"></div>
      </div>
    ),
  },
  {
    id: "grid",
    name: "Grid",
    description: "Two-column grid layout for balanced content display",
    preview: (
      <div className="grid grid-cols-2 gap-2">
        <div className="h-2 w-full bg-muted rounded"></div>
        <div className="h-2 w-full bg-muted rounded"></div>
        <div className="h-2 w-full bg-muted rounded"></div>
        <div className="h-2 w-full bg-muted rounded"></div>
      </div>
    ),
  },
  {
    id: "magazine",
    name: "Magazine",
    description: "Three-column magazine-style layout for rich content",
    preview: (
      <div className="grid grid-cols-3 gap-2">
        <div className="h-2 w-full bg-muted rounded"></div>
        <div className="h-2 w-full bg-muted rounded"></div>
        <div className="h-2 w-full bg-muted rounded"></div>
        <div className="h-2 w-full bg-muted rounded"></div>
        <div className="h-2 w-full bg-muted rounded"></div>
        <div className="h-2 w-full bg-muted rounded"></div>
      </div>
    ),
  },
  {
    id: "masonry",
    name: "Masonry",
    description: "Pinterest-style masonry layout for visual content",
    preview: (
      <div className="grid grid-cols-3 gap-2">
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-2 w-full bg-muted rounded"></div>
        <div className="h-3 w-full bg-muted rounded"></div>
        <div className="h-2 w-full bg-muted rounded"></div>
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-3 w-full bg-muted rounded"></div>
      </div>
    ),
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Showcase layout with featured sections and sidebar",
    preview: (
      <div className="flex gap-2">
        <div className="flex-[2] space-y-2">
          <div className="h-3 w-full bg-muted rounded"></div>
          <div className="h-2 w-full bg-muted rounded"></div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-1 w-full bg-muted rounded"></div>
          <div className="h-1 w-full bg-muted rounded"></div>
          <div className="h-1 w-full bg-muted rounded"></div>
        </div>
      </div>
    ),
  },
  {
    id: "custom",
    name: "Custom",
    description: "Customize your own layout with advanced options",
    preview: (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-muted-foreground">Customizable Layout</div>
      </div>
    ),
  },
]

export function LayoutSelector({ value, customOptions = {
  columnCount: 2,
  sectionSpacing: 8,
  fullWidth: false
}, onChange }: LayoutSelectorProps) {
  const [activeTab, setActiveTab] = useState(value === "custom" ? "custom" : "preset")
  const [columns, setColumns] = useState(customOptions.columnCount)
  const [spacing, setSpacing] = useState(customOptions.sectionSpacing)
  const [fullWidth, setFullWidth] = useState(customOptions.fullWidth)

  const handleCustomChange = () => {
    onChange("custom", {
      columnCount: columns,
      sectionSpacing: spacing,
      fullWidth,
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preset">Preset Layouts</TabsTrigger>
          <TabsTrigger value="custom">Custom Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="preset" className="space-y-4">
          <RadioGroup
            value={value}
            onValueChange={(newValue) => {
              if (newValue !== "custom") {
                onChange(newValue)
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {layouts.map((layout) => (
              <div key={layout.id}>
                <RadioGroupItem
                  value={layout.id}
                  id={layout.id}
                  className="peer sr-only"
                  aria-label={layout.name}
                />
                <Label
                  htmlFor={layout.id}
                  className={cn(
                    "flex flex-col gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer",
                    value === layout.id && "border-primary"
                  )}
                >
                  <div className="font-semibold">{layout.name}</div>
                  <div className="text-sm text-muted-foreground">{layout.description}</div>
                  <div className="mt-2 aspect-video rounded-lg border bg-background p-2">
                    {layout.preview}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="columns">Number of Columns</Label>
                <Input
                  id="columns"
                  type="number"
                  min={1}
                  max={4}
                  value={columns}
                  onChange={(e) => {
                    setColumns(Number(e.target.value))
                    handleCustomChange()
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spacing">Section Spacing (rem)</Label>
                <Input
                  id="spacing"
                  type="number"
                  min={1}
                  max={16}
                  value={spacing}
                  onChange={(e) => {
                    setSpacing(Number(e.target.value))
                    handleCustomChange()
                  }}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="fullWidth"
                  checked={fullWidth}
                  onCheckedChange={(checked) => {
                    setFullWidth(checked)
                    handleCustomChange()
                  }}
                />
                <Label htmlFor="fullWidth">Full Width Layout</Label>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Preview your custom layout settings and adjust them to match your desired design.
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 