import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentDocuments } from "@/components/dashboard/recent-documents"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="glass rounded-2xl p-6 neumorphic">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Welcome back! Here's your document activity at a glance.</p>
        </div>

        <StatsCards />

        <div className="grid gap-6 md:grid-cols-2">
          <RecentDocuments />
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  )
}
