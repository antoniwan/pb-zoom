/**
 * Application configuration
 * Centralizes all configuration values and provides type safety
 */

// Site configuration
export const siteConfig = {
  name: "ProfileBuilderX",
  description: "Create and share professional profiles",
  url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/profilebuilderx",
    github: "https://github.com/profilebuilderx",
  },
}

// Feature flags
export const featureFlags = {
  enableCategories: true,
  enableAnalytics: process.env.NODE_ENV === "production",
  enableCustomDomains: false,
  enablePremiumFeatures: false,
}

// Limits
export const limits = {
  freeProfiles: 3,
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxSections: 10,
}

// Theme configuration
export const themeConfig = {
  defaultTheme: "system" as const,
  availableFonts: [
    { name: "Inter", value: "font-sans" },
    { name: "Roboto", value: "font-roboto" },
    { name: "Merriweather", value: "font-serif" },
    { name: "Montserrat", value: "font-montserrat" },
    { name: "Poppins", value: "font-poppins" },
  ],
  defaultColors: {
    background: "#ffffff",
    text: "#333333",
    primary: "#3b82f6",
    secondary: "#6b7280",
    accent: "#f59e0b",
  },
}

// API configuration
export const apiConfig = {
  baseUrl: "/api",
  defaultPageSize: 10,
  maxPageSize: 100,
}

