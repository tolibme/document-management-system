"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDocuments } from "@/contexts/document-context"
import { FileText, Eye } from "lucide-react"
import Link from "next/link"

const statusColors = {
  Draft: "bg-gray-100 text-gray-800",
  Review: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Archived: "bg-blue-100 text-blue-800",
}

export function RecentDocuments() {
  const { documents } = useDocuments()

  const recentDocuments = documents.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Documents</CardTitle>
        <CardDescription>Latest documents in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {recentDocuments.length > 0 ? (
          <div className="space-y-4">
            {recentDocuments.map((document) => (
              <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{document.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {document.department} • {document.author}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[document.status]}>{document.status}</Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/documents/${document.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/documents">View All Documents</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No documents yet</p>
            <Button className="mt-4" asChild>
              <Link href="/documents/new">Create First Document</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
