import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SystemSettings } from "@/components/admin/system-settings"

export default function AdminSettingsPage() {
  return (
    <DashboardLayout>
      <SystemSettings />
    </DashboardLayout>
  )
}
