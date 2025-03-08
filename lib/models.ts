export interface User {
  _id: string
  name: string
  email: string
  image?: string
  password?: string
  createdAt: Date
  updatedAt: Date
}

export interface Profile {
  _id: string
  userId: string
  title: string
  slug: string
  isPublic: boolean
  theme: ProfileTheme
  layout: string
  sections: ProfileSection[]
  socialLinks: ProfileSocial[]
  createdAt: Date
  updatedAt: Date
}

export interface ProfileTheme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  customCSS?: string
}

export interface ProfileSection {
  _id: string
  type: "bio" | "attributes" | "gallery" | "videos" | "markdown" | "custom"
  title: string
  content: any
  order: number
}

export interface ProfileSocial {
  platform: string
  url: string
  icon?: string
}

export interface ProfileMedia {
  _id: string
  profileId: string
  type: "image" | "video"
  url: string
  title?: string
  description?: string
  createdAt: Date
}

