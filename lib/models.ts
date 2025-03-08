export interface Profile {
  _id: string
  userId: string
  title: string
  slug: string
  isPublic: boolean
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    customCSS?: string
  }
  layout: string
  sections: ProfileSection[]
  socialLinks: ProfileSocial[]
  createdAt: Date
  updatedAt: Date
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

