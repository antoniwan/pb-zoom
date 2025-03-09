import { cache } from "react"
import { getProfile, getProfileBySlug, getCategories } from "@/lib/db"

/**
 * Cached version of getProfile
 * This uses React's cache function to deduplicate requests
 */
export const getCachedProfile = cache(async (id: string) => {
  return getProfile(id)
})

/**
 * Cached version of getProfileBySlug
 */
export const getCachedProfileBySlug = cache(async (slug: string) => {
  return getProfileBySlug(slug)
})

/**
 * Cached version of getCategories
 */
export const getCachedCategories = cache(async (options = {}) => {
  return getCategories(options)
})

