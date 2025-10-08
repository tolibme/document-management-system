import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { NotificationSettings } from "@/components/notifications/notification-settings"

export default function NotificationSettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notification Settings</h1>
          <p className="text-muted-foreground">Customize how and when you receive notifications</p>
        </div>
        <NotificationSettings />
      </div>
    </DashboardLayout>
  )
}
