import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DocumentView } from "@/components/documents/document-view"

interface DocumentPageProps {
  params: {
    id: string
  }
}

export default function DocumentPage({ params }: DocumentPageProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DocumentView documentId={params.id} />
      </div>
    </DashboardLayout>
  )
}
