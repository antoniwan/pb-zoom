export interface ProfileHeader {
  name: string
  title: string
  subtitle: string
  shortBio: string
  pictures: ProfilePicture[]
}

export interface ProfilePicture {
  url: string
  altText?: string
  isPrimary: boolean
}

export interface Profile {
  _id: string
  userId: string
  title: string
  slug: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  categoryId?: string // New field to reference a category
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    customCSS?: string
  }
  layout: string
  header: ProfileHeader
  sections: ProfileSection[]
  socialLinks: ProfileSocial[]
}

export interface ProfileSection {
  _id: string
  type: "bio" | "attributes" | "gallery" | "videos" | "markdown" | "custom"
  title: string
  content: {
    text?: string
    attributes?: ProfileAttribute[]
    images?: ProfileImage[]
    videos?: ProfileVideo[]
    markdown?: string
    html?: string
  }
  order: number
}

export interface ProfileAttribute {
  label: string
  value: string
}

export interface ProfileImage {
  url: string
  caption?: string
}

export interface ProfileVideo {
  url: string
  title?: string
}

export interface ProfileSocial {
  platform: string
  url: string
  icon?: string
}

// New interface for profile categories
export interface ProfileCategory {
  _id: string
  name: string
  description: string
  icon?: string // For visual representation
  color?: string // For visual styling
  isEnabled: boolean // For moderation
  isCorrect: boolean // For moderation/verification
  isOfficial: boolean // To distinguish between system and user-created categories
  createdBy: string // User ID of creator
  createdAt: Date
  updatedAt: Date
  usageCount?: number // Track popularity
}

