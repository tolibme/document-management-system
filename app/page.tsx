"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileText, Users, Shield, Workflow, Sparkles, Zap } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="glass rounded-full p-4 neumorphic">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
          <p className="mt-4 text-muted-foreground font-medium">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-xl"></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 neumorphic">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Modern Document Management</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-6">
            Document Management
            <br />
            <span className="text-foreground">Reimagined</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the future of document workflows with our beautiful, intuitive platform. Designed for modern
            teams who value both functionality and aesthetics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 neumorphic"
              >
                <Zap className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto glass border-2 hover:bg-white/80 transition-all duration-300 bg-transparent"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="glass neumorphic hover:shadow-xl transition-all duration-300 border-0 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-lg">Smart Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base">
                AI-powered organization with intelligent tagging and instant search capabilities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass neumorphic hover:shadow-xl transition-all duration-300 border-0 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/70 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Workflow className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-lg">Fluid Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base">
                Seamless approval processes with real-time collaboration and status tracking.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass neumorphic hover:shadow-xl transition-all duration-300 border-0 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-lg">Team Harmony</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base">
                Effortless collaboration with role-based access and instant notifications.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass neumorphic hover:shadow-xl transition-all duration-300 border-0 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-lg">Fort Knox Security</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base">
                Enterprise-grade security with advanced encryption and compliance features.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
