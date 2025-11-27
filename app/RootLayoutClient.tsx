"use client"

import type React from "react"

import Sidebar from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"

// Client component for handling state
export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if the current path is an auth path
  const isAuthPath = pathname?.startsWith("/auth")

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem("access_token")
      setIsAuthenticated(!!token)
      setIsLoading(false)

      // If at root path and not authenticated, redirect to login
      if (pathname === "/" && !token) {
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [pathname, router])

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar)
  }

  // Always render the Toaster component regardless of the path
  return (
    <AuthProvider>
      {isAuthPath ? (
        <>
          {children}
          <Toaster />
        </>
      ) : isLoading || (!isAuthenticated && !isAuthPath) ? (
        <>
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
          <Toaster />
        </>
      ) : (
        <div className="flex min-h-screen flex-col">
          <TopBar onMenuClick={toggleMobileSidebar} />
          <div className="flex flex-1">
            <div className={`${showMobileSidebar ? "block" : "hidden"} md:block`}>
              <Sidebar />
            </div>
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
          <Toaster />
        </div>
      )}
    </AuthProvider>
  )
}
