import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { NotificationList } from "@/components/notifications/notification-list"

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with document activities and system updates</p>
        </div>
        <NotificationList />
      </div>
    </DashboardLayout>
  )
}
