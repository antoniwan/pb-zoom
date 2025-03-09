/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string | Date, options: Intl.DateTimeFormatOptions = {}) {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(date)
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number) {
  return new Intl.NumberFormat("en-US").format(num)
}

/**
 * Truncate a string to a specified length
 */
export function truncate(str: string, length: number) {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

/**
 * Convert a string to title case
 */
export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

/**
 * Generate a slug from a string
 */
export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
}

