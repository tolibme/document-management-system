"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDocuments } from "@/contexts/document-context"
import { FileText, Clock, CheckCircle, Archive, TrendingUp, TrendingDown } from "lucide-react"

export function StatsCards() {
  const { stats } = useDocuments()

  const cards = [
    {
      title: "Total Documents",
      value: stats.total,
      icon: FileText,
      gradient: "from-primary to-primary/70",
      change: "+12%",
      changeIcon: TrendingUp,
    },
    {
      title: "Pending Reviews",
      value: stats.pending,
      icon: Clock,
      gradient: "from-secondary to-secondary/70",
      change: "-8%",
      changeIcon: TrendingDown,
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      gradient: "from-accent to-accent/70",
      change: "+24%",
      changeIcon: TrendingUp,
    },
    {
      title: "Archived",
      value: stats.archived,
      icon: Archive,
      gradient: "from-muted-foreground to-muted-foreground/70",
      change: "+5%",
      changeIcon: TrendingUp,
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="glass border-0 neumorphic hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} group-hover:scale-110 transition-transform duration-300`}
            >
              <card.icon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-foreground">{card.value}</div>
              <div className="flex items-center gap-1 text-xs">
                <card.changeIcon className="h-3 w-3 text-accent" />
                <span className="text-accent font-medium">{card.change}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
