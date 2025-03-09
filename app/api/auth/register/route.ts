import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import clientPromise from "@/lib/mongodb"
import { z } from "zod"

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Username can only contain letters, numbers, underscores and hyphens",
    }),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, username, password } = userSchema.parse(body)

    const client = await clientPromise
    const db = client.db()

    // Check if user already exists with this email
    const existingUserEmail = await db.collection("users").findOne({ email })
    if (existingUserEmail) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
    }

    // Check if username is already taken
    const existingUsername = await db.collection("users").findOne({ username })
    if (existingUsername) {
      return NextResponse.json({ message: "Username is already taken" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const now = new Date()
    const result = await db.collection("users").insertOne({
      name,
      email,
      username,
      password: hashedPassword,
      bio: "",
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json({ message: "User created successfully", userId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input data", errors: error.errors }, { status: 400 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

