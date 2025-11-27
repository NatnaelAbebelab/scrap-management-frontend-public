"use client"

import { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Printer, Download, Eye, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { formatDate } from "@/utils/dateFormatter"
import { formatCurrency } from "@/utils/currencyFormatter"
import { formatWeight } from "@/utils/weightFormatter"
import { getStatusColor } from "@/utils/statusColor"
import { capitalizeFirst } from "@/utils/stringFormatter"

// Define the props for the report data
interface ReportData {
  reportName: string
  dateRange: {
    startDate: string
    endDate: string
  }
  filterCriteria?: {
    tin?: string
    materialType?: string
    status?: string
    plateNumber?: string
  }
  records: any[] // This would be your actual records data
  companyInfo: {
    name: string
    logo?: string
    businessInfo: string
    email: string
    phone: string
    website: string
    address: string
  }
}

interface ReportPdfGeneratorProps {
  data: ReportData
  onExport?: () => void
}

export function PlainReportPdfGenerator({ data, onExport }: ReportPdfGeneratorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.reportName}_${new Date().toISOString().split("T")[0]}`,
    onAfterPrint: () => {
      if (onExport) onExport()
    },
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 0;
      }
      html, body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    `,
  })

  return (
    <>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={handlePrint}> {/* onClick={() => setShowPreview(true)}} */}
          <Printer className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button onClick={handlePrint}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
            <DialogDescription>Preview before downloading</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border rounded-md p-4 bg-white" style={{ width: "100%", height: "70vh", overflow: "auto" }}>
              <div style={{ width: "100%", height: "100%", transform: "scale(0.7)", transformOrigin: "top left" }}>
                <ReportTemplate data={data} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden div for printing */}
      <div className="hidden">
        <div ref={componentRef} className="p-0 bg-white">
          <ReportTemplate data={data} />
        </div>
      </div>
    </>
  )
}

