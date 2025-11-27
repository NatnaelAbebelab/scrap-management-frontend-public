import React from "react"
import { Badge } from "@/components/ui/badge"
import { capitalizeFirst } from "@/utils/stringFormatter"
import { formatDate } from "@/utils/dateFormatter"
import { formatCurrency } from "@/utils/currencyFormatter"
import { formatWeight } from "@/utils/weightFormatter"
import { getStatusColor } from "@/utils/statusColor"
import { PurchaseReportFilterParams } from "@/lib/types/purchase-api"

interface PlainReportTableProps {
  filterCriteria: PurchaseReportFilterParams
  reportRecord: any[]
}

export function PlainReportTable({ reportRecord, filterCriteria }: PlainReportTableProps) {
  return (
    <div className="rounded-md border">
          <div className="w-full overflow-x-auto overflow-y-auto max-h-[600px] max-w-[1200px]">
            <table className="w-full min-w-[1200px] caption-bottom text-sm">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">#</th>
                  <th className="h-12 px-4 text-left align-middle font-medium min-w-[150px]">Record No.</th>
                  <th className="h-12 px-4 text-left align-middle font-medium min-w-[250px]">Customer Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium min-w-[250px]">Plate No.</th>
                  <th className="h-12 px-4 text-left align-middle font-medium min-w-[150px]">Material Type</th>
                  <th className="h-12 px-4 text-left align-middle font-medium min-w-[150px]">First Weight</th>
                  <th className="h-12 px-4 text-left align-middle font-medium min-w-[150px]">Second Weight</th>
                  <th className="h-12 px-4 text-left align-middle font-medium min-w-[200px]">Net Weight (Kg)</th>
                  <th className="h-12 px-4 text-left align-middle font-medium min-w-[200px]">Rate (Br)</th>
                  <th className="h-12 px-4 text-left align-middle font-medium min-w-[150px]">Waste Deduction (Kg)</th>
                  <th className="h-12 px-4 text-left align-middle font-medium min-w-[150px]">Net Price (Br)</th>
                  <th className="h-12 px-4 text-left align-middle font-medium min-w-[150px]">Weight Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportRecord.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center p-4">
                      No records found.
                    </td>
                  </tr>
                ) : (
                    reportRecord.map((record, index) => (
                    <tr key={record._id}
                    className={`border-b transition-colors hover:bg-muted/50 ${
                      index % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"
                    }`}>
                      <td className="p-4 align-middle">{index + 1}</td>
                      <td className="p-4 align-middle">{record.record_no}</td>
                      <td className="p-4 align-middle">
                        <div className="text-sm p-2 bg-muted rounded-md">
                          <p className="font-medium">Customer Name: {record.customer_fname} {record.customer_lname}</p>
                          <p className="font-medium">Customer TIN: {record.customer}</p>
                          <p className="text-muted-foreground">Business name: {record.customer_business_name}</p>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="text-sm p-2 bg-muted rounded-md">
                          <p className="font-medium">Plate No: {record.plate_no}</p>
                          <p className="text-muted-foreground">Driver name: {record.driver_name}</p>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        >
                          {capitalizeFirst(record.material_type)}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">{formatWeight(record.first_weight)}</td>
                      <td className="p-4 align-middle">{formatWeight(record.second_weight)}</td>
                      <td className="p-4 align-middle">
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
                      <td className="p-4 align-middle">
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
                      <td className="p-4 align-middle">
                        <Badge
                            variant="secondary"
                            className="border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80"
                          >
                            {formatWeight(record.waste_deduction)}
                          </Badge>
                      </td>
                      <td className="p-4 align-middle">{formatCurrency(record.net_price)}</td>
                      <td className="p-4 align-middle">{formatDate(record.first_date)}</td>
                      <td className="p-4 align-middle">
                        <Badge className={getStatusColor(record.status)}>{capitalizeFirst(record.status)}</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
  )
}
