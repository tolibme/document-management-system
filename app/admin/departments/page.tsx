import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DepartmentManagement } from "@/components/admin/department-management"

export default function AdminDepartmentsPage() {
  return (
    <DashboardLayout>
      <DepartmentManagement />
    </DashboardLayout>
  )
}
