"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Profile } from "@/lib/db"

interface ProfileThemeEditorProps {
  profile: Profile
  updateProfile: (updates: Partial<Profile>) => void
}

export function ProfileThemeEditor({ profile, updateProfile }: ProfileThemeEditorProps) {
  const handleThemeChange = (key: keyof Profile["theme"], value: string) => {
    updateProfile({
      theme: {
        ...profile.theme,
        [key]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: profile.theme.primaryColor }}></div>
              <Input
                id="primaryColor"
                type="text"
                value={profile.theme.primaryColor}
                onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                placeholder="#000000"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                type="button"
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: "#1d4ed8" }}
                onClick={() => handleThemeChange("primaryColor", "#1d4ed8")}
                aria-label="Blue"
              />
              <button
                type="button"
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: "#4338ca" }}
                onClick={() => handleThemeChange("primaryColor", "#4338ca")}
                aria-label="Indigo"
              />
              <button
                type="button"
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: "#0369a1" }}
                onClick={() => handleThemeChange("primaryColor", "#0369a1")}
                aria-label="Sky Blue"
              />
              <button
                type="button"
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: "#047857" }}
                onClick={() => handleThemeChange("primaryColor", "#047857")}
                aria-label="Emerald"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryColor">Secondary Color</Label>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: profile.theme.secondaryColor }}></div>
            <Input
              id="secondaryColor"
              type="text"
              value={profile.theme.secondaryColor}
              onChange={(e) => handleThemeChange("secondaryColor", e.target.value)}
              placeholder="#000000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Background Color</Label>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: profile.theme.backgroundColor }}></div>
            <Input
              id="backgroundColor"
              type="text"
              value={profile.theme.backgroundColor}
              onChange={(e) => handleThemeChange("backgroundColor", e.target.value)}
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="textColor">Text Color</Label>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: profile.theme.textColor }}></div>
            <Input
              id="textColor"
              type="text"
              value={profile.theme.textColor}
              onChange={(e) => handleThemeChange("textColor", e.target.value)}
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fontFamily">Font Family</Label>
        <select
          id="fontFamily"
          value={profile.theme.fontFamily}
          onChange={(e) => handleThemeChange("fontFamily", e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Poppins">Poppins</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customCSS">Custom CSS</Label>
        <Textarea
          id="customCSS"
          value={profile.theme.customCSS || ""}
          onChange={(e) => handleThemeChange("customCSS", e.target.value)}
          placeholder=".profile-container { /* your custom styles */ }"
          className="font-mono rounded-xl"
          rows={8}
        />
        <p className="text-sm text-muted-foreground">
          Add custom CSS to further customize your profile&apos;s appearance.
        </p>
      </div>
    </div>
  )
}

