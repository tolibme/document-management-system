"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Mail, Smartphone, Settings } from "lucide-react"

interface NotificationPreferences {
  documentUpdates: boolean
  statusChanges: boolean
  reviewRequests: boolean
  approvals: boolean
  rejections: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  dailyDigest: boolean
}

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    documentUpdates: true,
    statusChanges: true,
    reviewRequests: true,
    approvals: true,
    rejections: true,
    emailNotifications: false,
    pushNotifications: true,
    dailyDigest: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to save preferences:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {success && (
        <Alert>
          <AlertDescription>Notification preferences saved successfully!</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Types
          </CardTitle>
          <CardDescription>Choose which activities you want to be notified about</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="documentUpdates">Document Updates</Label>
                <p className="text-sm text-muted-foreground">When documents you're involved with are updated</p>
              </div>
              <Switch
                id="documentUpdates"
                checked={preferences.documentUpdates}
                onCheckedChange={() => handleToggle("documentUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="statusChanges">Status Changes</Label>
                <p className="text-sm text-muted-foreground">When document status changes (approved, rejected, etc.)</p>
              </div>
              <Switch
                id="statusChanges"
                checked={preferences.statusChanges}
                onCheckedChange={() => handleToggle("statusChanges")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reviewRequests">Review Requests</Label>
                <p className="text-sm text-muted-foreground">When documents are submitted for your review</p>
              </div>
              <Switch
                id="reviewRequests"
                checked={preferences.reviewRequests}
                onCheckedChange={() => handleToggle("reviewRequests")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="approvals">Approvals</Label>
                <p className="text-sm text-muted-foreground">When your documents are approved</p>
              </div>
              <Switch
                id="approvals"
                checked={preferences.approvals}
                onCheckedChange={() => handleToggle("approvals")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="rejections">Rejections</Label>
                <p className="text-sm text-muted-foreground">When your documents are rejected</p>
              </div>
              <Switch
                id="rejections"
                checked={preferences.rejections}
                onCheckedChange={() => handleToggle("rejections")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Delivery Methods
          </CardTitle>
          <CardDescription>How you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                id="emailNotifications"
                checked={preferences.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                </div>
              </div>
              <Switch
                id="pushNotifications"
                checked={preferences.pushNotifications}
                onCheckedChange={() => handleToggle("pushNotifications")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dailyDigest">Daily Digest</Label>
                <p className="text-sm text-muted-foreground">Receive a daily summary of all notifications</p>
              </div>
              <Switch
                id="dailyDigest"
                checked={preferences.dailyDigest}
                onCheckedChange={() => handleToggle("dailyDigest")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  )
}
