"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNotifications } from "@/contexts/notification-context"
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, Eye } from "lucide-react"
import Link from "next/link"

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
}

const typeColors = {
  info: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
}

export function NotificationList() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications()
  const [filter, setFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredNotifications = notifications.filter((notification) => {
    const matchesReadStatus =
      filter === "all" || (filter === "unread" && !notification.isRead) || (filter === "read" && notification.isRead)
    const matchesType = typeFilter === "all" || notification.type === typeFilter

    return matchesReadStatus && matchesType
  })

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All notifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All notifications</SelectItem>
              <SelectItem value="unread">Unread ({unreadCount})</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            {filteredNotifications.length} of {notifications.length} notifications
            {unreadCount > 0 && ` • ${unreadCount} unread`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => {
                const TypeIcon = typeIcons[notification.type]
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      !notification.isRead ? "bg-muted/50 border-primary/20" : "bg-background"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${typeColors[notification.type]}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`text-sm ${!notification.isRead ? "font-medium" : ""}`}>
                              {notification.message}
                            </p>
                            {notification.documentTitle && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Document: {notification.documentTitle}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full" />}
                            <Badge className={typeColors[notification.type]}>{notification.type}</Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          {notification.documentId && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/documents/${notification.documentId}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View Document
                              </Link>
                            </Button>
                          )}

                          {!notification.isRead && (
                            <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No notifications found</p>
              <p className="text-sm text-muted-foreground">
                {filter === "unread"
                  ? "You're all caught up! No unread notifications."
                  : "Notifications will appear here when there's activity on your documents."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
