"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDocuments } from "@/contexts/document-context"
import { useAuth } from "@/contexts/auth-context"
import { Upload, X } from "lucide-react"

const documentTypes = ["Policy", "Procedure", "Form", "Report", "Manual", "Contract", "Other"]
const departments = ["IT", "HR", "Finance", "Marketing", "Operations", "Legal"]

interface DocumentFormProps {
  document?: any
  isEditing?: boolean
}

export function DocumentForm({ document, isEditing = false }: DocumentFormProps) {
  const { createDocument, updateDocument } = useDocuments()
  const { user } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: document?.title || "",
    description: document?.description || "",
    type: document?.type || "",
    department: document?.department || user?.department || "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("[v0] Form submitted with data:", formData)

    if (!formData.title.trim()) {
      setError("Title is required")
      setIsLoading(false)
      return
    }

    if (!formData.type) {
      setError("Document type is required")
      setIsLoading(false)
      return
    }

    try {
      const documentData = {
        ...formData,
        author: user?.name || "",
        status: "Draft" as const,
        version: document?.version || 1,
      }

      console.log("[v0] Creating document with data:", documentData)
      console.log("[v0] User context:", user)

      if (isEditing && document) {
        await updateDocument(document.id, documentData)
        console.log("[v0] Document updated successfully")
      } else {
        await createDocument(documentData)
        console.log("[v0] Document created successfully")
      }

      router.push("/documents")
    } catch (err) {
      console.log("[v0] Error creating/updating document:", err)
      setError(isEditing ? "Failed to update document" : "Failed to create document")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Document" : "Create New Document"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update document information" : "Fill in the details for your new document"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter document title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter document description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Document Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Main Document File</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{file ? file.name : "Click to upload or drag and drop"}</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, TXT up to 10MB</p>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <input
                id="attachments"
                type="file"
                onChange={handleAttachmentChange}
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
              <label htmlFor="attachments" className="cursor-pointer block text-center">
                <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Add related files</p>
              </label>

              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm truncate">{attachment.name}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Document"
                  : "Create Document"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
