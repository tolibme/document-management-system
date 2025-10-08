"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context" // Import auth context for role-based filtering
import {
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Shield,
} from "lucide-react"

interface WorkflowEntry {
  id: number
  document: number
  status: string
  action_by: string
  assigned_to: string | null
  comment: string
  created_at: string
  document_title: string
  document_owner?: string // Added document owner field
  department?: string // Added department field
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

export default function WorkflowsPage() {
  const { user } = useAuth() // Get current user for role-based access
  const [workflows, setWorkflows] = useState<WorkflowEntry[]>([])
  const [filteredWorkflows, setFilteredWorkflows] = useState<WorkflowEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const isAdmin = user?.role === "Admin"

  useEffect(() => {
    fetchWorkflows()
  }, [user]) // Refetch when user changes

  useEffect(() => {
    applyFilters()
  }, [workflows, searchTerm, statusFilter, departmentFilter, startDate, endDate])

  const fetchWorkflows = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (!isAdmin) {
        params.append("owner", "current_user")
      }

      const response = await fetch(`/api/workflows?${params.toString()}`, {
        headers: {
          "x-user-data": encodeURIComponent(JSON.stringify(user)),
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch workflows")
      }
      const data = await response.json()
      setWorkflows(data)
    } catch (err) {
      setError("Failed to load workflow data")
      console.error("Error fetching workflows:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...workflows]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (workflow) =>
          workflow.document_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workflow.action_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workflow.comment.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((workflow) => workflow.status.toLowerCase() === statusFilter.toLowerCase())
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((workflow) => workflow.department?.toLowerCase() === departmentFilter.toLowerCase())
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter((workflow) => new Date(workflow.created_at) >= new Date(startDate))
    }
    if (endDate) {
      filtered = filtered.filter((workflow) => new Date(workflow.created_at) <= new Date(endDate + "T23:59:59"))
    }

    setFilteredWorkflows(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDepartmentFilter("all")
    setStartDate("")
    setEndDate("")
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading workflow data...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              Workflow Logs
              {!isAdmin && <Shield className="w-6 h-6 text-muted-foreground" />}
            </h1>
            <p className="text-muted-foreground">
              {isAdmin ? "Track workflow history across all documents" : "Track workflow history for your documents"}
            </p>
          </div>
          <Button onClick={fetchWorkflows} variant="outline">
            <AlertCircle className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isAdmin && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              You can only view workflows for documents you own. Administrators can see all workflows.
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
            <CardDescription>Filter workflow logs by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search documents, users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in review">In Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isAdmin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filteredWorkflows.length} of {workflows.length} workflow entries
                {!isAdmin && " (your documents only)"}
              </p>
              <Button onClick={clearFilters} variant="outline" size="sm">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Table */}
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle>Workflow History</CardTitle>
            <CardDescription>Complete log of all workflow actions</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredWorkflows.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {workflows.length === 0 ? "No workflow data available" : "No workflows match your filters"}
                </p>
                {workflows.length > 0 && (
                  <Button onClick={clearFilters} variant="outline" className="mt-4 bg-transparent">
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action By</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Comment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkflows.map((workflow) => (
                      <TableRow key={workflow.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{workflow.document_title}</p>
                              <p className="text-sm text-muted-foreground">ID: {workflow.document}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(workflow.status)}>
                            {getStatusIcon(workflow.status)}
                            <span className="ml-1">{workflow.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>{workflow.action_by}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {workflow.assigned_to ? (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span>{workflow.assigned_to}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm">{new Date(workflow.created_at).toLocaleDateString()}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(workflow.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            {workflow.comment ? (
                              <p className="text-sm text-muted-foreground truncate" title={workflow.comment}>
                                {workflow.comment}
                              </p>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
