"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/components/profile-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { Palette, Type, Layout } from "lucide-react"
import type { Profile } from "@/lib/db"

interface ThemeEditorProps {
  profile: Profile
}

export function ThemeEditor({ profile }: ThemeEditorProps) {
  const { updateProfile } = useProfile()
  const [activeTab, setActiveTab] = useState("colors")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [themeValues, setThemeValues] = useState({
    primaryColor: profile.theme.primaryColor || "#1d4ed8",
    secondaryColor: profile.theme.secondaryColor || "#67e8f9",
    backgroundColor: profile.theme.backgroundColor || "#ffffff",
    textColor: profile.theme.textColor || "#000000",
    fontFamily: profile.theme.fontFamily || "Inter",
    customCSS: profile.theme.customCSS || "",
  })

  // Update theme values with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(errors).length === 0) {
        updateProfile({
          theme: themeValues,
        })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [themeValues, errors, updateProfile])

  const handleInputChange = (field: string, value: string) => {
    // Validate color fields
    if (field.includes("Color")) {
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
        setErrors((prev) => ({ ...prev, [field]: "Please enter a valid hex color (e.g., #FF0000)" }))
        return
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }

    // Validate CSS
    if (field === "customCSS") {
      try {
        const style = document.createElement("style")
        style.textContent = value
        document.head.appendChild(style)
        document.head.removeChild(style)

        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      } catch {
        console.error("Failed to update theme")
      }
    }

    setThemeValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleColorPresetClick = (preset: { [key: string]: string }) => {
    setThemeValues((prev) => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      backgroundColor: preset.background,
      textColor: preset.text,
    }))

    toast({
      title: "Theme applied",
      description: `Applied the ${preset.name} theme to your profile.`,
    })
  }

  const colorPresets = [
    {
      name: "Professional Blue",
      primary: "#1d4ed8",
      secondary: "#93c5fd",
      background: "#ffffff",
      text: "#1e293b",
    },
    {
      name: "Creative Purple",
      primary: "#7e22ce",
      secondary: "#c4b5fd",
      background: "#faf5ff",
      text: "#4c1d95",
    },
    {
      name: "Elegant Dark",
      primary: "#6366f1",
      secondary: "#a5b4fc",
      background: "#1e1b4b",
      text: "#e0e7ff",
    },
    {
      name: "Nature Green",
      primary: "#15803d",
      secondary: "#86efac",
      background: "#f0fdf4",
      text: "#14532d",
    },
    {
      name: "Warm Orange",
      primary: "#c2410c",
      secondary: "#fdba74",
      background: "#fff7ed",
      text: "#7c2d12",
    },
    {
      name: "Minimal Gray",
      primary: "#4b5563",
      secondary: "#9ca3af",
      background: "#f9fafb",
      text: "#1f2937",
    },
  ]

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
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="colors" className="flex-1">
            <Palette className="mr-2 h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex-1">
            <Type className="mr-2 h-4 w-4" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">
            <Layout className="mr-2 h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6 pt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Color Presets</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {colorPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-center justify-center"
                  onClick={() => handleColorPresetClick(preset)}
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }}></div>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }}></div>
                  </div>
                  <span className="text-xs">{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Custom Colors</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={themeValues.primaryColor}
                    onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                    className="w-12 h-12 p-1 rounded-md"
                  />
                  <Input
                    type="text"
                    value={themeValues.primaryColor}
                    onChange={(e) => handleInputChange("primaryColor", e.target.value)}
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
                    value={themeValues.secondaryColor}
                    onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                    className="w-12 h-12 p-1 rounded-md"
                  />
                  <Input
                    type="text"
                    value={themeValues.secondaryColor}
                    onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
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
                    value={themeValues.backgroundColor}
                    onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
                    className="w-12 h-12 p-1 rounded-md"
                  />
                  <Input
                    type="text"
                    value={themeValues.backgroundColor}
                    onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
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
                    value={themeValues.textColor}
                    onChange={(e) => handleInputChange("textColor", e.target.value)}
                    className="w-12 h-12 p-1 rounded-md"
                  />
                  <Input
                    type="text"
                    value={themeValues.textColor}
                    onChange={(e) => handleInputChange("textColor", e.target.value)}
                    placeholder="#000000"
                    className={`font-mono ${errors.textColor ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.textColor && <p className="text-xs text-red-500">{errors.textColor}</p>}
              </div>
            </div>
          </div>

          <div
            className="p-4 border rounded-md"
            style={{
              backgroundColor: themeValues.backgroundColor,
              color: themeValues.textColor,
            }}
          >
            <h3 className="text-lg font-medium mb-2" style={{ color: themeValues.primaryColor }}>
              Theme Preview
            </h3>
            <p className="mb-2">This is how your profile&apos;s colors will look</p>
            <div className="flex gap-2">
              <Button
                className="text-sm"
                style={{
                  backgroundColor: themeValues.primaryColor,
                  color: themeValues.backgroundColor,
                }}
              >
                Primary Button
              </Button>
              <Button
                className="text-sm"
                style={{
                  backgroundColor: themeValues.secondaryColor,
                  color: themeValues.textColor,
                }}
              >
                Secondary Button
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6 pt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Font Family</h3>

            <div className="space-y-4">
              <RadioGroup
                value={themeValues.fontFamily}
                onValueChange={(value) => handleInputChange("fontFamily", value)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {Object.entries(fontOptions).map(([category, fonts]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium capitalize">{category}</h4>
                    {fonts.map((font) => (
                      <div key={font.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={font.value} id={`font-${font.value}`} />
                        <Label htmlFor={`font-${font.value}`} className="text-base" style={{ fontFamily: font.value }}>
                          {font.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div
              className="p-4 border rounded-md mt-4"
              style={{
                fontFamily: themeValues.fontFamily,
                backgroundColor: themeValues.backgroundColor,
                color: themeValues.textColor,
              }}
            >
              <h3 className="text-lg font-medium mb-2" style={{ color: themeValues.primaryColor }}>
                Typography Preview
              </h3>
              <p className="mb-2">This is how your text will look with the {themeValues.fontFamily} font family.</p>
              <p className="text-sm" style={{ color: themeValues.secondaryColor }}>
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="customCSS">Custom CSS</Label>
            <Textarea
              id="customCSS"
              value={themeValues.customCSS}
              onChange={(e) => handleInputChange("customCSS", e.target.value)}
              placeholder="/* Add your custom CSS here */\n.profile-header { font-weight: bold; }"
              className={`font-mono min-h-[200px] ${errors.customCSS ? "border-red-500" : ""}`}
            />
            {errors.customCSS && <p className="text-xs text-red-500">{errors.customCSS}</p>}
            <p className="text-sm text-muted-foreground">
              Advanced: Add custom CSS to further customize your profile's appearance.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2">CSS Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>
                Use <code>.profile-header</code> to style the header section
              </li>
              <li>
                Use <code>.profile-section</code> to style all sections
              </li>
              <li>
                Use <code>.profile-section-bio</code> to style specific section types
              </li>
              <li>
                Use <code>.profile-social</code> to style social links
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

