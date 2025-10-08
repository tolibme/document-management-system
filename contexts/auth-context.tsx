"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "Admin" | "Reviewer" | "Employee"
  department: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true }
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      }
    case "LOGIN_FAILURE":
      return { ...state, isLoading: false, isAuthenticated: false }
    case "LOGOUT":
      return { ...initialState, isLoading: false }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, department: string) => Promise<void>
  logout: () => void
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const mockUsers = [
    {
      id: "1",
      email: "admin@company.com",
      name: "Admin User",
      role: "Admin" as const,
      department: "IT",
      avatar: "/admin-avatar.png",
    },
    {
      id: "2",
      email: "reviewer@company.com",
      name: "Jane Reviewer",
      role: "Reviewer" as const,
      department: "HR",
      avatar: "/reviewer-avatar.png",
    },
    {
      id: "3",
      email: "employee@company.com",
      name: "John Employee",
      role: "Employee" as const,
      department: "Finance",
      avatar: "/employee-avatar.png",
    },
  ]

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("dms_token")
    const userData = localStorage.getItem("dms_user")

    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } })
      } catch (error) {
        localStorage.removeItem("dms_token")
        localStorage.removeItem("dms_user")
        dispatch({ type: "SET_LOADING", payload: false })
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" })

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

      const mockUser = mockUsers.find((user) => user.email === email)

      if (!mockUser || password !== "password123") {
        throw new Error("Invalid credentials")
      }

      const token = `mock_token_${Date.now()}`

      // Store token and user data
      localStorage.setItem("dms_token", token)
      localStorage.setItem("dms_user", JSON.stringify(mockUser))

      dispatch({ type: "LOGIN_SUCCESS", payload: { user: mockUser, token } })
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" })
      throw error
    }
  }

  const register = async (email: string, password: string, name: string, department: string) => {
    dispatch({ type: "LOGIN_START" })

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

      const newUser: User = {
        id: `${Date.now()}`,
        email,
        name,
        role: "Employee",
        department,
        avatar: "/abstract-user-avatar.png",
      }

      const token = `mock_token_${Date.now()}`

      localStorage.setItem("dms_token", token)
      localStorage.setItem("dms_user", JSON.stringify(newUser))

      dispatch({ type: "LOGIN_SUCCESS", payload: { user: newUser, token } })
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("dms_token")
    localStorage.removeItem("dms_user")
    dispatch({ type: "LOGOUT" })
  }

  const resetPassword = async (email: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

      const userExists = mockUsers.some((user) => user.email === email)
      if (!userExists) {
        throw new Error("User not found")
      }

      // In a real app, this would send an email
      console.log(`Password reset email sent to ${email}`)
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
