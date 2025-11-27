"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { toastUtils } from "@/lib/toast-utils"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string | string[] // Optional role requirement
  allowedRoles?: string[] // Specific roles that are allowed
  fallbackUrl?: string // Where to redirect if authentication fails
}

export function ProtectedRoute({
  children,
  requiredRole,
  allowedRoles,
  fallbackUrl = "/auth/login",
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)


  useEffect(() => {
    // If still loading, don't do anything yet
    if (isLoading) return

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      toastUtils.warning("Authentication required", "Please log in to access this page")

      // Add the current path as a redirect parameter
      const redirectUrl = `${fallbackUrl}?redirect=${encodeURIComponent(pathname || "")}`
      router.push(redirectUrl)
      return
    }

    // Special case for weight_man role
    if (user?.role === "weight_man") {
        // weight_man can only access upload pages and home
        const isUploadPage = pathname?.includes("/upload")
        const isRecordsPage = pathname?.includes("/records")
        const isHomePage = pathname === "/"
        const isPurchasePage = pathname === "/purchase"
        const isInternalPage = pathname === "/internal"
    
        if (!isUploadPage && !isRecordsPage && !isHomePage && !isPurchasePage && !isInternalPage) {
        // Only show the message if we haven't already shown one
        if (!isAuthorized) {
            toastUtils.error("Access denied", "You only have access to upload functionality.")
        }
    
        // Redirect to appropriate upload page based on current path
        if (pathname?.startsWith("/purchase")) {
            router.push("/purchase/upload")
            return
        } else if (pathname?.startsWith("/internal")) {
            router.push("/internal/upload")
            return
        } else {
            router.push("/")
            return
        }
        }
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
    // If specific allowed roles are defined
    if (allowedRoles && user) {
      const hasAllowedRole = allowedRoles.includes(user?.role)

      if (!hasAllowedRole) {
        toastUtils.error("Access denied", "You don't have permission to access this page")

        // Redirect based on the current section
        if (pathname?.startsWith("/purchase")) {
          router.push("/purchase")
        } else if (pathname?.startsWith("/internal")) {
          router.push("/internal")
        } else {
          router.push("/")
        }
        return
      }
    }

    // If we get here, the user is authorized
    setIsAuthorized(true)
  }, [isLoading, isAuthenticated, user, requiredRole, allowedRoles, router, pathname, fallbackUrl])

  // Show loading state
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Render children if authorized
  return <>{children}</>
}
