"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { useAuth } from "./auth-context"

interface Document {
  id: string
  title: string
  description: string
  type: string
  department: string
  author: string
  status: "Draft" | "Review" | "Approved" | "Rejected" | "Archived"
  createdAt: Date
  updatedAt: Date
  version: number
  fileUrl?: string
  attachments?: string[]
}

interface DocumentStats {
  total: number
  pending: number
  approved: number
  archived: number
  myDocuments: number
}

interface DocumentState {
  documents: Document[]
  stats: DocumentStats
  isLoading: boolean
}

type DocumentAction =
  | { type: "SET_DOCUMENTS"; payload: Document[] }
  | { type: "SET_STATS"; payload: DocumentStats }
  | { type: "ADD_DOCUMENT"; payload: Document }
  | { type: "UPDATE_DOCUMENT"; payload: Document }
  | { type: "DELETE_DOCUMENT"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }

const initialState: DocumentState = {
  documents: [],
  stats: {
    total: 0,
    pending: 0,
    approved: 0,
    archived: 0,
    myDocuments: 0,
  },
  isLoading: false,
}

const documentReducer = (state: DocumentState, action: DocumentAction): DocumentState => {
  switch (action.type) {
    case "SET_DOCUMENTS":
      return { ...state, documents: action.payload, isLoading: false }
    case "SET_STATS":
      return { ...state, stats: action.payload }
    case "ADD_DOCUMENT":
      return { ...state, documents: [action.payload, ...state.documents] }
    case "UPDATE_DOCUMENT":
      return {
        ...state,
        documents: state.documents.map((doc) => (doc.id === action.payload.id ? action.payload : doc)),
      }
    case "DELETE_DOCUMENT":
      return {
        ...state,
        documents: state.documents.filter((doc) => doc.id !== action.payload),
      }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

interface DocumentContextType extends DocumentState {
  fetchDocuments: () => Promise<void>
  fetchStats: () => Promise<void>
  createDocument: (document: Partial<Document>) => Promise<void>
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export const useDocuments = () => {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider")
  }
  return context
}

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState)
  const { user, isAuthenticated } = useAuth()

  const mockDocuments: Document[] = [
    {
      id: "1",
      title: "Project Proposal - Q4 2024",
      description: "Comprehensive project proposal for the upcoming quarter including budget allocation and timeline.",
      type: "Proposal",
      department: "IT",
      author: "John Doe",
      status: "Review",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-20"),
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
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-18"),
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
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-12"),
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
      createdAt: new Date("2024-01-22"),
      updatedAt: new Date("2024-01-22"),
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
      createdAt: new Date("2023-12-15"),
      updatedAt: new Date("2024-01-08"),
      version: 1,
      fileUrl: "/documents/security-audit-2023.pdf",
    },
  ]

  const fetchDocuments = async () => {
    if (!isAuthenticated) return

    dispatch({ type: "SET_LOADING", payload: true })

    try {
      const response = await fetch("/api/documents")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const documentsData = await response.json()
      console.log("[v0] Received documents data:", documentsData)

      if (documentsData.error) {
        throw new Error(documentsData.error)
      }

      const documentsArray = Array.isArray(documentsData) ? documentsData : documentsData.documents || []

      if (!Array.isArray(documentsArray)) {
        console.error("[v0] Expected array but got:", typeof documentsArray, documentsArray)
        throw new Error("Invalid response format: expected array of documents")
      }

      const documents: Document[] = documentsArray.map((doc: any) => ({
        id: doc.id?.toString() || doc._id?.toString(),
        title: doc.title || "Untitled Document",
        description: doc.description || "",
        type: doc.type || doc.category || "Document",
        department: doc.department || "General",
        author: doc.author || "Unknown",
        status: doc.status || "Draft",
        createdAt: new Date(doc.createdAt || doc.created_at || Date.now()),
        updatedAt: new Date(doc.updatedAt || doc.updated_at || Date.now()),
        version: doc.version || 1,
        fileUrl: doc.fileUrl || doc.file_url,
        attachments: doc.attachments || [],
      }))

      let filteredDocuments = documents
      if (user?.role === "Employee") {
        filteredDocuments = documents.filter((doc) => doc.author === user.name || doc.status === "Approved")
      }

      dispatch({ type: "SET_DOCUMENTS", payload: filteredDocuments })
    } catch (error) {
      console.error("Failed to fetch documents:", error)
      console.log("[v0] API failed, falling back to mock data")

      let filteredDocuments = mockDocuments
      if (user?.role === "Employee") {
        filteredDocuments = mockDocuments.filter((doc) => doc.author === user.name || doc.status === "Approved")
      }

      dispatch({ type: "SET_DOCUMENTS", payload: filteredDocuments })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const fetchStats = async () => {
    if (!isAuthenticated) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const stats = {
        total: mockDocuments.length,
        pending: mockDocuments.filter((doc) => doc.status === "Review").length,
        approved: mockDocuments.filter((doc) => doc.status === "Approved").length,
        archived: mockDocuments.filter((doc) => doc.status === "Archived").length,
        myDocuments: mockDocuments.filter((doc) => doc.author === user?.name).length,
      }

      dispatch({ type: "SET_STATS", payload: stats })
    } catch (error) {
      console.error("Failed to fetch document stats:", error)
    }
  }

  const createDocument = async (document: Partial<Document>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newDocument: Document = {
        id: Date.now().toString(),
        title: document.title || "Untitled Document",
        description: document.description || "",
        type: document.type || "Document",
        department: user?.department || "General",
        author: user?.name || "Unknown",
        status: "Draft",
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        ...document,
      }

      dispatch({ type: "ADD_DOCUMENT", payload: newDocument })
    } catch (error) {
      console.error("Failed to create document:", error)
      throw error
    }
  }

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const existingDoc = state.documents.find((doc) => doc.id === id)
      if (!existingDoc) throw new Error("Document not found")

      const updatedDocument: Document = {
        ...existingDoc,
        ...updates,
        updatedAt: new Date(),
        version: existingDoc.version + 1,
      }

      dispatch({ type: "UPDATE_DOCUMENT", payload: updatedDocument })
    } catch (error) {
      console.error("Failed to update document:", error)
      throw error
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      dispatch({ type: "DELETE_DOCUMENT", payload: id })
    } catch (error) {
      console.error("Failed to delete document:", error)
      throw error
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchDocuments()
      fetchStats()
    }
  }, [isAuthenticated, user])

  const value: DocumentContextType = {
    ...state,
    fetchDocuments,
    fetchStats,
    createDocument,
    updateDocument,
    deleteDocument,
  }

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>
}
