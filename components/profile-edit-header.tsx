"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useProfile } from "@/components/profile-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Eye, Save, Loader2 } from "lucide-react"

export function ProfileEditHeader() {
  const { profile, updateProfile, saveProfile, isSaving } = useProfile()
  const [title, setTitle] = useState(profile.title)
  const [isPublic, setIsPublic] = useState(profile.isPublic)
  const [isDebouncing, setIsDebouncing] = useState(false)

  // Update title with debounce
  useEffect(() => {
    if (title !== profile.title) {
      setIsDebouncing(true)
      const timer = setTimeout(() => {
        updateProfile({ title })
        setIsDebouncing(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [title, profile.title, updateProfile])

  // Update public status immediately
  useEffect(() => {
    if (isPublic !== profile.isPublic) {
      updateProfile({ isPublic })
    }
  }, [isPublic, profile.isPublic, updateProfile])

  const handleSave = async () => {
    const success = await saveProfile()
    if (success) {
      toast({
        title: "Profile saved",
        description: "Your profile has been saved successfully.",
      })
    }
  }

  const handlePreview = () => {
    // Save before preview
    saveProfile().then((success: boolean) => {
      if (success) {
        window.open(`/dashboard/profiles/${profile._id}/preview`, "_blank")
      }
    })
  }

  return (
    <header className="sticky top-0 z-10 bg-background border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>

          <div className="flex items-center gap-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-medium text-lg h-9 w-[300px] border-transparent hover:border-input focus:border-input"
              placeholder="Profile Title"
            />
            {isDebouncing && (
              <Badge variant="outline" className="animate-pulse">
                Saving...
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch id="public-mode" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="public-mode" className="text-sm">
              {isPublic ? "Public" : "Private"}
            </Label>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>

          <Button onClick={handleSave} disabled={isSaving} size="sm">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}

