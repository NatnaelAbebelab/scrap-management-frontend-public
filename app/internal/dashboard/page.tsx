import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InternalTransportChart } from "@/components/internal/internal-transport-chart"
import { LocationDistributionChart } from "@/components/internal/location-distribution-chart"
import { InternalStatsCards } from "@/components/internal/internal-stats-cards"
import { ProtectedRoute } from "@/components/protected-route"

export default function InternalDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["weight_man", "admin", "super_admin"]}>
      <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Internal Transport Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <InternalStatsCards />
            <div className="grid gap-4 md:grid-cols-12">
              <Card className="col-span-12 md:col-span-8">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Monthly Transport Activity</CardTitle>
                  <CardDescription className="text-sm">
                    Internal scrap movement volume for the current year
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <InternalTransportChart />
                </CardContent>
              </Card>
              <Card className="col-span-12 md:col-span-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Location Distribution</CardTitle>
                  <CardDescription className="text-sm">Distribution of scrap by destination location</CardDescription>
                </CardHeader>
                <CardContent>
                  <LocationDistributionChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-12">
              <Card className="col-span-12">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Advanced Analytics</CardTitle>
                  <CardDescription className="text-sm">
                    Detailed analysis of internal transport efficiency and patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded">
                    <p className="text-sm text-muted-foreground">Advanced analytics will be available soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
