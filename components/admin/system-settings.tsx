"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Database, Shield, Clock, HardDrive } from "lucide-react"

interface SystemSettings {
  siteName: string
  siteDescription: string
  maxFileSize: string
  allowedFileTypes: string
  sessionTimeout: string
  enableEmailNotifications: boolean
  enableFileVersioning: boolean
  enableAuditLog: boolean
  autoArchiveDays: string
  backupFrequency: string
}

export function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "Document Management System",
    siteDescription: "Professional document management and workflow system",
    maxFileSize: "10",
    allowedFileTypes: "pdf,doc,docx,txt,jpg,jpeg,png",
    sessionTimeout: "60",
    enableEmailNotifications: true,
    enableFileVersioning: true,
    enableAuditLog: true,
    autoArchiveDays: "365",
    backupFrequency: "daily",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: keyof SystemSettings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Failed to save settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
      </div>

      {success && (
        <Alert>
          <AlertDescription>System settings saved successfully!</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>Basic system configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
                placeholder="Enter site name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleInputChange("sessionTimeout", e.target.value)}
                placeholder="60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => handleInputChange("siteDescription", e.target.value)}
              placeholder="Enter site description"
            />
          </div>
        </CardContent>
      </Card>

      {/* File Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            File Management
          </CardTitle>
          <CardDescription>Configure file upload and storage settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleInputChange("maxFileSize", e.target.value)}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="autoArchiveDays">Auto Archive After (days)</Label>
              <Input
                id="autoArchiveDays"
                type="number"
                value={settings.autoArchiveDays}
                onChange={(e) => handleInputChange("autoArchiveDays", e.target.value)}
                placeholder="365"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
            <Input
              id="allowedFileTypes"
              value={settings.allowedFileTypes}
              onChange={(e) => handleInputChange("allowedFileTypes", e.target.value)}
              placeholder="pdf,doc,docx,txt,jpg,jpeg,png"
            />
            <p className="text-sm text-muted-foreground">Comma-separated list of file extensions</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableFileVersioning">File Versioning</Label>
              <p className="text-sm text-muted-foreground">Enable automatic file version tracking</p>
            </div>
            <Switch
              id="enableFileVersioning"
              checked={settings.enableFileVersioning}
              onCheckedChange={(checked) => handleInputChange("enableFileVersioning", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security & Audit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Audit
          </CardTitle>
          <CardDescription>Security and logging configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableAuditLog">Audit Logging</Label>
              <p className="text-sm text-muted-foreground">Track all user actions and system events</p>
            </div>
            <Switch
              id="enableAuditLog"
              checked={settings.enableAuditLog}
              onCheckedChange={(checked) => handleInputChange("enableAuditLog", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableEmailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send email notifications for system events</p>
            </div>
            <Switch
              id="enableEmailNotifications"
              checked={settings.enableEmailNotifications}
              onCheckedChange={(checked) => handleInputChange("enableEmailNotifications", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Backup & Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup & Maintenance
          </CardTitle>
          <CardDescription>System backup and maintenance settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backupFrequency">Backup Frequency</Label>
            <Select
              value={settings.backupFrequency}
              onValueChange={(value) => handleInputChange("backupFrequency", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Run Backup Now
            </Button>
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              View Backup History
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
