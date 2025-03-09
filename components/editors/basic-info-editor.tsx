"use client"

import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { CategorySelector } from "@/components/category-selector"
import { LayoutSelector } from "@/components/layout-selector"

export function BasicInfoEditor() {
  const { profile, updateProfile } = useProfile()

  if (!profile) return null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Basic information about your profile page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={profile.title}
              onChange={(e) => updateProfile({ title: e.target.value })}
              placeholder="My Awesome Profile"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={profile.slug}
              onChange={(e) => updateProfile({ slug: e.target.value })}
              placeholder="my-profile"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={profile.description}
              onChange={(e) => updateProfile({ description: e.target.value })}
              placeholder="A brief description of your profile"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how your profile looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Layout</Label>
            <LayoutSelector value={profile.layout} onChange={(layout) => updateProfile({ layout })} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <CategorySelector value={profile.category} onChange={(category) => updateProfile({ category })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibility</CardTitle>
          <CardDescription>Control who can see your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public Profile</Label>
              <p className="text-sm text-muted-foreground">Make your profile visible to everyone</p>
            </div>
            <Switch checked={profile.isPublic} onCheckedChange={(isPublic) => updateProfile({ isPublic })} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Featured Profile</Label>
              <p className="text-sm text-muted-foreground">Show your profile on the featured page</p>
            </div>
            <Switch checked={profile.isFeatured} onCheckedChange={(isFeatured) => updateProfile({ isFeatured })} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

