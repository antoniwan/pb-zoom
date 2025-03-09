// Re-export all types from their respective files
export * from "./profile"
export * from "./user"
export * from "./category"
export * from "./api"

// Common types used across the application
export type PaginationParams = {
  page?: number
  limit?: number
}

export type SortParams = {
  field: string
  direction: "asc" | "desc"
}

export type FilterParams = {
  [key: string]: string | number | boolean | undefined
}

export type QueryParams = PaginationParams & {
  sort?: SortParams
  filters?: FilterParams
  search?: string
}

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    [key: string]: any
  }
}

