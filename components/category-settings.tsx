"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/components/profile-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Category } from "@/lib/db"

export function CategorySettings() {
  const { profile, updateProfile, categories } = useProfile()
  const [selectedCategories, setSelectedCategories] = useState<string[]>(profile.categoryIds || [])

  useEffect(() => {
    updateProfile({ categoryIds: selectedCategories })
  }, [selectedCategories, updateProfile])

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Categories</CardTitle>
          <CardDescription>Categorize your profile to help others find it</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-muted-foreground mb-4">No categories available</p>
              <Button variant="outline" asChild>
                <a href="/dashboard/categories">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Categories
                </a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category: Category) => (
                <div key={category._id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`category-${category._id}`}
                    checked={selectedCategories.includes(category._id || "")}
                    onCheckedChange={() => handleCategoryToggle(category._id || "")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={`category-${category._id}`} className="flex items-center gap-2 cursor-pointer">
                      {category.name}
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    </Label>
                    {category.description && <p className="text-sm text-muted-foreground">{category.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

