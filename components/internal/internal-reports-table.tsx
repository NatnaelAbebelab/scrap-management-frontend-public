"use client"
import { FileSpreadsheet, FileText } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getStatusColor } from "@/utils/statusColor"

// Mock data for the table
const mockData = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
  origin: ["Main Plant", "Warehouse A", "Warehouse B", "Processing Unit"][Math.floor(Math.random() * 4)],
  destination: ["Processing Plant", "Recycling Center", "Storage Facility", "Production Line", "External Vendor"][
    Math.floor(Math.random() * 5)
  ],
  vehicleId: `V${Math.floor(Math.random() * 1000) + 1000}`,
  driver: ["John Smith", "Maria Garcia", "Ahmed Ali", "Sarah Johnson", "Li Wei"][Math.floor(Math.random() * 5)],
  materialType: ["Metal", "Plastic", "Paper", "Wood", "Mixed"][Math.floor(Math.random() * 5)],
  weight: (Math.random() * 5 + 0.5).toFixed(2),
  transitTime: `${Math.floor(Math.random() * 5) + 1}h ${Math.floor(Math.random() * 60)}m`,
  status: ["Completed", "In Transit", "Delayed", "Cancelled"][Math.floor(Math.random() * 4)],
}))

export function InternalReportsTable() {
  const handleExportExcel = () => {
    alert("Exporting to Excel...")
    // In a real application, you would implement the Excel export functionality here
  }

  const handleExportPDF = () => {
    alert("Exporting to PDF...")
    // In a real application, you would implement the PDF export functionality here
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Report Data</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="relative max-h-[500px] overflow-auto">
            <table className="w-full min-w-[800px] caption-bottom text-sm">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Origin</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Destination</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Vehicle ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Driver</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Material Type</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Weight (tons)</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Transit Time</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((record) => (
                  <tr key={record.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">{record.id}</td>
                    <td className="p-4 align-middle">{record.date}</td>
                    <td className="p-4 align-middle">{record.origin}</td>
                    <td className="p-4 align-middle">{record.destination}</td>
                    <td className="p-4 align-middle">{record.vehicleId}</td>
                    <td className="p-4 align-middle">{record.driver}</td>
                    <td className="p-4 align-middle">{record.materialType}</td>
                    <td className="p-4 align-middle">{record.weight}</td>
                    <td className="p-4 align-middle">{record.transitTime}</td>
                    <td className="p-4 align-middle">
                      <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">Showing {mockData.length} records</p>
      </CardFooter>
    </Card>
  )
}
