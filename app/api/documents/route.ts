import { type NextRequest, NextResponse } from "next/server"

const mockDocuments = [
  {
    id: "1",
    title: "Project Proposal - Q4 2024",
    description: "Comprehensive project proposal for the upcoming quarter including budget allocation and timeline.",
    type: "Proposal",
    department: "IT",
    author: "John Doe",
    status: "Review",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
    version: 2,
    fileUrl: "/documents/project-proposal-q4.pdf",
    attachments: ["budget-breakdown.xlsx", "timeline.pdf"],
  },
  {
    id: "2",
    title: "Employee Handbook Update",
    description: "Updated employee handbook with new remote work policies and benefits information.",
    type: "Policy",
    department: "HR",
    author: "Jane Smith",
    status: "Approved",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
    version: 3,
    fileUrl: "/documents/employee-handbook-v3.pdf",
  },
  {
    id: "3",
    title: "Financial Report - December 2023",
    description: "Monthly financial report including revenue, expenses, and profit analysis.",
    type: "Report",
    department: "Finance",
    author: "Bob Johnson",
    status: "Approved",
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
    version: 1,
    fileUrl: "/documents/financial-report-dec-2023.pdf",
  },
  {
    id: "4",
    title: "Marketing Campaign Brief",
    description: "Creative brief for the upcoming spring marketing campaign targeting new demographics.",
    type: "Brief",
    department: "Marketing",
    author: "Alice Wilson",
    status: "Draft",
    createdAt: "2024-01-22T10:00:00Z",
    updatedAt: "2024-01-22T10:00:00Z",
    version: 1,
  },
  {
    id: "5",
    title: "Security Audit Report",
    description: "Comprehensive security audit findings and recommendations for system improvements.",
    type: "Audit",
    department: "IT",
    author: "Mike Davis",
    status: "Archived",
    createdAt: "2023-12-15T10:00:00Z",
    updatedAt: "2024-01-08T10:00:00Z",
    version: 1,
    fileUrl: "/documents/security-audit-2023.pdf",
  },
]

export async function GET() {
  try {
    console.log("[v0] Returning mock documents data")
    return NextResponse.json(mockDocuments)
  } catch (error) {
    console.error("[v0] Error in documents API:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Creating new document:", body)

    const newDocument = {
      id: Date.now().toString(),
      title: body.title || "Untitled Document",
      description: body.description || "",
      type: body.type || "Document",
      department: body.department || "General",
      author: body.author || "Unknown",
      status: body.status || "Draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      ...body,
    }

    console.log("[v0] Successfully created document:", newDocument)
    return NextResponse.json(newDocument, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating document:", error)
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    console.log("[v0] Updating document:", id, updates)

    const updatedDocument = {
      id: id.toString(),
      updatedAt: new Date().toISOString(),
      version: (updates.version || 1) + 1,
      ...updates,
    }

    console.log("[v0] Successfully updated document:", updatedDocument)
    return NextResponse.json(updatedDocument)
  } catch (error) {
    console.error("[v0] Error updating document:", error)
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    console.log("[v0] Deleting document:", id)

    return NextResponse.json({
      message: "Document deleted successfully",
      id,
    })
  } catch (error) {
    console.error("[v0] Error deleting document:", error)
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
  }
}
