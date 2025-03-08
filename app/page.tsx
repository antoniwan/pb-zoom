import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Profile Builder</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium hover:underline">
              Sign In
            </Link>
            <Button asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-gray-50 py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Create Your Personal Profile
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
              Build, customize, and share your personal profile page with the world. Showcase your skills, projects, and
              personality in one place.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/register">Create Your Profile</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Customizable Profiles</CardTitle>
                  <CardDescription>Create a profile that matches your style and personality.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Choose from various themes, layouts, and customization options to make your profile unique. Add your
                    personal touch with custom CSS.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Flexible Content Sections</CardTitle>
                  <CardDescription>Organize your content in a way that makes sense for you.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Add bio, skills, gallery, videos, and custom sections. Arrange them in any order you want. Use
                    Markdown for rich text formatting.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Easy Sharing</CardTitle>
                  <CardDescription>Share your profile with anyone, anywhere.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Get a custom URL for your profile that you can share on social media, in your resume, or with
                    potential employers and collaborators.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Popular Profiles</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* This would be populated with actual popular profiles */}
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>Example Profile {i}</CardTitle>
                    <CardDescription>A sample profile showcasing the possibilities.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 rounded-md bg-muted"></div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/p/example-${i}`}>View Profile</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Profile Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

