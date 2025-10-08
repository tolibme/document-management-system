"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DocumentForm } from "@/components/documents/document-form"
import { useDocuments } from "@/contexts/document-context"

interface EditDocumentPageProps {
  params: {
    id: string
  }
}

export default function EditDocumentPage({ params }: EditDocumentPageProps) {
  const { documents } = useDocuments()
  const document = documents.find((doc) => doc.id === params.id)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Document</h1>
          <p className="text-muted-foreground">Update document information</p>
        </div>
        <DocumentForm document={document} isEditing={true} />
      </div>
    </DashboardLayout>
  )
}
