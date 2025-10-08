import { type NextRequest, NextResponse } from "next/server"

// Mock workflow data - in a real app, this would come from a database
const mockWorkflows = [
  {
    id: 1,
    document: 1,
    status: "Draft",
    action_by: "John Doe",
    assigned_to: "Jane Smith",
    comment: "Initial document creation",
    created_at: "2024-01-15T10:00:00Z",
    document_title: "Project Proposal Q1 2024",
    document_owner: "john.doe@company.com",
    department: "Finance",
  },
  {
    id: 2,
    document: 1,
    status: "In Review",
    action_by: "Jane Smith",
    assigned_to: "Legal Team",
    comment: "Document submitted for legal review",
    created_at: "2024-01-16T14:30:00Z",
    document_title: "Project Proposal Q1 2024",
    document_owner: "john.doe@company.com",
    department: "Finance",
  },
  {
    id: 3,
    document: 2,
    status: "Draft",
    action_by: "Alice Johnson",
    assigned_to: null,
    comment: "Contract draft created",
    created_at: "2024-01-17T09:15:00Z",
    document_title: "Service Agreement Contract",
    document_owner: "alice.johnson@company.com",
    department: "Legal",
  },
  {
    id: 4,
    document: 1,
    status: "Approved",
    action_by: "Legal Team",
    assigned_to: null,
    comment: "Legal review completed. Document approved for implementation.",
    created_at: "2024-01-18T16:45:00Z",
    document_title: "Project Proposal Q1 2024",
    document_owner: "john.doe@company.com",
    department: "Finance",
  },
]

// Helper function to get user from token (mock implementation)
function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")

  // In a real app, decode JWT token
  // For mock, get user from localStorage data that would be sent in header
  const userHeader = request.headers.get("x-user-data")
  if (userHeader) {
    try {
      return JSON.parse(decodeURIComponent(userHeader))
    } catch {
      return null
    }
  }

  // Fallback mock user for testing
  return {
    id: "1",
    email: "admin@company.com",
    name: "Admin User",
    role: "Admin",
    department: "IT",
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get("document")
    const department = searchParams.get("department")
    const status = searchParams.get("status")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")
    const owner = searchParams.get("owner") // Added owner filter for role-based access

    const currentUser = getUserFromToken(request)
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let filteredWorkflows = [...mockWorkflows]

    if (currentUser.role === "Admin") {
      // Admins can see all workflows
    } else {
      // Document owners can only see workflows for their own documents
      if (owner === "current_user") {
        filteredWorkflows = filteredWorkflows.filter((w) => w.document_owner === currentUser.email)
      } else {
        // Non-admins can only see their own documents by default
        filteredWorkflows = filteredWorkflows.filter((w) => w.document_owner === currentUser.email)
      }
    }

    // Filter by document ID if provided
    if (documentId) {
      filteredWorkflows = filteredWorkflows.filter((w) => w.document.toString() === documentId)
    }

    if (department && department !== "all") {
      filteredWorkflows = filteredWorkflows.filter((w) => w.department.toLowerCase() === department.toLowerCase())
    }

    // Filter by status if provided
    if (status && status !== "all") {
      filteredWorkflows = filteredWorkflows.filter((w) => w.status.toLowerCase() === status.toLowerCase())
    }

    // Filter by date range if provided
    if (startDate) {
      filteredWorkflows = filteredWorkflows.filter((w) => new Date(w.created_at) >= new Date(startDate))
    }
    if (endDate) {
      filteredWorkflows = filteredWorkflows.filter((w) => new Date(w.created_at) <= new Date(endDate))
    }

    // Sort by created_at descending (newest first)
    filteredWorkflows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json(filteredWorkflows)
  } catch (error) {
    console.error("Error fetching workflows:", error)
    return NextResponse.json({ error: "Failed to fetch workflows" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = getUserFromToken(request)
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { document, status, action_by, assigned_to, comment } = body

    // Validate required fields
    if (!document || !status || !action_by) {
      return NextResponse.json({ error: "Missing required fields: document, status, action_by" }, { status: 400 })
    }

    const documentWorkflows = mockWorkflows.filter((w) => w.document === Number.parseInt(document))
    const documentOwner = documentWorkflows.length > 0 ? documentWorkflows[0].document_owner : null

    // Only admins can change status and assign users
    if (currentUser.role !== "Admin" && (status || assigned_to)) {
      // Document owners can only add comments, not change status
      if (currentUser.email !== documentOwner) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }
    }

    // Create new workflow entry
    const newWorkflow = {
      id: mockWorkflows.length + 1,
      document: Number.parseInt(document),
      status,
      action_by,
      assigned_to: assigned_to || null,
      comment: comment || "",
      created_at: new Date().toISOString(),
      document_title: `Document ${document}`, // In real app, fetch from documents table
      document_owner: documentOwner || currentUser.email,
      department: currentUser.department,
    }

    // Add to mock data (in real app, save to database)
    mockWorkflows.push(newWorkflow)

    return NextResponse.json(newWorkflow, { status: 201 })
  } catch (error) {
    console.error("Error creating workflow:", error)
    return NextResponse.json({ error: "Failed to create workflow entry" }, { status: 500 })
  }
}
