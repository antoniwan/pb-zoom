"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { Plus, Check, Briefcase, Gamepad, Palette, GraduationCap, Heart, Users, Sparkles } from "lucide-react"
import type { Category } from "@/lib/db"

interface CategorySelectorProps {
  selectedCategoryId: string | undefined
  onSelect: (categoryId: string | undefined) => void
}

export function CategorySelector({ selectedCategoryId, onSelect }: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "",
    color: "#1d4ed8", // Default to blue-700
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/categories")

      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }

      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("Failed to load categories")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitNewCategory = async () => {
    try {
      setIsSubmitting(true)

      if (!newCategory.name.trim()) {
        toast({
          title: "Error",
          description: "Category name is required",
          variant: "destructive",
        })
        return
      }

      if (!newCategory.description.trim() || newCategory.description.length < 10) {
        toast({
          title: "Error",
          description: "Please provide a description of at least 10 characters",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create category")
      }

      toast({
        title: "Success",
        description: data.message,
      })

      // Reset form
      setNewCategory({
        name: "",
        description: "",
        icon: "",
        color: "#1d4ed8",
      })

      // Close dialog
      setIsDialogOpen(false)

      // Refresh categories
      fetchCategories()
    } catch (error) {
      console.error("Error creating category:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to get icon component based on category name or icon field
  const getCategoryIcon = (category: Category) => {
    const name = category.name.toLowerCase()

    if (name.includes("professional") || name.includes("work") || name.includes("business")) {
      return <Briefcase className="h-5 w-5" />
    } else if (name.includes("gaming") || name.includes("game")) {
      return <Gamepad className="h-5 w-5" />
    } else if (name.includes("creative") || name.includes("art")) {
      return <Palette className="h-5 w-5" />
    } else if (name.includes("academic") || name.includes("education")) {
      return <GraduationCap className="h-5 w-5" />
    } else if (name.includes("personal") || name.includes("dating")) {
      return <Heart className="h-5 w-5" />
    } else if (name.includes("social") || name.includes("community")) {
      return <Users className="h-5 w-5" />
    } else {
      return <Sparkles className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchCategories} className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Select a Category</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Suggest New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Suggest a New Category</DialogTitle>
              <DialogDescription>
                Create a new profile category to help organize your profiles. Your suggestion will be reviewed before
                being made available to all users.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g., Professional, Gaming, Creative"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Describe what this category is for and how it should be used"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">Min. 10 characters. Be clear and concise.</p>
              </div>
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {["#1d4ed8", "#4338ca", "#0369a1", "#047857", "#b91c1c", "#7e22ce", "#c2410c", "#0f172a"].map(
                    (color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${newCategory.color === color ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCategory({ ...newCategory, color })}
                        aria-label={`Select color ${color}`}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmitNewCategory} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No categories available yet. Be the first to suggest one!</p>
          </CardContent>
        </Card>
      ) : (
        <RadioGroup
          value={selectedCategoryId || ""}
          onValueChange={onSelect}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category) => (
            <div key={category._id} className="relative">
              <RadioGroupItem value={category._id || ""} id={category._id || ""} className="peer sr-only" />
              <Label
                htmlFor={category._id || ""}
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-full"
                    style={{ backgroundColor: category.color ? `${category.color}20` : "#1d4ed820" }}
                  >
                    {getCategoryIcon(category)}
                  </div>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{category.description}</p>
                  </div>
                </div>
                {selectedCategoryId === category._id && (
                  <div className="absolute top-2 right-2 h-4 w-4 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      <div className="bg-muted p-4 rounded-xl">
        <h4 className="font-medium mb-2">Why categorize your profile?</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
          <li>Makes your profile easier to discover</li>
          <li>Helps visitors understand the purpose of your profile</li>
          <li>Allows for better organization of multiple profiles</li>
          <li>Enables themed styling based on category</li>
        </ul>
      </div>
    </div>
  )
}

