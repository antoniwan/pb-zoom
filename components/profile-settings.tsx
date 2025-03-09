"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettings } from "./general-settings"
import { ThemeSettings } from "./theme-settings"
import { SeoSettings } from "./seo-settings"
import { CategorySettings } from "./category-settings"

export function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Customize your profile settings and appearance</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="theme" className="mt-6">
          <ThemeSettings />
        </TabsContent>

        <TabsContent value="seo" className="mt-6">
          <SeoSettings />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategorySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

