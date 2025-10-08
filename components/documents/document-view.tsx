"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDocuments } from "@/contexts/document-context"
import { useAuth } from "@/contexts/auth-context"
import {
  FileText,
  Edit,
  Download,
  Send,
  CheckCircle,
  XCircle,
  Archive,
  Clock,
  User,
  Building2,
  Calendar,
  Hash,
} from "lucide-react"
import Link from "next/link"
import { WorkflowTimeline } from "@/components/workflows/workflow-timeline"
import { WorkflowActionModal } from "@/components/workflows/workflow-action-modal"

const statusColors = {
  Draft: "bg-gray-100 text-gray-800",
  Review: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Archived: "bg-blue-100 text-blue-800",
}

const statusIcons = {
  Draft: FileText,
  Review: Clock,
  Approved: CheckCircle,
  Rejected: XCircle,
  Archived: Archive,
}

interface DocumentViewProps {
  documentId: string
}

export function DocumentView({ documentId }: DocumentViewProps) {
  const { documents, updateDocument } = useDocuments()
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false)
  const [timelineRefreshKey, setTimelineRefreshKey] = useState(0)

  const document = documents.find((doc) => doc.id === documentId)

  if (!document) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Document not found</p>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  const StatusIcon = statusIcons[document.status]
  const canEdit = document.author === user?.name || user?.role === "Admin"
  const canReview = user?.role === "Reviewer" || user?.role === "Admin"
  const canSubmit = document.status === "Draft" && document.author === user?.name

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true)
    setError("")

    try {
      await updateDocument(document.id, { status: newStatus })
      // Optionally show success message
    } catch (err) {
      setError("Failed to update document status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitForReview = () => handleStatusChange("Review")
  const handleApprove = () => handleStatusChange("Approved")
  const handleReject = () => handleStatusChange("Rejected")
  const handleArchive = () => handleStatusChange("Archived")

  const handleWorkflowAdded = () => {
    console.log("[v0] Workflow added, refreshing timeline and closing modal...")
    setTimelineRefreshKey((prev) => prev + 1)
    setIsWorkflowModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{document.title}</CardTitle>
              <CardDescription>{document.description}</CardDescription>
              <div className="flex items-center gap-2">
                <StatusIcon className="h-4 w-4" />
                <Badge className={statusColors[document.status]}>{document.status}</Badge>
                <span className="text-sm text-muted-foreground">v{document.version}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <Button variant="outline" asChild>
                  <Link href={`/documents/${document.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
              )}
              {document.fileUrl && (
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Author:</span>
                <span className="text-sm">{document.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Department:</span>
                <span className="text-sm">{document.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm">{document.type}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Created:</span>
                <span className="text-sm">{new Date(document.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Updated:</span>
                <span className="text-sm">{new Date(document.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Version:</span>
                <span className="text-sm">v{document.version}</span>
              </div>
            </div>
          </div>

          {document.attachments && document.attachments.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="text-lg font-medium mb-4">Attachments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {document.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate flex-1">Attachment {index + 1}</span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Workflow Timeline */}
      <WorkflowTimeline
        key={timelineRefreshKey}
        documentId={documentId}
        onAddWorkflow={() => setIsWorkflowModalOpen(true)}
      />

      {/* Workflow Action Modal */}
      <WorkflowActionModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        documentId={documentId}
        onWorkflowAdded={handleWorkflowAdded}
      />

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Available actions for this document</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {canSubmit && (
              <Button onClick={handleSubmitForReview} disabled={isLoading}>
                <Send className="h-4 w-4 mr-2" />
                Submit for Review
              </Button>
            )}

            {canReview && document.status === "Review" && (
              <>
                <Button onClick={handleApprove} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button onClick={handleReject} disabled={isLoading} variant="destructive">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}

            {(user?.role === "Admin" || document.author === user?.name) && document.status === "Approved" && (
              <Button onClick={handleArchive} disabled={isLoading} variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
