import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DocumentList } from "@/components/documents/document-list"

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">Manage and organize your documents</p>
        </div>
        <DocumentList />
      </div>
    </DashboardLayout>
  )
}
