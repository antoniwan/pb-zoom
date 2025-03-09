"use client"

import { useState, useEffect } from "react"
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

// Popular Google Fonts categorized
const fontOptions = {
  sans: [
    { name: "Inter", value: "Inter" },
    { name: "Roboto", value: "Roboto" },
    { name: "Open Sans", value: "Open Sans" },
    { name: "Poppins", value: "Poppins" },
    { name: "Montserrat", value: "Montserrat" },
    { name: "Lato", value: "Lato" },
  ],
  serif: [
    { name: "Merriweather", value: "Merriweather" },
    { name: "Playfair Display", value: "Playfair Display" },
    { name: "Lora", value: "Lora" },
    { name: "PT Serif", value: "PT Serif" },
    { name: "Crimson Text", value: "Crimson Text" },
  ],
  display: [
    { name: "Abril Fatface", value: "Abril Fatface" },
    { name: "Lobster", value: "Lobster" },
    { name: "Pacifico", value: "Pacifico" },
    { name: "Righteous", value: "Righteous" },
  ],
  monospace: [
    { name: "JetBrains Mono", value: "JetBrains Mono" },
    { name: "Source Code Pro", value: "Source Code Pro" },
    { name: "Fira Code", value: "Fira Code" },
    { name: "IBM Plex Mono", value: "IBM Plex Mono" },
  ],
  system: [
    { name: "System UI", value: "system-ui" },
    { name: "Arial", value: "Arial" },
    { name: "Helvetica", value: "Helvetica" },
    { name: "Times New Roman", value: "Times New Roman" },
    { name: "Georgia", value: "Georgia" },
  ],
}

export function ThemeEditor({ profile, updateProfile }: ThemeEditorProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedFontCategory, setSelectedFontCategory] = useState(() => {
    // Determine initial category based on current font
    for (const [category, fonts] of Object.entries(fontOptions)) {
      if (fonts.some(font => font.value === profile.theme.fontFamily)) {
        return category
      }
    }
    return "sans"
  })

  // Load Google Fonts when font family changes
  useEffect(() => {
    const loadGoogleFont = async (fontFamily: string) => {
      // Skip system fonts
      if (fontOptions.system.some(font => font.value === fontFamily)) {
        return
      }

      try {
        const link = document.createElement("link")
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, "+")}:wght@400;500;600;700&display=swap`
        link.rel = "stylesheet"
        document.head.appendChild(link)
      } catch (error) {
        console.error("Error loading Google Font:", error)
      }
    }

    loadGoogleFont(profile.theme.fontFamily)
  }, [profile.theme.fontFamily])

  const validateThemeUpdate = (field: string, value: string): boolean => {
    setErrors(prev => ({ ...prev, [field]: "" }))

    if (field.includes("Color")) {
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
        setErrors(prev => ({ ...prev, [field]: "Please enter a valid hex color (e.g., #FF0000)" }))
        return false
      }
    }

    if (field === "customCSS") {
      try {
        const style = document.createElement("style")
        style.textContent = value
        document.head.appendChild(style)
        document.head.removeChild(style)
      } catch (err) {
        console.error("Error validating CSS:", err)
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
            <Label htmlFor="fontCategory">Font Category</Label>
            <select
              id="fontCategory"
              value={selectedFontCategory}
              onChange={(e) => setSelectedFontCategory(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="sans">Sans-Serif</option>
              <option value="serif">Serif</option>
              <option value="display">Display</option>
              <option value="monospace">Monospace</option>
              <option value="system">System Fonts</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontFamily">Font Family</Label>
            <select
              id="fontFamily"
              value={profile.theme.fontFamily}
              onChange={(e) => handleThemeChange("fontFamily", e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background"
              style={{ fontFamily: profile.theme.fontFamily }}
            >
              {fontOptions[selectedFontCategory as keyof typeof fontOptions].map((font) => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-muted">
            <p className="text-sm" style={{ fontFamily: profile.theme.fontFamily }}>
              The quick brown fox jumps over the lazy dog
            </p>
            <p className="text-xs mt-2 text-muted-foreground">Preview text in {profile.theme.fontFamily}</p>
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

