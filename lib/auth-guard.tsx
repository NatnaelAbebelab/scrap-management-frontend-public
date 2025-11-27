"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { toastUtils } from "@/lib/toast-utils"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string | string[] // Optional role requirement
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Skip auth check for auth pages
    if (pathname?.startsWith("/auth")) {
      setIsAuthorized(true)
      return
    }

    const checkAuth = async () => {
      // If still loading, wait
      if (isLoading) return

      // Just create delay when the user logged b/c no need to the routes or current page
      const justLoggedOut = localStorage.getItem("just_logged_out")

      if (justLoggedOut) {
        localStorage.removeItem("just_logged_out")
        return
      }

      // If not authenticated and not on an auth page, redirect to login
      if (!isAuthenticated) {
        // If at root path, don't show toast as this is expected behavior
        if (pathname !== "/") {
          toastUtils.warning("Authentication required", "Please log in to access this page")
        }

        // Add the current path as a redirect parameter
        const redirectUrl = `/auth/login?redirect=${encodeURIComponent(pathname || "")}`
        router.push(redirectUrl)
        return
      }
      
      // If role check is required
      if (requiredRole && user) {
        const hasRequiredRole = Array.isArray(requiredRole)
          ? requiredRole.includes(user.role)
          : user.role === requiredRole

        if (!hasRequiredRole) {
          toastUtils.error("Access denied", "You don't have permission to access this page")
          router.push("/")
          return
        }
      }

      // If we get here, the user is authorized
      setIsAuthorized(true)
    }

    checkAuth()
  }, [isLoading, isAuthenticated, user, requiredRole, pathname, router])

  // Show loading state
  if (!isAuthorized && !pathname?.startsWith("/auth")) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Render children if authorized or on auth page
  return <>{children}</>
}
