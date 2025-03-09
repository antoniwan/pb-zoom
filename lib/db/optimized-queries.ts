import { getDb } from "../mongodb"

/**
 * Get profiles with optimized fields for listing
 * This returns only the fields needed for profile cards
 */
export async function getProfilesListing(userId: string) {
  const db = await getDb()

  return db
    .collection("profiles")
    .find({ userId })
    .project({
      _id: 1,
      title: 1,
      subtitle: 1,
      slug: 1,
      isPublic: 1,
      viewCount: 1,
      completionPercentage: 1,
      updatedAt: 1,
      "header.avatarImage": 1,
    })
    .sort({ updatedAt: -1 })
    .toArray()
}

/**
 * Get profile stats for dashboard
 */
export async function getProfileStats(userId: string) {
  const db = await getDb()

  const [profilesCount, viewsCount, publicCount] = await Promise.all([
    db.collection("profiles").countDocuments({ userId }),
    db
      .collection("profiles")
      .aggregate([{ $match: { userId } }, { $group: { _id: null, totalViews: { $sum: "$viewCount" } } }])
      .toArray(),
    db.collection("profiles").countDocuments({ userId, isPublic: true }),
  ])

  return {
    totalProfiles: profilesCount,
    totalViews: viewsCount[0]?.totalViews || 0,
    publicProfiles: publicCount,
  }
}

/**
 * Get popular profiles
 */
export async function getPopularProfiles(limit = 5) {
  const db = await getDb()

  return db
    .collection("profiles")
    .find({ isPublic: true })
    .sort({ viewCount: -1 })
    .limit(limit)
    .project({
      _id: 1,
      title: 1,
      subtitle: 1,
      slug: 1,
      viewCount: 1,
      "header.avatarImage": 1,
    })
    .toArray()
}

