"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import type { Profile } from "@/lib/db"

interface ThemeEditorProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

// Validation helpers
const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

const isValidFontFamily = (font: string): boolean => {
  const validFonts = [
    "Inter",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "system-ui",
    "sans-serif",
    "serif",
    "monospace"
  ]
  return validFonts.includes(font)
}

const isValidCSS = (css: string): boolean => {
  try {
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)
    document.head.removeChild(style)
    return true
  } catch (error) {
    return false
  }
}

export function ThemeEditor({ profile, updateProfile }: ThemeEditorProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateThemeUpdate = (field: string, value: string): boolean => {
    setErrors(prev => ({ ...prev, [field]: "" }))

    if (field.includes("Color")) {
      if (!isValidHexColor(value)) {
        setErrors(prev => ({ ...prev, [field]: "Please enter a valid hex color (e.g., #FF0000)" }))
        return false
      }
    }

    if (field === "fontFamily") {
      if (!isValidFontFamily(value)) {
        setErrors(prev => ({ ...prev, [field]: "Please select a valid font family" }))
        return false
      }
    }

    if (field === "customCSS") {
      if (value && !isValidCSS(value)) {
        setErrors(prev => ({ ...prev, [field]: "Please enter valid CSS" }))
        return false
      }
    }

    return true
  }

  const handleThemeChange = (field: keyof Profile["theme"], value: string) => {
    if (!validateThemeUpdate(field, value)) {
      toast({
        title: "Invalid Value",
        description: errors[field],
        variant: "destructive",
      })
      return
    }

    updateProfile({
      theme: {
        ...profile.theme,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 space-y-4">
          <h3 className="font-medium">Colors</h3>
          
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                type="color"
                value={profile.theme.primaryColor}
                onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                className="w-12 h-12 p-1 rounded-lg"
              />
              <Input
                type="text"
                value={profile.theme.primaryColor}
                onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                placeholder="#000000"
                className={`font-mono ${errors.primaryColor ? "border-red-500" : ""}`}
              />
            </div>
            {errors.primaryColor && <p className="text-xs text-red-500">{errors.primaryColor}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondaryColor"
                type="color"
                value={profile.theme.secondaryColor}
                onChange={(e) => handleThemeChange("secondaryColor", e.target.value)}
                className="w-12 h-12 p-1 rounded-lg"
              />
              <Input
                type="text"
                value={profile.theme.secondaryColor}
                onChange={(e) => handleThemeChange("secondaryColor", e.target.value)}
                placeholder="#000000"
                className={`font-mono ${errors.secondaryColor ? "border-red-500" : ""}`}
              />
            </div>
            {errors.secondaryColor && <p className="text-xs text-red-500">{errors.secondaryColor}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="backgroundColor"
                type="color"
                value={profile.theme.backgroundColor}
                onChange={(e) => handleThemeChange("backgroundColor", e.target.value)}
                className="w-12 h-12 p-1 rounded-lg"
              />
              <Input
                type="text"
                value={profile.theme.backgroundColor}
                onChange={(e) => handleThemeChange("backgroundColor", e.target.value)}
                placeholder="#FFFFFF"
                className={`font-mono ${errors.backgroundColor ? "border-red-500" : ""}`}
              />
            </div>
            {errors.backgroundColor && <p className="text-xs text-red-500">{errors.backgroundColor}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex gap-2">
              <Input
                id="textColor"
                type="color"
                value={profile.theme.textColor}
                onChange={(e) => handleThemeChange("textColor", e.target.value)}
                className="w-12 h-12 p-1 rounded-lg"
              />
              <Input
                type="text"
                value={profile.theme.textColor}
                onChange={(e) => handleThemeChange("textColor", e.target.value)}
                placeholder="#000000"
                className={`font-mono ${errors.textColor ? "border-red-500" : ""}`}
              />
            </div>
            {errors.textColor && <p className="text-xs text-red-500">{errors.textColor}</p>}
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h3 className="font-medium">Typography & Custom CSS</h3>
          
          <div className="space-y-2">
            <Label htmlFor="fontFamily">Font Family</Label>
            <select
              id="fontFamily"
              value={profile.theme.fontFamily}
              onChange={(e) => handleThemeChange("fontFamily", e.target.value)}
              className={`w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background 
                ${errors.fontFamily ? "border-red-500" : "border-input"}`}
            >
              <option value="Inter">Inter</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="system-ui">System UI</option>
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
            </select>
            {errors.fontFamily && <p className="text-xs text-red-500">{errors.fontFamily}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customCSS">Custom CSS</Label>
            <Textarea
              id="customCSS"
              value={profile.theme.customCSS || ""}
              onChange={(e) => handleThemeChange("customCSS", e.target.value)}
              placeholder="Add custom CSS styles here..."
              className={`font-mono h-[200px] ${errors.customCSS ? "border-red-500" : ""}`}
            />
            {errors.customCSS && <p className="text-xs text-red-500">{errors.customCSS}</p>}
            <p className="text-sm text-muted-foreground">
              Advanced: Add custom CSS to further customize your profile&apos;s appearance.
            </p>
          </div>
        </Card>
      </div>

      <div className="bg-muted p-4 rounded-xl">
        <h4 className="font-medium mb-2">Theme Preview</h4>
        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: profile.theme.backgroundColor,
            color: profile.theme.textColor,
            fontFamily: profile.theme.fontFamily,
          }}
        >
          <h1 style={{ color: profile.theme.primaryColor }}>Sample Heading</h1>
          <p className="mt-2">This is how your text will look with the current theme settings.</p>
          <Button
            className="mt-4"
            style={{
              backgroundColor: profile.theme.secondaryColor,
              color: profile.theme.backgroundColor,
            }}
          >
            Sample Button
          </Button>
        </div>
      </div>
    </div>
  )
}

