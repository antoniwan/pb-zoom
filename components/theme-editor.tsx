"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Profile } from "@/lib/models"

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
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: profile.theme.primaryColor }}></div>
            <Input
              id="primaryColor"
              type="text"
              value={profile.theme.primaryColor}
              onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
              placeholder="#000000"
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#e779c1" }}
              onClick={() => handleThemeChange("primaryColor", "#e779c1")}
              aria-label="Soft Pink"
            />
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#c084fc" }}
              onClick={() => handleThemeChange("primaryColor", "#c084fc")}
              aria-label="Lavender"
            />
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#a78bfa" }}
              onClick={() => handleThemeChange("primaryColor", "#a78bfa")}
              aria-label="Purple"
            />
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#f9a8d4" }}
              onClick={() => handleThemeChange("primaryColor", "#f9a8d4")}
              aria-label="Light Pink"
            />
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
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#67e8f9" }}
              onClick={() => handleThemeChange("secondaryColor", "#67e8f9")}
              aria-label="Soft Teal"
            />
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#a5f3fc" }}
              onClick={() => handleThemeChange("secondaryColor", "#a5f3fc")}
              aria-label="Light Cyan"
            />
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#93c5fd" }}
              onClick={() => handleThemeChange("secondaryColor", "#93c5fd")}
              aria-label="Light Blue"
            />
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#bae6fd" }}
              onClick={() => handleThemeChange("secondaryColor", "#bae6fd")}
              aria-label="Sky Blue"
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
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#faf8f9" }}
              onClick={() => handleThemeChange("backgroundColor", "#faf8f9")}
              aria-label="Soft White"
            />
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#f5f3ff" }}
              onClick={() => handleThemeChange("backgroundColor", "#f5f3ff")}
              aria-label="Lavender White"
            />
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#fdf2f8" }}
              onClick={() => handleThemeChange("backgroundColor", "#fdf2f8")}
              aria-label="Pink White"
            />
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#ffffff" }}
              onClick={() => handleThemeChange("backgroundColor", "#ffffff")}
              aria-label="White"
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
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#352f44" }}
              onClick={() => handleThemeChange("textColor", "#352f44")}
              aria-label="Soft Purple"
            />
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#4a4458" }}
              onClick={() => handleThemeChange("textColor", "#4a4458")}
              aria-label="Medium Purple"
            />
            <button
              type="button"
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: "#5f5675" }}
              onClick={() => handleThemeChange("textColor", "#5f5675")}
              aria-label="Light Purple"
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
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
        <p className="text-sm text-muted-foreground">Add custom CSS to further customize your profile&apos;s appearance.</p>
      </div>
    </div>
  )
}

