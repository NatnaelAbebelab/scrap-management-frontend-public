"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Home,
  Package,
  ShoppingCart,
  Truck,
  Upload,
  Shield,
  Users,
  Calculator,
  FileText
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-context"

export default function Sidebar() {
  const pathname = usePathname()
  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [internalOpen, setInternalOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const { user } = useAuth()
  const isAdmin = user?.role === "admin"
  const isWeightMan = user?.role === "weight_man"

  // Check if current path is under purchase process
  const isPurchasePath = pathname?.startsWith("/purchase")

  // Check if current path is under internal process
  const isInternalPath = pathname?.startsWith("/internal")

  // Set purchase dropdown open if current path is under purchase process
  useEffect(() => {
    if (isPurchasePath) {
      setPurchaseOpen(true)
    }
    if (isInternalPath) {
      setInternalOpen(true)
    }
  }, [pathname, isPurchasePath, isInternalPath])

  // Purchase process submenu - filtered based on role
  const getPurchaseRoutes = () => {
    const allRoutes = [
      {
        name: "Dashboard",
        path: "/purchase/dashboard",
        icon: BarChart3,
        roles: ["admin", "user"],
      },
      {
        name: "Rate",
        path: "/purchase/rate",
        icon: Calculator,
        roles: ["admin", "user"],
      },
      {
        name: "Upload Data",
        path: "/purchase/upload",
        icon: Upload,
        roles: ["admin", "user", "weight_man"], // weight_man can access this
      },
      {
        name: "Records",
        path: "/purchase/records",
        icon: Package,
        roles: ["admin", "user", "weight_man"],
      },
      {
        name: "Reports",
        path: "/purchase/reports",
        icon: FileSpreadsheet,
        roles: ["admin", "user"],
      },
    ]

    // Filter routes based on user role
    if (isWeightMan) {
      return allRoutes.filter((route) => route.roles.includes("weight_man"))
    }

    return allRoutes
  }

  // Get filtered routes
  const purchaseRoutes = getPurchaseRoutes()

  // Main routes
  const mainRoutes = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
  ]

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Toggle purchase dropdown
  const togglePurchaseDropdown = (e: React.MouseEvent) => {
    e.preventDefault()
    setPurchaseOpen(!purchaseOpen)
  }

  // Toggle internal dropdown
  const toggleInternalDropdown = (e: React.MouseEvent) => {
    e.preventDefault()
    setInternalOpen(!internalOpen)
  }

  // Get internal routes based on role
  const getInternalRoutes = () => {
    const allRoutes = [
      {
        name: "Dashboard",
        path: "/internal/dashboard",
        icon: BarChart3,
        roles: ["admin", "user"],
      },
      {
        name: "Agency",
        path: "/internal/agency",
        icon: Users,
        roles: ["admin", "user"],
      },
      {
        name: "Agreement",
        path: "/internal/agreement",
        icon: FileText ,
        roles: ["admin", "user"],
      },
      {
        name: "Upload Data",
        path: "/internal/upload",
        icon: Upload,
        roles: ["admin", "user", "weight_man"], // weight_man can access this
      },
      {
        name: "Records",
        path: "/internal/records",
        icon: Truck,
        roles: ["admin", "user"],
      },
      {
        name: "Reports",
        path: "/internal/reports",
        icon: FileSpreadsheet,
        roles: ["admin", "user"],
      },
    ]

    // Filter routes based on user role
    if (isWeightMan) {
      return allRoutes.filter((route) => route.roles.includes("weight_man"))
    }

    return allRoutes
  }

  const internalRoutes = getInternalRoutes()

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "border-r bg-gray-100/40 dark:bg-gray-800/40 transition-all duration-300 flex flex-col h-full",
          isCollapsed ? "w-[60px]" : "w-[220px]",
        )}
      >
        <div className="flex h-14 items-center border-b px-4 justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package className="h-5 w-5 text-brand" />
              <span className="text-sm">Scrap Management</span>
            </Link>
          )}
          {isCollapsed && <Package className="h-5 w-5 mx-auto text-brand" />}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn("h-6 w-6", isCollapsed && "mx-auto")}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium gap-1">
            {/* Main routes */}
            {mainRoutes.map((route) =>
              isCollapsed ? (
                <Tooltip key={route.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link href={route.path}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-full h-9 justify-center",
                          pathname === route.path && "bg-brand/10 text-brand dark:bg-brand/20",
                        )}
                      >
                        <route.icon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{route.name}</TooltipContent>
                </Tooltip>
              ) : (
                <Link key={route.path} href={route.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 h-9",
                      pathname === route.path && "bg-brand/10 text-brand dark:bg-brand/20",
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    <span className="text-sm">{route.name}</span>
                  </Button>
                </Link>
              ),
            )}

            {/* Purchase Process Dropdown - Only show if there are routes for the user's role */}
            {purchaseRoutes.length > 0 &&
              (isCollapsed ? (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link href={isWeightMan ? "/purchase/upload" : "/purchase"}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-full h-9 justify-center",
                          isPurchasePath && "bg-brand/10 text-brand dark:bg-brand/20",
                        )}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Purchase Process</TooltipContent>
                </Tooltip>
              ) : (
                <div className="w-full">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 h-9",
                      isPurchasePath && "bg-brand/10 text-brand dark:bg-brand/20",
                    )}
                    onClick={togglePurchaseDropdown}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-sm">Purchase Process</span>
                    <ChevronDown
                      className={cn("ml-auto h-4 w-4 transition-transform duration-200", purchaseOpen && "rotate-180")}
                    />
                  </Button>

                  {/* Purchase submenu */}
                  <div
                    className={cn(
                      "pl-4 pt-1 space-y-1 overflow-hidden transition-all",
                      purchaseOpen ? "max-h-41 opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    {purchaseRoutes.map((route) => (
                      <Link key={route.path} href={route.path}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-2 h-8",
                            pathname === route.path && "bg-brand/10 text-brand dark:bg-brand/20",
                          )}
                        >
                          <route.icon className="h-4 w-4" />
                          <span className="text-sm">{route.name}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

            {/* Internal Process Dropdown - Only show if there are routes for the user's role */}
            {internalRoutes.length > 0 &&
              (isCollapsed ? (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link href={isWeightMan ? "/internal/upload" : "/internal"}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-full h-9 justify-center",
                          isInternalPath && "bg-brand/10 text-brand dark:bg-brand/20",
                        )}
                      >
                        <Truck className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Internal Process</TooltipContent>
                </Tooltip>
              ) : (
                <div className="w-full">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 h-9",
                      isInternalPath && "bg-brand/10 text-brand dark:bg-brand/20",
                    )}
                    onClick={toggleInternalDropdown}
                  >
                    <Truck className="h-4 w-4" />
                    <span className="text-sm">Internal Process</span>
                    <ChevronDown
                      className={cn("ml-auto h-4 w-4 transition-transform duration-200", internalOpen && "rotate-180")}
                    />
                  </Button>

                  {/* Internal submenu */}
                  <div
                    className={cn(
                      "pl-4 pt-1 space-y-1 overflow-hidden transition-all",
                      internalOpen ? "max-h-41 opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    {internalRoutes.map((route) => (
                      <Link key={route.path} href={route.path}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-2 h-8",
                            pathname === route.path && "bg-brand/10 text-brand dark:bg-brand/20",
                          )}
                        >
                          <route.icon className="h-4 w-4" />
                          <span className="text-sm">{route.name}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

            {/* Admin Section - Only visible to admins */}
            {isAdmin && !isCollapsed && (
              <div className="w-full">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 h-9",
                    pathname?.startsWith("/admin") && "bg-brand/10 text-brand dark:bg-brand/20",
                  )}
                >
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Admin</span>
                </Button>
                <div className="pl-4 pt-1 space-y-1">
                  <Link href="/admin/dashboard">
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-2 h-8",
                        pathname === "/admin/dashboard" && "bg-brand/10 text-brand dark:bg-brand/20",
                      )}
                    >
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">Dashboard</span>
                    </Button>
                  </Link>
                  <Link href="/admin/users">
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-2 h-8",
                        pathname === "/admin/users" && "bg-brand/10 text-brand dark:bg-brand/20",
                      )}
                    >
                      <Users className="h-4 w-4" />
                      <span className="text-sm">User Management</span>
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Admin Section - Collapsed version */}
            {isAdmin && isCollapsed && (
              <div className="pt-1 space-y-1">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link href="/admin/dashboard">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-full h-8 justify-center",
                          pathname === "/admin/dashboard" && "bg-brand/10 text-brand dark:bg-brand/20",
                        )}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Admin Dashboard</TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link href="/admin/users">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-full h-8 justify-center",
                          pathname === "/admin/users" && "bg-brand/10 text-brand dark:bg-brand/20",
                        )}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">User Management</TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Show purchase routes when sidebar is collapsed */}
            {isCollapsed && isPurchasePath && (
              <div className="pt-1 space-y-1">
                {purchaseRoutes.map((route) => (
                  <Tooltip key={route.path} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link href={route.path}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "w-full h-8 justify-center",
                            pathname === route.path && "bg-brand/10 text-brand dark:bg-brand/20",
                          )}
                        >
                          <route.icon className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{route.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}

            {/* Show internal routes when sidebar is collapsed */}
            {isCollapsed && isInternalPath && (
              <div className="pt-1 space-y-1">
                {internalRoutes.map((route) => (
                  <Tooltip key={route.path} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link href={route.path}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "w-full h-8 justify-center",
                            pathname === route.path && "bg-brand/10 text-brand dark:bg-brand/20",
                          )}
                        >
                          <route.icon className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{route.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
          </nav>
        </div>
      </div>
    </TooltipProvider>
  )
}
