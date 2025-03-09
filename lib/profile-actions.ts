"use server"

export async function incrementProfileViews(profileId: string) {
  try {
    // In a real implementation, this would directly update your database
    // For now, we'll use the API route but with a relative path
    await fetch(`/api/profiles/${profileId}/views`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
  } catch (error) {
    console.error("Error incrementing profile views:", error)
  }
}

