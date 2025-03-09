export interface ProfileAttribute {
  _id: string
  label: string
  value: string
}

export interface ProfileImage {
  url: string
  alt?: string
  caption?: string
}

export interface ProfileVideo {
  url: string
  title?: string
  description?: string
}

export interface ProfileSocial {
  platform: string
  url: string
}

export interface ProfileSection {
  _id: string
  type: string
  title: string
  content: {
    text: string
    attributes: ProfileAttribute[]
    images: ProfileImage[]
    videos: ProfileVideo[]
    markdown: string
    html: string
  }
  order: number
}

export interface Profile {
  _id: string
  slug: string
  title: string
  subtitle?: string
  bio?: string
  isPublic: boolean
  completionPercentage?: number
  viewCount?: number
  tags?: string[]
  location?: string
  email?: string
  website?: string
  resume?: string
  socialLinks?: ProfileSocial[]
  header?: {
    avatarImage?: string
    coverImage?: string
  }
  theme?: {
    backgroundColor?: string
    textColor?: string
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
  }
  sections: ProfileSection[]
  updatedAt?: string
  userId?: string
}

