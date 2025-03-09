"use client"

import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "@/components/image-uploader"

export function HeaderEditor() {
  const { profile, updateProfile } = useProfile()

  if (!profile) return null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Header</CardTitle>
          <CardDescription>
            Your name, title, and bio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              value={profile.title}
              onChange={(e) => updateProfile({ title: e.target.value })}
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => updateProfile({ bio: e.target.value })}
              placeholder="Tell us about yourself"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Images</CardTitle>
          <CardDescription>
            Your profile picture and cover image
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <ImageUploader
              value={profile.avatar}
              onChange={(avatar) => updateProfile({ avatar })}
              aspectRatio="square"
              maxSize={2}
              description="Upload a square image (2MB max)"
            />
          </div>
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <ImageUploader
              value={profile.coverImage}
              onChange={(coverImage) => updateProfile({ coverImage })}
              aspectRatio="wide"
              maxSize={5}
              description="Upload a wide image (5MB max)"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 