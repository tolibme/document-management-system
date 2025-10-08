"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Users, Bell } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export function QuickActions() {
  const { user } = useAuth()

  const actions = [
    {
      title: "Create Document",
      description: "Start a new document",
      icon: Plus,
      href: "/documents/new",
      color: "bg-primary text-primary-foreground",
    },
    {
      title: "My Documents",
      description: "View your documents",
      icon: FileText,
      href: "/documents?filter=my",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      title: "Notifications",
      description: "Check updates",
      icon: Bell,
      href: "/notifications",
      color: "bg-muted text-muted-foreground",
    },
  ]

  // Add admin action if user is admin
  if (user?.role === "Admin") {
    actions.push({
      title: "Manage Users",
      description: "User administration",
      icon: Users,
      href: "/admin/users",
      color: "bg-accent text-accent-foreground",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => (
            <Button key={action.title} variant="outline" className="h-auto p-4 justify-start bg-transparent" asChild>
              <Link href={action.href}>
                <div className={`p-2 rounded-full mr-3 ${action.color}`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
