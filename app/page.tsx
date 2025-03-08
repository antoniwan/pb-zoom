import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Sparkles, Users, Layout } from "lucide-react"
import { MainNav } from "@/components/main-nav"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-secondary/40 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Create your professional{" "}
                  <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    profile
                  </span>{" "}
                  in minutes
                </h1>
                <p className="text-xl text-muted-foreground">
                  Build, customize, and share your personal profile page with the world.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="px-8 rounded-full" asChild>
                    <Link href="/auth/register">Get Started</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full" asChild>
                    <Link href="#features">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-primary" /> Free to start
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-primary" /> No credit card required
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-2xl shadow-lg overflow-hidden border border-secondary">
                  <img src="/placeholder.svg?height=500&width=600" alt="Ñ Dashboard" className="w-full h-auto" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform gives you all the tools to create a professional online presence.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="rounded-xl border-secondary/30">
                <CardHeader className="space-y-1">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Beautiful Themes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Choose from pre-designed themes or create your own with custom colors, fonts, and layouts.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-secondary/30">
                <CardHeader className="space-y-1">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Layout className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Flexible Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Add bio, skills, gallery, videos, and custom sections. Arrange them exactly how you want.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-secondary/30">
                <CardHeader className="space-y-1">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Easy Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get a custom URL for your profile and share it with potential employers, clients, or your network.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-accent/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Create your profile in three simple steps
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="relative">
                <div className="absolute -left-3 -top-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  1
                </div>
                <Card className="h-full rounded-xl border-secondary/30">
                  <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Create your account with email or sign in with Google or GitHub.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="absolute -left-3 -top-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  2
                </div>
                <Card className="h-full rounded-xl border-secondary/30">
                  <CardHeader>
                    <CardTitle>Customize</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Add your content, choose your theme, and arrange your sections.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="absolute -left-3 -top-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  3
                </div>
                <Card className="h-full rounded-xl border-secondary/30">
                  <CardHeader>
                    <CardTitle>Share</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Publish your profile and share it with your network.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/90 to-purple-400/90 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Create Your Profile?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of professionals who are showcasing their work with Ñ.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="px-8 bg-white text-primary hover:bg-white/90 rounded-full"
              asChild
            >
              <Link href="/auth/register">Get Started Free</Link>
            </Button>
            <p className="mt-4 text-sm opacity-80">No credit card required</p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-white font-bold text-lg">Ñ</h3>
              <p className="text-sm text-gray-400">Create, customize, and share your professional profile.</p>
            </div>
            <div className="flex gap-8">
              <div>
                <h4 className="font-medium mb-2">Product</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link href="#features" className="text-gray-400 hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Examples
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Company</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white">
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Ñ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

