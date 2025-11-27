"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, ShoppingCart, Truck, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastDemo } from "@/components/toast-demo"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const loading = useAuthRedirect()
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // Check if user is authenticated
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login")
      } else if (user?.role === "weight_man") {
        // For weight_man, show a simplified home with just upload options
        // We'll handle this in the render
      }
    }
  }, [router, isAuthenticated, isLoading, user])

  // If still loading, show loading indicator
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Special view for weight_man role
  if (user?.role === "weight_man") {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Weight Management System
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Upload weight data for purchase and internal transport processes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                <Card>
                  <CardHeader>
                    <CardTitle>Purchase Upload</CardTitle>
                    <CardDescription>Upload purchase weight data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center p-4">
                      <Upload className="h-16 w-16 text-brand" />
                    </div>
                    <p className="text-center">Upload Excel files with purchase weight data.</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/purchase/upload" className="w-full">
                      <Button variant="outline" className="w-full">
                        Go to Purchase Upload
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Internal Upload</CardTitle>
                    <CardDescription>Upload internal transport weight data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center p-4">
                      <Upload className="h-16 w-16 text-brand" />
                    </div>
                    <p className="text-center">Upload Excel files with internal transport weight data.</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/internal/upload" className="w-full">
                      <Button variant="outline" className="w-full">
                        Go to Internal Upload
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>
    )
  }

  // Default view for other roles
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Factory Scrap Management System
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Efficiently manage scrap purchases and internal transport with our comprehensive dashboard.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/purchase">
                  <Button>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Toast Demo Section */}
        <section className="w-full py-8">
          <div className="container px-4 md:px-6">
            <ToastDemo />
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Process</CardTitle>
                  <CardDescription>Track and manage all scrap purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center p-4">
                    <ShoppingCart className="h-16 w-16 text-brand" />
                  </div>
                  <p className="text-center">Upload purchase data, view statistics, and manage records efficiently.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/purchase" className="w-full">
                    <Button variant="outline" className="w-full">
                      Go to Purchase Process
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Internal Process</CardTitle>
                  <CardDescription>Manage internal scrap transport</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center p-4">
                    <Truck className="h-16 w-16 text-brand" />
                  </div>
                  <p className="text-center">Track internal movement of scrap materials within the factory.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/internal" className="w-full">
                    <Button variant="outline" className="w-full">
                      Go to Internal Process
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
