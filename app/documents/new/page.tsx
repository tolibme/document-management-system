import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DocumentForm } from "@/components/documents/document-form"

export default function NewDocumentPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Document</h1>
          <p className="text-muted-foreground">Create a new document in the system</p>
        </div>
        <DocumentForm />
      </div>
    </DashboardLayout>
  )
}
