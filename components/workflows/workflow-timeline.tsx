"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, CheckCircle, XCircle, FileText, User, MessageSquare, Plus, AlertCircle } from "lucide-react"

interface WorkflowEntry {
  id: number
  document: number
  status: string
  action_by: string
  assigned_to: string | null
  comment: string
  created_at: string
  document_title: string
}

interface WorkflowTimelineProps {
  documentId: string
  onAddWorkflow?: () => void
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "draft":
      return <FileText className="w-4 h-4 text-gray-500" />
    case "in review":
      return <Clock className="w-4 h-4 text-yellow-500" />
    case "approved":
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case "rejected":
      return <XCircle className="w-4 h-4 text-red-500" />
    default:
      return <AlertCircle className="w-4 h-4 text-gray-500" />
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "in review":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "approved":
      return "bg-green-100 text-green-800 border-green-200"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function WorkflowTimeline({ documentId, onAddWorkflow }: WorkflowTimelineProps) {
  const [workflows, setWorkflows] = useState<WorkflowEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchWorkflows()
  }, [documentId, refreshKey])

  const fetchWorkflows = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/workflows?document=${documentId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch workflows")
      }
      const data = await response.json()
      setWorkflows(data)
    } catch (err) {
      setError("Failed to load workflow history")
      console.error("Error fetching workflows:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshTimeline = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Expose refresh function to parent component
  React.useImperativeHandle(
    onAddWorkflow,
    () => ({
      refresh: refreshTimeline,
    }),
    [],
  )

  const latestStatus = workflows.length > 0 ? workflows[0].status : "Draft"

  if (isLoading) {
    return (
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Workflow Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Workflow Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchWorkflows} variant="outline" className="mt-4 bg-transparent">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Workflow Timeline
              <Badge className={getStatusColor(latestStatus)}>
                {getStatusIcon(latestStatus)}
                <span className="ml-1">{latestStatus}</span>
              </Badge>
            </CardTitle>
            <CardDescription>Document workflow history and status changes</CardDescription>
          </div>
          {onAddWorkflow && (
            <Button onClick={onAddWorkflow} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Status
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {workflows.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No workflow history available</p>
            {onAddWorkflow && (
              <Button onClick={onAddWorkflow} variant="outline" className="mt-4 bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add First Status
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {workflows.map((workflow, index) => (
              <div key={workflow.id} className="relative">
                {/* Timeline connector line */}
                {index < workflows.length - 1 && <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>}

                <div className="flex gap-4">
                  {/* Status icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-background border-2 border-border flex items-center justify-center">
                    {getStatusIcon(workflow.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(workflow.created_at).toLocaleDateString()} at{" "}
                        {new Date(workflow.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Performed by:</span>
                        <span>{workflow.action_by}</span>
                      </div>

                      {workflow.assigned_to && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Assigned to:</span>
                          <span>{workflow.assigned_to}</span>
                        </div>
                      )}

                      {workflow.comment && (
                        <div className="flex gap-2 text-sm">
                          <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Comment:</span>
                            <p className="text-muted-foreground mt-1">{workflow.comment}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {index < workflows.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
