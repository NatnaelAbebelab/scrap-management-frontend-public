"use client"

import { ProtectedRoute } from "@/components/protected-route"
import Link from "next/link"
import { ArrowRight, BarChart3, FileSpreadsheet, Package, Upload } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PurchasePage() {
  const { user } = useAuth()
  const isWeightMan = user?.role === "weight_man"

  // If user is weight_man, redirect them directly to the upload page
  if (isWeightMan) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Purchase Data Upload
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      Upload purchase data files for processing.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
              <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-1 lg:gap-12 max-w-md mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Data</CardTitle>
                      <CardDescription>Upload purchase data files</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center p-4">
                        <Upload className="h-12 w-12 text-brand" />
                      </div>
                      <p className="text-center">Upload Excel files with purchase data for processing.</p>
                    </CardContent>
                    <CardFooter>
                      <Link href="/purchase/upload" className="w-full">
                        <Button variant="outline" className="w-full">
                          Go to Upload
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
      </ProtectedRoute>
    )
  }

  // Regular view for other roles
  return (
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Purchase Process Management
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Manage all aspects of the scrap purchase process from data upload to reporting.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-4 lg:gap-12">
                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard</CardTitle>
                    <CardDescription>View purchase statistics and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center p-4">
                      <BarChart3 className="h-12 w-12 text-brand" />
                    </div>
                    <p className="text-center">Monitor key metrics and visualize purchase data.</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/purchase/dashboard" className="w-full">
                      <Button variant="outline" className="w-full">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Data</CardTitle>
                    <CardDescription>Upload purchase data files</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center p-4">
                      <Upload className="h-12 w-12 text-brand" />
                    </div>
                    <p className="text-center">Upload Excel files with purchase data for processing.</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/purchase/upload" className="w-full">
                      <Button variant="outline" className="w-full">
                        Go to Upload
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Records</CardTitle>
                    <CardDescription>Manage purchase records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center p-4">
                      <Package className="h-12 w-12 text-brand" />
                    </div>
                    <p className="text-center">View, filter, and manage all purchase records.</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/purchase/records" className="w-full">
                      <Button variant="outline" className="w-full">
                        Go to Records
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Reports</CardTitle>
                    <CardDescription>Generate purchase reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center p-4">
                      <FileSpreadsheet className="h-12 w-12 text-brand" />
                    </div>
                    <p className="text-center">Create and export detailed purchase reports.</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/purchase/reports" className="w-full">
                      <Button variant="outline" className="w-full">
                        Go to Reports
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
    </ProtectedRoute>
  )
}
