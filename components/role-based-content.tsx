"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { Shield, User } from "lucide-react"

interface RoleBasedContentProps {
  children: React.ReactNode
  requiredRole: string | string[]
  fallback?: React.ReactNode
}

export function RoleBasedContent({ children, requiredRole, fallback }: RoleBasedContentProps) {
  const { user, isAuthenticated } = useAuth()

  // Check if user has the required role
  const hasRequiredRole = () => {
    if (!isAuthenticated || !user) return false

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role)
    }

    return user.role === requiredRole
  }

  // If user has the required role, render the children
  if (hasRequiredRole()) {
    return <>{children}</>
  }

  // If fallback is provided, render it
  if (fallback) {
    return <>{fallback}</>
  }

  // Default fallback ====> To show View Access Denied
  // return (
  //   <Alert variant="destructive">
  //     <AlertTriangle className="h-4 w-4" />
  //     <AlertTitle>Access Denied</AlertTitle>
  //     <AlertDescription>You don't have permission to view this content.</AlertDescription>
  //   </Alert>
  // )
}

// Example usage of role-specific components
export function AdminOnlyContent({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedContent requiredRole="admin">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-brand" />
          <h3 className="text-lg font-semibold">Admin Section</h3>
        </div>
        {children}
      </div>
    </RoleBasedContent>
  )
}

export function UserProfileBadge() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="flex items-center space-x-2 rounded-full bg-muted px-3 py-1">
      <User className="h-4 w-4" />
      <span className="text-sm font-medium">{user.name}</span>
      <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground capitalize">
        {user.role}
      </span>
    </div>
  )
}
