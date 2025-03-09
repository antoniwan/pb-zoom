"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Profile } from "@/lib/db"

interface ProfileCardProps {
  profile: Profile
  onDelete: (id: string) => void
  onToggleVisibility: (id: string, isPublic: boolean) => void
}

export function ProfileCard({ profile, onDelete, onToggleVisibility }: ProfileCardProps) {
  const primaryPicture = profile.header.pictures.find((picture) => picture.isPrimary)

  return (
    <Card>
      <CardHeader className="relative">
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onToggleVisibility(profile._id!, profile.isPublic)}>
            {profile.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/profiles/${profile._id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(profile._id!)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full">
            <Image
              src={primaryPicture?.url || "/placeholder.svg"}
              alt={primaryPicture?.altText || "Profile picture"}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{profile.title}</h3>
            <p className="text-sm text-muted-foreground">{profile.header.title}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant={profile.isPublic ? "default" : "secondary"}>
            {profile.isPublic ? "Public" : "Private"}
          </Badge>
          <Badge variant="outline">{profile.layout}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

