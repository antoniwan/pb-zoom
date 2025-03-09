import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

type RateLimitOptions = {
  limit: number
  window: number // in seconds
  identifier?: string
}

// Initialize Redis client (you'll need to add @upstash/redis to your dependencies)
let redis: Redis | null = null

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
} catch (error) {
  console.error("Failed to initialize Redis client:", error)
}

export async function rateLimit(
  req: NextRequest,
  options: RateLimitOptions,
): Promise<{ success: true } | { success: false; response: NextResponse }> {
  // If Redis is not available, allow the request
  if (!redis) {
    return { success: true }
  }

  const { limit, window, identifier } = options

  // Get IP address or custom identifier
  const ip = req.ip || "anonymous"
  const key = `rate-limit:${identifier || req.nextUrl.pathname}:${ip}`

  // Get the current count
  const count = await redis.incr(key)

  // Set expiry on first request
  if (count === 1) {
    await redis.expire(key, window)
  }

  // Set headers with rate limit info
  const headers = new Headers()
  headers.set("X-RateLimit-Limit", limit.toString())
  headers.set("X-RateLimit-Remaining", Math.max(0, limit - count).toString())

  // If over limit, return error response
  if (count > limit) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: "too_many_requests",
          message: "Rate limit exceeded",
        },
        {
          status: 429,
          headers,
        },
      ),
    }
  }

  return { success: true }
}

