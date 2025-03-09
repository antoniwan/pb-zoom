"use client"

import { useState } from "react"
import { useProfile } from "@/components/profile-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings2, Layout, Palette, Link2, User2, Menu } from "lucide-react"

import { BasicInfoEditor } from "@/components/editors/basic-info-editor"
import { HeaderEditor } from "@/components/editors/header-editor"
import { ThemeEditor } from "@/components/editors/theme-editor"
import { SocialEditor } from "@/components/editors/social-editor"
import { SectionsEditor } from "@/components/editors/sections-editor"

interface NavItemProps {
  icon: React.ReactNode
  label: string
  value: string
  isActive: boolean
  onClick: () => void
}

function NavItem({ icon, label, value, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full p-3 text-sm font-medium rounded-lg transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  )
}

export function ProfileEditor() {
  const [activeTab, setActiveTab] = useState("basic")
  const { profile } = useProfile()

  const navItems = [
    { icon: <Settings2 className="h-4 w-4" />, label: "Basic Info", value: "basic" },
    { icon: <User2 className="h-4 w-4" />, label: "Header", value: "header" },
    { icon: <Palette className="h-4 w-4" />, label: "Theme", value: "theme" },
    { icon: <Link2 className="h-4 w-4" />, label: "Social", value: "social" },
    { icon: <Layout className="h-4 w-4" />, label: "Sections", value: "sections" },
  ]

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute top-4 left-4 md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <nav className="space-y-2 pt-16">
            {navItems.map((item) => (
              <NavItem
                key={item.value}
                {...item}
                isActive={activeTab === item.value}
                onClick={() => setActiveTab(item.value)}
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col gap-2 w-72 p-6 border-r">
        {navItems.map((item) => (
          <NavItem
            key={item.value}
            {...item}
            isActive={activeTab === item.value}
            onClick={() => setActiveTab(item.value)}
          />
        ))}
      </nav>

      {/* Content Area */}
      <main className="flex-1 p-6 pt-16 md:pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Edit Profile</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(`/p/${profile?.slug}`, "_blank")}
              >
                Preview
              </Button>
              <Button>Publish</Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="basic">
              <BasicInfoEditor />
            </TabsContent>
            <TabsContent value="header">
              <HeaderEditor />
            </TabsContent>
            <TabsContent value="theme">
              <ThemeEditor />
            </TabsContent>
            <TabsContent value="social">
              <SocialEditor />
            </TabsContent>
            <TabsContent value="sections">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <SectionsEditor />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

