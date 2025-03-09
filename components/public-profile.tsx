"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Share2,
  Mail,
  MapPin,
  Link2,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Download,
  Copy,
  Check,
} from "lucide-react"
import type { Profile, ProfileSection } from "@/lib/db"
import ReactMarkdown from "react-markdown"

interface PublicProfileProps {
  profile: Profile
}

export function PublicProfile({ profile }: PublicProfileProps) {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)

    // Set the first section as active by default
    if (profile.sections.length > 0) {
      setActiveSection(profile.sections[0]._id)
    }

    // Apply theme to document if available
    if (profile.theme) {
      document.documentElement.style.setProperty("--profile-bg", profile.theme.backgroundColor || "#ffffff")
      document.documentElement.style.setProperty("--profile-text", profile.theme.textColor || "#000000")
      document.documentElement.style.setProperty("--profile-primary", profile.theme.primaryColor || "#3b82f6")
      document.documentElement.style.setProperty("--profile-secondary", profile.theme.secondaryColor || "#6b7280")
      document.documentElement.style.setProperty("--profile-accent", profile.theme.accentColor || "#f59e0b")
    }

    return () => {
      // Reset custom properties when component unmounts
      document.documentElement.style.removeProperty("--profile-bg")
      document.documentElement.style.removeProperty("--profile-text")
      document.documentElement.style.removeProperty("--profile-primary")
      document.documentElement.style.removeProperty("--profile-secondary")
      document.documentElement.style.removeProperty("--profile-accent")
    }
  }, [profile])

  if (!mounted) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getSocialIcon = (platform: string) => {
    const iconProps = { className: "h-5 w-5" }

    switch (platform.toLowerCase()) {
      case "github":
        return <Github {...iconProps} />
      case "linkedin":
        return <Linkedin {...iconProps} />
      case "twitter":
        return <Twitter {...iconProps} />
      case "instagram":
        return <Instagram {...iconProps} />
      case "facebook":
        return <Facebook {...iconProps} />
      case "youtube":
        return <Youtube {...iconProps} />
      default:
        return <ExternalLink {...iconProps} />
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.title,
          text: profile.subtitle || "Check out my profile",
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      handleCopyLink()
    }
  }

  const renderSection = (section: ProfileSection) => {
    switch (section.type) {
      case "bio":
        return (
          <Card key={section._id} className="mb-8 bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl md:text-2xl font-bold">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed">{section.content.text}</p>
            </CardContent>
          </Card>
        )

      case "attributes":
        return (
          <Card key={section._id} className="mb-8 bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl md:text-2xl font-bold">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {section.content.attributes?.map((attribute, index) => (
                  <motion.div
                    key={attribute._id || index}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{attribute.label}</span>
                      <span className="text-sm text-muted-foreground">{attribute.value}</span>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded-full bg-secondary/20">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${Number.parseInt(attribute.value) || 75}%` }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "gallery":
        return (
          <Card key={section._id} className="mb-8 bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl md:text-2xl font-bold">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {section.content.images?.map((image, index) => (
                  <motion.div
                    key={index}
                    className="aspect-square relative rounded-lg overflow-hidden shadow-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Image
                      src={image.url || `/placeholder.svg?height=300&width=300`}
                      alt={image.alt || "Gallery image"}
                      fill
                      className="object-cover transition-transform"
                    />
                    {image.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white p-2 text-sm">
                        {image.caption}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "markdown":
        return (
          <Card key={section._id} className="mb-8 bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl md:text-2xl font-bold">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert prose-headings:text-primary prose-a:text-primary">
                <ReactMarkdown>{section.content.markdown || ""}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )

      case "videos":
        return (
          <Card key={section._id} className="mb-8 bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl md:text-2xl font-bold">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {section.content.videos?.map((video, index) => (
                  <div key={index} className="space-y-2">
                    <div className="aspect-video relative rounded-lg overflow-hidden shadow-md">
                      <iframe
                        src={video.url}
                        title={video.title || `Video ${index + 1}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                    {video.title && <h3 className="font-medium text-lg">{video.title}</h3>}
                    {video.description && <p className="text-sm text-muted-foreground">{video.description}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "custom":
        return (
          <Card key={section._id} className="mb-8 bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl md:text-2xl font-bold">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: section.content.html || "" }} />
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div
      className="min-h-screen"
      style={
        {
          backgroundColor: "var(--profile-bg, #ffffff)",
          color: "var(--profile-text, #000000)",
          "--tw-primary": "var(--profile-primary, #3b82f6)",
          "--tw-primary-foreground": "#ffffff",
        } as React.CSSProperties
      }
    >
      {/* Header/Cover Image */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full">
        {profile.header?.coverImage ? (
          <Image
            src={profile.header.coverImage || "/placeholder.svg"}
            alt="Cover"
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 mb-12">
          <div className="bg-card/80 backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.header?.avatarImage} alt={profile.title} />
                  <AvatarFallback className="text-3xl">{getInitials(profile.title || "User Profile")}</AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <motion.h1
                      className="text-3xl md:text-4xl font-bold"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {profile.title}
                    </motion.h1>
                    <motion.p
                      className="text-xl text-muted-foreground mt-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      {profile.subtitle}
                    </motion.p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyLink}>
                      {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                      {copied ? "Copied!" : "Copy Link"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                <motion.div
                  className="flex flex-wrap gap-2 mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {profile.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {profile.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-primary" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="mr-2 h-4 w-4 text-primary" />
                      <a href={`mailto:${profile.email}`} className="hover:underline">
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center text-sm">
                      <Link2 className="mr-2 h-4 w-4 text-primary" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center"
                      >
                        {profile.website.replace(/^https?:\/\//, "")}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
              </motion.div>
            )}

            {/* Social Links */}
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Separator className="mb-4" />
                <div className="flex flex-wrap gap-3">
                  {profile.socialLinks.map((link, index) => (
                    <Button key={index} variant="outline" size="sm" asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        {getSocialIcon(link.platform)}
                        <span>{link.platform}</span>
                      </a>
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation for sections on mobile */}
        {profile.sections.length > 1 && (
          <div className="mb-8 overflow-x-auto pb-2 md:hidden">
            <div className="flex gap-2 min-w-max">
              {profile.sections.map((section) => (
                <Button
                  key={section._id}
                  variant={activeSection === section._id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setActiveSection(section._id)
                    document.getElementById(section._id)?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  {section.title}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Sections */}
          <div className="md:col-span-2">
            <AnimatePresence>
              {profile.sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <motion.div
                    key={section._id}
                    id={section._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {renderSection(section)}
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="hidden md:block">
            <div className="sticky top-8">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {profile.sections.map((section) => (
                      <Button
                        key={section._id}
                        variant="ghost"
                        className={`w-full justify-start ${
                          activeSection === section._id ? "bg-primary/10 text-primary" : ""
                        }`}
                        onClick={() => {
                          setActiveSection(section._id)
                          document.getElementById(section._id)?.scrollIntoView({ behavior: "smooth" })
                        }}
                      >
                        {section.title}
                      </Button>
                    ))}
                  </nav>
                </CardContent>
              </Card>

              {profile.resume && (
                <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg">
                  <CardContent className="pt-6">
                    <Button className="w-full" asChild>
                      <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download Resume
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {profile.title}. All rights reserved.
          </p>
          <p className="mt-1">
            Created with{" "}
            <Link href="/" className="text-primary hover:underline">
              ProfileBuilderX
            </Link>
          </p>
        </footer>
      </div>
    </div>
  )
}

