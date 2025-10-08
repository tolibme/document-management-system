"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { CheckCircle, XCircle, Clock, FileText, AlertCircle, Shield } from "lucide-react"

interface WorkflowActionModalProps {
  isOpen: boolean
  onClose: () => void
  documentId: string
  onWorkflowAdded?: () => void
}

const statusOptions = [
  { value: "Draft", label: "Draft", icon: FileText, color: "text-gray-500" },
  { value: "In Review", label: "In Review", icon: Clock, color: "text-yellow-500" },
  { value: "Approved", label: "Approved", icon: CheckCircle, color: "text-green-500" },
  { value: "Rejected", label: "Rejected", icon: XCircle, color: "text-red-500" },
]

const userOptions = [
  { value: "john-doe", label: "John Doe" },
  { value: "jane-smith", label: "Jane Smith" },
  { value: "legal-team", label: "Legal Team" },
  { value: "hr-team", label: "HR Team" },
  { value: "finance-team", label: "Finance Team" },
  { value: "management", label: "Management" },
]

export function WorkflowActionModal({ isOpen, onClose, documentId, onWorkflowAdded }: WorkflowActionModalProps) {
  const { user } = useAuth()
  const [status, setStatus] = useState("Draft")
  const [comment, setComment] = useState("")
  const [assignedTo, setAssignedTo] = useState("none")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const isAdmin = user?.role === "Admin"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAdmin && !comment.trim()) {
      setError("Please add a comment")
      return
    }

    if (isAdmin && !status) {
      setError("Please select a status")
      return
    }

    setIsSubmitting(true)
    setError("")

    console.log("[v0] Submitting workflow entry...")

    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-data": encodeURIComponent(JSON.stringify(user)),
        },
        body: JSON.stringify({
          document: documentId,
          status: isAdmin ? status : undefined,
          action_by: user?.name || "Unknown User",
          assigned_to: isAdmin && assignedTo !== "none" ? assignedTo : null,
          comment: comment.trim() || null,
        }),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to add workflow status" }))
        throw new Error(errorData.error || "Failed to add workflow status")
      }

      const result = await response.json()
      console.log("[v0] Workflow added successfully:", result)

      // Reset form
      setStatus("Draft")
      setComment("")
      setAssignedTo("none")
      setError("")

      // Notify parent component
      if (onWorkflowAdded) {
        onWorkflowAdded()
      }

      // Close modal
      console.log("[v0] Closing modal...")
      onClose()
    } catch (err) {
      console.error("[v0] Error adding workflow:", err)
      setError(err instanceof Error ? err.message : "Failed to add workflow status")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setStatus("Draft")
      setComment("")
      setAssignedTo("none")
      setError("")
      onClose()
    }
  }

  const selectedStatusOption = statusOptions.find((option) => option.value === status)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isAdmin ? "Add Workflow Status" : "Add Comment"}
            {!isAdmin && <Shield className="w-4 h-4 text-muted-foreground" />}
          </DialogTitle>
          <DialogDescription>
            {isAdmin
              ? "Update the document status and add a comment about the action taken."
              : "Add a comment about this document. Only administrators can change status and assignments."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isAdmin && (
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={status} onValueChange={setStatus} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select status">
                    {selectedStatusOption && (
                      <div className="flex items-center gap-2">
                        <selectedStatusOption.icon className={`w-4 h-4 ${selectedStatusOption.color}`} />
                        <span>{selectedStatusOption.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className={`w-4 h-4 ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {isAdmin && (
            <div className="space-y-2">
              <Label htmlFor="assigned-to">Assign To (Optional)</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No assignment</SelectItem>
                  {userOptions.map((option) => (
                    <SelectItem key={option.value} value={option.label}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Comment - available to all users */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comment {!isAdmin && "*"}</Label>
            <Textarea
              id="comment"
              placeholder={
                isAdmin ? "Add a comment about this status change..." : "Add your comment about this document..."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="resize-none"
              required={!isAdmin} // Required for non-admins
            />
          </div>

          {/* Action by (Read-only) */}
          <div className="space-y-2">
            <Label>Action by</Label>
            <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
              {user?.name || "Unknown User"}
            </div>
          </div>

          {!isAdmin && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                As a document owner, you can add comments but cannot change status or assignments. Contact an
                administrator for status changes.
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || (!isAdmin && !comment.trim())} className="min-w-[100px]">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isAdmin ? "Adding..." : "Commenting..."}</span>
                </div>
              ) : isAdmin ? (
                "Add Status"
              ) : (
                "Add Comment"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
