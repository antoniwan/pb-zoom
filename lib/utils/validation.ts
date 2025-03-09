import { z } from "zod"

// Common validation schemas
export const emailSchema = z.string().email("Invalid email address")

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")

export const slugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .max(50, "Slug must be at most 50 characters")
  .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")

export const urlSchema = z.string().url("Invalid URL").or(z.literal("")).optional()

// Validation helper functions
export function validateEmail(email: string) {
  return emailSchema.safeParse(email)
}

export function validatePassword(password: string) {
  return passwordSchema.safeParse(password)
}

export function validateUsername(username: string) {
  return usernameSchema.safeParse(username)
}

export function validateSlug(slug: string) {
  return slugSchema.safeParse(slug)
}

export function validateUrl(url: string) {
  return urlSchema.safeParse(url)
}

