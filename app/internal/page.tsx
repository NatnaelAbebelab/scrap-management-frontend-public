import Link from "next/link"
import { ArrowRight, BarChart3, FileSpreadsheet, Truck, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function InternalPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Internal Transport Management
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Manage all aspects of internal scrap transport from data upload to reporting.
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
                  <CardDescription>View transport statistics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center p-4">
                    <BarChart3 className="h-12 w-12 text-brand" />
                  </div>
                  <p className="text-center">Monitor key metrics and visualize transport data.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/internal/dashboard" className="w-full">
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
                  <CardDescription>Upload transport data files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center p-4">
                    <Upload className="h-12 w-12 text-brand" />
                  </div>
                  <p className="text-center">Upload Excel files with transport data for processing.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/internal/upload" className="w-full">
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
                  <CardDescription>Manage transport records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center p-4">
                    <Truck className="h-12 w-12 text-brand" />
                  </div>
                  <p className="text-center">View, filter, and manage all transport records.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/internal/records" className="w-full">
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
                  <CardDescription>Generate transport reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center p-4">
                    <FileSpreadsheet className="h-12 w-12 text-brand" />
                  </div>
                  <p className="text-center">Create and export detailed transport reports.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/internal/reports" className="w-full">
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
  )
}
