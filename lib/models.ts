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
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    customCSS?: string
  }
  layout: string
  header: ProfileHeader // New field for the complex title system
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

