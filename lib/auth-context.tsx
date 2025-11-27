"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toastUtils } from "@/lib/toast-utils"
import APIFactory from "@/lib/api-factory"
import { ApiError } from "@/utils/errors"
import { capitalizeFirst } from "@/utils/stringFormatter"

// Define the shape of the user object
interface User {
  id: string
  name: string
  email: string
  role: string
}

// Define the shape of the auth context
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
  refreshAccessToken: (refreshToken: string) => Promise<boolean>
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Function to check if user is authenticated
  const checkAuth = async (): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Get token from localStorage
      const token_ = localStorage.getItem("access_token")
      const refreshToken = localStorage.getItem("refresh_token")

      if (!token_ || !refreshToken) {
        setIsAuthenticated(false)
        setUser(null)
        setIsLoading(false)
        setToken(null)
        return false
      }
      // Validate token with backend
      const response = await APIFactory.auth.validateToken(token_)
      if (!response.data?.valid) {
        const refreshed = await refreshAccessToken(refreshToken)
        if (!refreshed) {
          // If refresh fails, log out
          throw new ApiError("Your session has expired. Please log in again.", response.status ?? 400)
        }
      }

      const role = localStorage.getItem("role")
      const email = localStorage.getItem("user")

      if (!role || !email) {
        throw new ApiError("User info missing from Storage", response.status ?? 400)
      }
      
      setUser({
        id: "", // If you have user ID, set it
        name: "", // Set if available
        email,
        role,
      })
      setIsAuthenticated(true)
      setIsLoading(false)
      setToken(token_)

      return true
    } catch (error) {
      console.error("Auth check failed:", error)

      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      setIsAuthenticated(false)
      setUser(null)
      setToken(null)

      if (error instanceof ApiError) {
        toastUtils.error(`AUTHENTICATION FAILED (${error.status})`, error instanceof Error ? capitalizeFirst(error.message) : "Please check your credentials and try again")
      } else {
        toastUtils.error("Unexpected error", "Something went wrong")
      }
      
      setIsLoading(false)
      return false
    }
  }
  
  // Function to refresh access token using the refresh token
  const refreshAccessToken = async (refreshToken: string): Promise<boolean> => {
    try {
      const response = await APIFactory.auth.refreshToken(refreshToken)
      if (response.data?.access) {
        localStorage.setItem("access_token", response.data.access)
        localStorage.setItem("refresh_token", response.data.refresh)

        // Also set the cookie for the middleware to detect
        document.cookie = `access_token=${response.data.access}; path=/; max-age=86400`
        setToken(response.data.access)
        return true
      }
      return false
    } catch (error) {
      console.error("Token refresh failed:", error)
      return false
    }
  }

  // Function to log in
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Use APIFactory to authenticate the user
      const response = await APIFactory.auth.login(email, password)

      if (!response.data?.tokens) {
        throw new ApiError(response.error || "Login failed. Please check your credentials.", response.status ?? 400)
      }

      const access_token = response.data.tokens.access
      const refresh_token = response.data.tokens.refresh
      const user = response.data.logged_user
      const role = response.data.role

      localStorage.setItem("access_token", access_token)
      localStorage.setItem("refresh_token", refresh_token)
      localStorage.setItem("user", user)
      localStorage.setItem("role", role)

      // Also set the cookie for the middleware to detect
      document.cookie = `access_token=${access_token}; path=/; max-age=86400`

      setUser({
        id: "",
        name: "",
        email: response.data.logged_user,
        role: response.data.role,
      })
      setToken(access_token)

      setIsAuthenticated(true)
      setIsLoading(false)

      return true
    } catch (error) {
      console.error("Login failed:", error)
      setIsLoading(false)
      return false
    }
  }

  // Function to log out
  const logout = async (): Promise<void> => {
    setIsLoading(true)

    try {
      // Get token
      const token = localStorage.getItem("access_token")

      if (token) {
        await APIFactory.auth.logout(token)
      }

      // Clear auth data
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user")
      localStorage.removeItem("role")

      localStorage.setItem("just_logged_out", "true")

      // Clear the cookie
      document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

      setIsAuthenticated(false)
      setUser(null)
      setToken(null)

      toastUtils.success("Logged out", "You have been successfully logged out")

      // Redirect to login page
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)

      if (error instanceof ApiError) {
        toastUtils.error(`LOGOUT FAILED (${error.status})`, error instanceof Error ? capitalizeFirst(error.message) : "There was an error logging out. Please try again.")
      } else {
        toastUtils.error("Unexpected error", "Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Create context value
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    token,
    login,
    logout,
    checkAuth,
    refreshAccessToken
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