// Separate component for the report template to keep the code organized
function ReportTemplate({ data }: { data: ReportData }) {
  // Split records into chunks for pagination - using 12 rows per page
  const recordsPerPage = 7
  const recordChunks = []
  for (let i = 0; i < data.records.length; i += recordsPerPage) {
    recordChunks.push(data.records.slice(i, i + recordsPerPage))
  }

  // If there are no records, add an empty chunk to show headers
  if (data.records.length === 0) {
    recordChunks.length = 0 // Clear any existing chunks
    recordChunks.push([]) // Add a single empty chunk
  }

  // Calculate totals for the report
  const totalWeight = data.records?.reduce(
    (sum, record) => sum + parseFloat(record.net_weight),
    0
  )
  
  const totalAmount = data.records?.reduce(
    (sum, record) => sum + parseFloat(record.net_price),
    0
  )

  return (
    <div className="pdf-container" style={{ width: "297mm", minHeight: "210mm" }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
          }
          
          .pdf-container {
            width: 297mm;
            min-height: 210mm;
            margin: 0;
            padding: 0;
            position: relative;
          }
          
          .pdf-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 85px;
            z-index: 100;
          }
          
          .pdf-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 70px;
            z-index: 100;
          }
          
          .pdf-content {
            padding-top: 85px;
            padding-bottom: 20px;
          }
          
          .pdf-filter-first-page {
            padding-top: 85px;
            padding-bottom: 20px;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          thead {
            display: table-header-group;
          }
          
          tfoot {
            display: table-footer-group;
          }
          
          .signature-section {
            page-break-inside: avoid;
          }
          
          .table-row-border {
            border-bottom: 1px solid #e5e7eb !important;
          }
          
          .avoid-break {
            page-break-inside: avoid;
          }
          
          .totals-signature-container {
            padding-top: 10px;
            padding-bottom: 100px;
          }
        }
      `,
        }}
      />

      {/* Header - Fixed at top of every page - RED BRAND COLOR */}
      <div className="pdf-header bg-red-600 text-white p-4" style={{ width: "100%" }}>
        <div className="flex justify-between items-center">
          <div className="w-1/4">
            {data.companyInfo.logo ? (
              <img src={data.companyInfo.logo || "/placeholder.svg"} alt="Company Logo" className="h-12 w-auto" />
            ) : (
              <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xl font-bold">{data.companyInfo.name.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="w-2/4 text-center">
            <h1 className="text-xl font-bold">{data.companyInfo.name}</h1>
            <h2 className="text-lg font-semibold mt-1">{data.reportName}</h2>
          </div>
          <div className="w-1/4 text-right">
            <p className="text-sm opacity-80">Export Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div style={{ width: "100%" }}>
        {recordChunks.map((chunk, pageIndex) => (
          <div key={pageIndex} className={pageIndex === 0 ? "pdf-filter-first-page" : "pdf-content page-break"}>
            {/* Filter Criteria Section - ONLY ON FIRST PAGE */}
            {pageIndex === 0 && (
              <div className="bg-red-50 p-2 mb-4" style={{ width: "100%" }}>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Material Type:</span>
                    <span>{data.filterCriteria?.materialType || "All"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Status:</span>
                    <span>{data.filterCriteria?.status || "All"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Date Range:</span>
                    <span>{formatDate(data.dateRange.startDate)} - {formatDate(data.dateRange.endDate)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Table Section */}
            <table className="min-w-full divide-y divide-gray-200" style={{ width: "100%" }}>
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Record No
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Material Type
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Net Weight (Kg)
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rate (Br.)
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Waste Deduction (kg)
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Net Price (Br.)
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Weight Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chunk.map((record, index) => (
                  <tr key={index} className={`table-row-border ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.record_no}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="text-sm p-2 bg-muted rounded-md">
                        <p className="font-medium">Customer Name: {record.customer_fname} {record.customer_lname}</p>
                        <p className="font-medium">Customer TIN: {record.customer}</p>
                        <p className="text-muted-foreground">Business name: {record.customer_business_name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      >
                        {capitalizeFirst(record.material_type)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="text-sm p-2 bg-muted rounded-md space-y-1">
                        <p className="font-medium">Net Weight: {formatWeight(record.net_weight)}</p>
                        <div className="inline-block text-muted-foreground text-xs px-2 py-1 rounded-full">
                          <span className="inline-block bg-muted-foreground/10 text-muted-foreground text-xs mb-1 mr-1 px-2 py-1 rounded-full">
                            H: {formatWeight(record.heavy_grade)}
                          </span>
                          <span className="inline-block bg-muted-foreground/10 text-muted-foreground text-xs mb-1 mr-1 px-2 py-1 rounded-full">
                            M: {formatWeight(record.medium_grade)}
                          </span>
                          <span className="inline-block bg-muted-foreground/10 text-muted-foreground text-xs mb-1 mr-1 px-2 py-1 rounded-full">
                            L: {formatWeight(record.light_grade)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="text-sm p-2 bg-muted rounded-md space-y-1">
                        <div className="inline-block text-muted-foreground text-xs px-2 py-1 rounded-full">
                          <span className="inline-block bg-muted-foreground/10 text-muted-foreground text-xs mb-1 mr-1 px-2 py-1 rounded-full">
                            H: {record.heavy_rate}
                          </span>
                          <span className="inline-block bg-muted-foreground/10 text-muted-foreground text-xs mb-1 mr-1 px-2 py-1 rounded-full">
                            M: {record.medium_rate}
                          </span>
                          <span className="inline-block bg-muted-foreground/10 text-muted-foreground text-xs mb-1 mr-1 px-2 py-1 rounded-full">
                            L: {record.light_rate}
                          </span>
                          <span className="inline-block bg-muted-foreground/10 text-muted-foreground text-xs mb-1 mr-1 px-2 py-1 rounded-full">
                            F: {record.fixed_rate}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <Badge
                        variant="secondary"
                        className="border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80"
                      >
                        {formatWeight(record.waste_deduction)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(record.net_price)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.first_date)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <Badge className={getStatusColor(record.status)}>{capitalizeFirst(record.status)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Totals and Signature on a separate page */}
        <div className="totals-signature-container">
          {/* Totals Section */}
          <div className="pdf-totals bg-gray-50 p-2" style={{ width: "100%", borderBottom: "none" }}>
            <div className="flex justify-end space-x-8">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">Total Weight:</p>
                <p className="text-lg font-semibold">{formatWeight(totalWeight)} tons</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">Total Amount:</p>
                <p className="text-lg font-semibold">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Single Signature Section */}
          <div className="signature-section mt-4" style={{ width: "100%" }}>
            <div className="flex justify-end mr-8">
              <div className="text-center" style={{ width: "200px" }}>
                <div className="border-b border-gray-400 pb-8 mb-2" style={{ minHeight: "30px" }}></div>
                <p className="text-sm font-medium">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Fixed at bottom of every page - RED BRAND COLOR */}
      <div className="pdf-footer bg-red-600 text-white p-3" style={{ width: "100%" }}>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold mb-1 text-sm">Contact</h3>
            <p className="text-xs opacity-80">{data.companyInfo.phone}</p>
            <p className="text-xs opacity-80">{data.companyInfo.email}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1 text-sm">Address</h3>
            <p className="text-xs opacity-80">{data.companyInfo.address}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1 text-sm">Online</h3>
            <p className="text-xs opacity-80">{data.companyInfo.website}</p>
            <p className="text-xs opacity-80 mt-1">Reg. No: {data.companyInfo.businessInfo}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
