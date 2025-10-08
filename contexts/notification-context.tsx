"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { useAuth } from "./auth-context"

interface Notification {
  id: string
  message: string
  documentId?: string
  documentTitle?: string
  timestamp: Date
  isRead: boolean
  type: "info" | "success" | "warning" | "error"
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
}

type NotificationAction =
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "SET_LOADING"; payload: boolean }

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
}

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.isRead).length,
        isLoading: false,
      }
    case "ADD_NOTIFICATION":
      const newNotifications = [action.payload, ...state.notifications]
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.isRead).length,
      }
    case "MARK_AS_READ":
      const updatedNotifications = state.notifications.map((n) =>
        n.id === action.payload ? { ...n, isRead: true } : n,
      )
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.isRead).length,
      }
    case "MARK_ALL_AS_READ":
      const allReadNotifications = state.notifications.map((n) => ({ ...n, isRead: true }))
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0,
      }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

interface NotificationContextType extends NotificationState {
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  fetchNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState)
  const { user, isAuthenticated } = useAuth()

  const mockNotifications: Notification[] = [
    {
      id: "1",
      message: "Your document 'Project Proposal - Q4 2024' has been approved",
      documentId: "1",
      documentTitle: "Project Proposal - Q4 2024",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      type: "success",
    },
    {
      id: "2",
      message: "New document 'Employee Handbook Update' requires your review",
      documentId: "2",
      documentTitle: "Employee Handbook Update",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isRead: false,
      type: "info",
    },
    {
      id: "3",
      message: "Document 'Marketing Campaign Brief' has been submitted for review",
      documentId: "4",
      documentTitle: "Marketing Campaign Brief",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isRead: true,
      type: "info",
    },
    {
      id: "4",
      message: "System maintenance scheduled for tonight at 11 PM",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      isRead: true,
      type: "warning",
    },
    {
      id: "5",
      message: "Your document 'Financial Report - December 2023' has been archived",
      documentId: "3",
      documentTitle: "Financial Report - December 2023",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
      type: "info",
    },
  ]

  const fetchNotifications = async () => {
    if (!isAuthenticated) return

    dispatch({ type: "SET_LOADING", payload: true })

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Filter notifications based on user role
      let filteredNotifications = mockNotifications
      if (user?.role === "Employee") {
        filteredNotifications = mockNotifications.filter(
          (notification) => !notification.documentId || notification.type === "warning" || notification.type === "info",
        )
      }

      dispatch({ type: "SET_NOTIFICATIONS", payload: filteredNotifications })
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const markAsRead = async (id: string) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200))

      dispatch({ type: "MARK_AS_READ", payload: id })
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      dispatch({ type: "MARK_ALL_AS_READ" })
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, user])

  const value: NotificationContextType = {
    ...state,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
