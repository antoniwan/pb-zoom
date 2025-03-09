import useSWR from "swr"
import type { Profile } from "@/lib/types/profile"

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    })
    .then((data) => data.data)

/**
 * Hook to fetch user profiles
 */
export function useProfiles() {
  const { data, error, isLoading, mutate } = useSWR<Profile[]>("/api/profiles", fetcher)

  return {
    profiles: data || [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

/**
 * Hook to fetch a single profile by ID
 */
export function useProfile(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Profile>(id ? `/api/profiles/${id}` : null, fetcher)

  return {
    profile: data,
    isLoading,
    isError: !!error,
    mutate,
  }
}

/**
 * Hook to fetch a profile by slug
 */
export function useProfileBySlug(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Profile>(slug ? `/api/profiles/slug/${slug}` : null, fetcher)

  return {
    profile: data,
    isLoading,
    isError: !!error,
    mutate,
  }
}

