export interface User {
  _id: string
  name: string
  email: string
  username: string // New field for public URL
  bio?: string
  image?: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface ProfileSection {
  _id: string
  type: string
  title: string
  content: Record<string, unknown>
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

export interface ProfileSocial {
  platform: string
  url: string
}

