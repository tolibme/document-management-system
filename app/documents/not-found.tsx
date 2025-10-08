import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <DashboardLayout>
      <Card>
        <CardContent className="text-center py-8">
          <h2 className="text-2xl font-bold mb-2">Document Not Found</h2>
          <p className="text-muted-foreground mb-4">The document you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/documents">Back to Documents</Link>
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
