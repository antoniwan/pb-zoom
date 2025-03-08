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

