"use server"

export async function incrementProfileViews(profileId: string) {
  try {
    // For server actions, we need to use an absolute URL
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : ""

    await fetch(`${baseUrl}/api/profiles/${profileId}/views`, {
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

