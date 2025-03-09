"use client"

import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ColorPicker } from "@/components/color-picker"
import { FontSelector } from "@/components/font-selector"

export function ThemeEditor() {
  const { profile, updateProfile } = useProfile()

  if (!profile) return null

  const theme = profile.theme || {}

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
          <CardDescription>
            Choose your profile's color scheme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <ColorPicker
              value={theme.primaryColor}
              onChange={(primaryColor) =>
                updateProfile({
                  theme: { ...theme, primaryColor },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Background Color</Label>
            <ColorPicker
              value={theme.backgroundColor}
              onChange={(backgroundColor) =>
                updateProfile({
                  theme: { ...theme, backgroundColor },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Text Color</Label>
            <ColorPicker
              value={theme.textColor}
              onChange={(textColor) =>
                updateProfile({
                  theme: { ...theme, textColor },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>
            Select fonts and text styles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Heading Font</Label>
            <FontSelector
              value={theme.headingFont}
              onChange={(headingFont) =>
                updateProfile({
                  theme: { ...theme, headingFont },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Body Font</Label>
            <FontSelector
              value={theme.bodyFont}
              onChange={(bodyFont) =>
                updateProfile({
                  theme: { ...theme, bodyFont },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom CSS</CardTitle>
          <CardDescription>
            Add custom CSS to further customize your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={theme.customCSS}
            onChange={(e) =>
              updateProfile({
                theme: { ...theme, customCSS: e.target.value },
              })
            }
            placeholder=".my-custom-class { ... }"
            className="font-mono"
            rows={10}
          />
        </CardContent>
      </Card>
    </div>
  )
} 