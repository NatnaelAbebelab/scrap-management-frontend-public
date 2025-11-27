"use client"

import type React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface StatusBasedContentProps {
  children: React.ReactNode
  requiredStatus: string[]  // e.g., ['approved', 'paid']
  status: string            // e.g., 'new'
  fallback?: React.ReactNode
}

export function StatusBasedContent({
  children,
  requiredStatus,
  status,
  fallback,
}: StatusBasedContentProps) {
  const currentStatus = status?.toLowerCase()
  const allowedStatuses = requiredStatus.map(s => s.toLowerCase())

  const hasAccess = allowedStatuses.includes(currentStatus)

  if (hasAccess) return <>{children}</>
  if (fallback) return <>{fallback}</>

  // SAMPLE USAGE
  const mock = () => {
    return (
       <StatusBasedContent requiredStatus={["approved", "paid"]} status={"new"}>
        <span className="text-green-600">✔ Access granted</span>
       </StatusBasedContent>
    )
  }
}
