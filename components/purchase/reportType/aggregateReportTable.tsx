import React from "react"
import { formatWeight } from "@/utils/weightFormatter"
import { formatCurrency } from "@/utils/currencyFormatter"
import { PurchaseReportFilterParams } from "@/lib/types/purchase-api"

interface AggregateReportTableProps {
  filterCriteria: PurchaseReportFilterParams
  reportRecord: any[]
  extra_info: any
}

interface AggregateRecord {
  total_net_weight: number
  avg_rate: number
  total_net_price: number
  formatted_period: string
  record_count: number
  customer_fname: string
  customer_lname: string
  customer: string
  customer_business_name: string
}

export function AggregateReportTable({ filterCriteria, reportRecord, extra_info}: AggregateReportTableProps) {
  return (
    <div className="rounded-md border">
      <div className="w-full overflow-x-auto overflow-y-auto max-h-[600px] max-w-[1200px]">
        <table className="w-full min-w-[1200px] caption-bottom text-sm">
          <thead className="sticky top-0 bg-background">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">#</th>
              <th className="h-12 px-4 text-left align-middle font-medium min-w-[150px]">Total Net Weight</th>
              <th className="h-12 px-4 text-left align-middle font-medium min-w-[250px]">Average Rate</th>
              <th className="h-12 px-4 text-left align-middle font-medium min-w-[250px]">Total Net Price</th>
              <th className="h-12 px-4 text-left align-middle font-medium min-w-[150px]">Period</th>
              <th className="h-12 px-4 text-left align-middle font-medium min-w-[150px]">Record Count</th>
              {filterCriteria.tin && (
              <th className="h-12 px-4 text-left align-middle font-medium min-w-[250px]">Customer</th>
              )}
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
                reportRecord.map((record: AggregateRecord, index: number) => (
                <tr key={index}
                className={`border-b transition-colors hover:bg-muted/50 ${
                  index % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"
                }`}>
                  <td className="p-4 align-middle">{index + 1}</td>
                  <td className="p-4 align-middle">{formatWeight(record.total_net_weight)}</td>
                  <td className="p-4 align-middle">{record.avg_rate}</td>
                  <td className="p-4 align-middle">{formatCurrency(record.total_net_price)}</td>
                  <td className="p-4 align-middle">{record.formatted_period}</td>
                  <td className="p-4 align-middle">{record.record_count}</td>
                  {filterCriteria.tin && (
                  <td className="p-4 align-middle">
                    <div className="text-sm p-2 bg-muted rounded-md">
                      <p className="font-medium">Customer Name: {extra_info?.customer_info?.fname} {extra_info?.customer_info?.lname}</p>
                      <p className="font-medium">Customer TIN: {filterCriteria.tin}</p>
                      <p className="text-muted-foreground">Business name: {extra_info?.customer_info?.business_name}</p>
                    </div>
                  </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
