"use client"
import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ColorPicker } from "@/components/color-picker"

interface Theme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  customCSS?: string
}

export function ThemeSettings() {
  const { profile, updateProfile } = useProfile()
  const theme: Theme = profile.theme || {
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontFamily: "sans-serif",
  }

  const handlePrimaryColorChange = (color: string) => {
    updateProfile({
      theme: {
        ...theme,
        primaryColor: color
      }
    })
  }

  const handleSecondaryColorChange = (color: string) => {
    updateProfile({
      theme: {
        ...theme,
        secondaryColor: color
      }
    })
  }

  const handleBackgroundColorChange = (color: string) => {
    updateProfile({
      theme: {
        ...theme,
        backgroundColor: color
      }
    })
  }

  const handleTextColorChange = (color: string) => {
    updateProfile({
      theme: {
        ...theme,
        textColor: color
      }
    })
  }

  const handleThemeChange = (key: string, value: string) => {
    if (key === "layout") {
      updateProfile({ layout: value })
    } else {
      updateProfile({
        theme: {
          ...theme,
          [key]: value,
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Colors</CardTitle>
          <CardDescription>Customize the colors of your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <ColorPicker
                color={theme.primaryColor}
                onChange={(color) => handlePrimaryColorChange(color)}
              />
            </div>

            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <ColorPicker
                color={theme.secondaryColor}
                onChange={(color) => handleSecondaryColorChange(color)}
              />
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <ColorPicker
                color={theme.backgroundColor}
                onChange={(color) => handleBackgroundColorChange(color)}
              />
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <ColorPicker
                color={theme.textColor}
                onChange={(color) => handleTextColorChange(color)}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="space-y-2">
              <Label>Preview</Label>
              <div
                className="h-32 rounded-md p-4 flex flex-col justify-center items-center"
                style={{
                  backgroundColor: theme.backgroundColor,
                  color: theme.textColor,
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  className="w-full h-8 mb-2 rounded"
                  style={{
                    background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
                  }}
                />
                <div className="text-center">
                  <h3 className="font-medium">Sample Profile</h3>
                  <p className="text-sm opacity-80">This is how your profile colors will look</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout Options</CardTitle>
          <CardDescription>Choose the layout style for your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={profile.layout}
            onValueChange={(value) => handleThemeChange("layout", value)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="standard" id="layout-standard" className="sr-only" />
              <Label
                htmlFor="layout-standard"
                className="flex flex-col items-center gap-2 rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary"
              >
                <div className="w-full h-20 bg-muted rounded flex flex-col justify-center items-center">
                  <div className="w-8 h-8 rounded-full bg-primary mb-2" />
                  <div className="w-16 h-2 bg-muted-foreground/30 rounded" />
                  <div className="w-12 h-2 bg-muted-foreground/30 rounded mt-1" />
                </div>
                <span>Standard</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="compact" id="layout-compact" className="sr-only" />
              <Label
                htmlFor="layout-compact"
                className="flex flex-col items-center gap-2 rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary"
              >
                <div className="w-full h-20 bg-muted rounded flex flex-col justify-center items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary" />
                    <div className="w-12 h-2 bg-muted-foreground/30 rounded" />
                  </div>
                  <div className="w-20 h-2 bg-muted-foreground/30 rounded mt-2" />
                  <div className="w-16 h-2 bg-muted-foreground/30 rounded mt-1" />
                </div>
                <span>Compact</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="modern" id="layout-modern" className="sr-only" />
              <Label
                htmlFor="layout-modern"
                className="flex flex-col items-center gap-2 rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary"
              >
                <div className="w-full h-20 bg-muted rounded flex flex-col justify-center items-center">
                  <div className="w-full h-6 bg-primary mb-2" />
                  <div className="w-8 h-8 rounded-full bg-primary mb-1 -mt-6" />
                  <div className="w-16 h-2 bg-muted-foreground/30 rounded mt-2" />
                  <div className="w-12 h-2 bg-muted-foreground/30 rounded mt-1" />
                </div>
                <span>Modern</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Choose the font style for your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme.fontFamily}
            onValueChange={(value) => handleThemeChange("fontFamily", value)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="sans" id="font-sans" className="sr-only" />
              <Label
                htmlFor="font-sans"
                className="flex flex-col items-center gap-2 rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary"
              >
                <div className="w-full h-16 bg-muted rounded flex flex-col justify-center items-center p-2">
                  <span className="font-sans text-lg">Sans Serif</span>
                </div>
                <span>Sans Serif</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="serif" id="font-serif" className="sr-only" />
              <Label
                htmlFor="font-serif"
                className="flex flex-col items-center gap-2 rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary"
              >
                <div className="w-full h-16 bg-muted rounded flex flex-col justify-center items-center p-2">
                  <span className="font-serif text-lg">Serif</span>
                </div>
                <span>Serif</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="mono" id="font-mono" className="sr-only" />
              <Label
                htmlFor="font-mono"
                className="flex flex-col items-center gap-2 rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary"
              >
                <div className="w-full h-16 bg-muted rounded flex flex-col justify-center items-center p-2">
                  <span className="font-mono text-lg">Monospace</span>
                </div>
                <span>Monospace</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  )
}

