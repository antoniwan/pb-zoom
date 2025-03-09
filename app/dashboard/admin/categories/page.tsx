"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import {
  AlertTriangle,
  Check,
  X,
  Edit,
  Trash2,
  Briefcase,
  Gamepad,
  Palette,
  GraduationCap,
  Heart,
  Users,
  Sparkles,
} from "lucide-react"
import type { Category } from "@/lib/db"

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (status === "authenticated") {
      // Check if user is admin
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      if (session?.user?.email === adminEmail) {
        setIsAdmin(true)
        fetchCategories()
      } else {
        router.push("/dashboard")
      }
    }
  }, [status, router, session])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/categories?includeDisabled=true&includeIncorrect=true")

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

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory._id) return

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/categories/${editingCategory._id.toString()}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingCategory.name,
          description: editingCategory.description,
          icon: editingCategory.icon,
          color: editingCategory.color,
          isEnabled: editingCategory.isEnabled,
          isCorrect: editingCategory.isCorrect,
          isOfficial: editingCategory.isOfficial,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update category")
      }

      toast({
        title: "Success",
        description: "Category updated successfully",
      })

      // Close dialog
      setIsDialogOpen(false)

      // Refresh categories
      fetchCategories()
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category")
      }

      toast({
        title: "Success",
        description: "Category deleted successfully",
      })

      // Refresh categories
      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const handleToggleEnabled = async (id: string, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isEnabled: !currentValue,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update category")
      }

      toast({
        title: "Success",
        description: `Category ${!currentValue ? "enabled" : "disabled"} successfully`,
      })

      // Refresh categories
      fetchCategories()
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category",
        variant: "destructive",
      })
    }
  }

  const handleToggleCorrect = async (id: string, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isCorrect: !currentValue,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update category")
      }

      toast({
        title: "Success",
        description: `Category marked as ${!currentValue ? "correct" : "incorrect"}`,
      })

      // Refresh categories
      fetchCategories()
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category",
        variant: "destructive",
      })
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

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">You do not have permission to access this page.</p>
          <Button asChild className="mt-4">
            <a href="/dashboard">Back to Dashboard</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Categories</h1>
          <p className="text-muted-foreground">Review, approve, and manage profile categories</p>
        </div>
        <Button onClick={fetchCategories}>Refresh</Button>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-500">
          <p>{error}</p>
          <Button onClick={fetchCategories} variant="outline" size="sm" className="mt-2">
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category._id?.toString()} className={`${!category.isEnabled ? "border-muted bg-muted/50" : ""}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="p-2 rounded-full"
                    style={{ backgroundColor: category.color ? `${category.color}20` : "#1d4ed820" }}
                  >
                    {getCategoryIcon(category)}
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingCategory(category)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteCategory(category._id?.toString() || '')}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <CardDescription className="line-clamp-2">{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="flex items-center mt-1">
                    <div
                      className={`h-2 w-2 rounded-full mr-2 ${category.isEnabled ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <p>{category.isEnabled ? "Enabled" : "Disabled"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Verification</p>
                  <div className="flex items-center mt-1">
                    <div
                      className={`h-2 w-2 rounded-full mr-2 ${category.isCorrect ? "bg-green-500" : "bg-yellow-500"}`}
                    ></div>
                    <p>{category.isCorrect ? "Verified" : "Unverified"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p>{category.isOfficial ? "Official" : "User-created"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Usage</p>
                  <p>{category.usageCount || 0} profiles</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleEnabled(category._id?.toString() || '', category.isEnabled)}
              >
                {category.isEnabled ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Disable
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Enable
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleCorrect(category._id?.toString() || '', category.isCorrect || false)}
              >
                {category.isCorrect ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Mark Incorrect
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Mark Correct
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingCategory(category)
                  setIsDialogOpen(true)
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteCategory(category._id?.toString() || '')}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category details. Changes will be immediately visible to users.
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {["#1d4ed8", "#4338ca", "#0369a1", "#047857", "#b91c1c", "#7e22ce", "#c2410c", "#0f172a"].map(
                    (color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${editingCategory.color === color ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setEditingCategory({ ...editingCategory, color })}
                        aria-label={`Select color ${color}`}
                      />
                    ),
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-enabled"
                    checked={editingCategory.isEnabled}
                    onCheckedChange={(checked) => setEditingCategory({ ...editingCategory, isEnabled: checked })}
                  />
                  <Label htmlFor="edit-enabled">Enabled</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-correct"
                    checked={editingCategory.isCorrect}
                    onCheckedChange={(checked) => setEditingCategory({ ...editingCategory, isCorrect: checked })}
                  />
                  <Label htmlFor="edit-correct">Correct</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-official"
                    checked={editingCategory.isOfficial}
                    onCheckedChange={(checked) => setEditingCategory({ ...editingCategory, isOfficial: checked })}
                  />
                  <Label htmlFor="edit-official">Official</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateCategory} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

