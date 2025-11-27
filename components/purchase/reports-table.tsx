"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileSpreadsheet, FileText } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toastUtils } from "@/lib/toast-utils"
import APIFactory  from "@/lib/api-factory"
import { ApiError } from "@/utils/errors"
import { capitalizeFirst } from "@/utils/stringFormatter"
import { localDateFormatter } from "@/utils/dateFormatter"
import { useAuth } from "@/lib/auth-context"
import type { MaterialType } from "@/lib/types/material-types"
import type { Status } from "@/lib/types/status-types"
import { mapMaterialTypes } from "@/utils/material-utils"
import { mapStatus } from "@/utils/status-utils"
import { PurchaseReportFilterParams } from "@/lib/types/purchase-api"
import { PlainReportTable } from "./reportType/plainReportTable"
import { PlainReportPdfGenerator } from './reportTemplates/plainReportPDF'
import { AggregateReportTable } from "./reportType/aggregateReportTable"
import { AggregateReportPdfGenerator } from "./reportTemplates/aggregateReportPDF"
import { DailyPerformanceTable } from "./reportType/dailyPerformanceTable"

interface PurchaseTableProps {
  setMaterialTypes: React.Dispatch<React.SetStateAction<MaterialType[]>>
  setStatus: React.Dispatch<React.SetStateAction<Status[]>>
  onStatsUpdate: (stats: { total: number; approved: number; paid: number; other: number }) => void
  materialTypes: MaterialType[]
  status: Status[]
  filterParams: PurchaseReportFilterParams
}

const plainReport = async (token: string, query: Record<string, string>) => {
  return await APIFactory.purchase.plainReport(token, query)
}

const aggregateReport = async (token: string, query: Record<string, string>) => {
  return await APIFactory.purchase.aggregateReport(token, query)
}

const dailyPerformanceReport = async (token: string, query: Record<string, string>) => {
  return await APIFactory.purchase.dailyPerformanceReport(token, query)
}

export function ReportsTable({ setMaterialTypes, setStatus, filterParams }: PurchaseTableProps) {
  const [purchases, setPurchases] = useState<any[]>([])
  const [reportRecord, setReportRecord] = useState<any[]>([])
  const [recordInfo, setReportInfo] = useState({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(totalCount / pageSize)
  const currentPurchases = purchases // Already the correct page from backend

  const { token, isAuthenticated, isLoading: authLoading, user } = useAuth()

  const [showPdfGenerator, setShowPdfGenerator] = useState(false)

  const fetchPurchases = async () => {
    if (!token) return

    setIsLoading(true)
    try {
      const query: Record<string, string> = {
        page: String(currentPage),
        page_size: String(pageSize)
      }

      // check the type of report
      if (filterParams.tin) query.tin = filterParams.tin
      if (filterParams.materialType) query.materialType = filterParams.materialType
      if (filterParams.status) query.status = filterParams.status
      if (filterParams.plateNumber) query.plateNumber = filterParams.plateNumber
      if (filterParams.startDate) {
        query.startDate = format(filterParams.startDate, "yyyy-MM-dd")
      }
      if (filterParams.endDate) {
        query.endDate = format(filterParams.endDate, "yyyy-MM-dd")
      }

      let res;
      switch (filterParams.type) {
        case "plain":
          res = await plainReport(token, query);
          if (res.data) {
            setReportRecord(res.data.data)
          } else {
            throw new ApiError(res.error || "Error occurred while fetching data.", res.status ?? 400)
          }
          break;
        case "aggregate":
          res = await aggregateReport(token, query);
          if (res.data) {
            setReportRecord(res.data.data.data)
            setReportInfo(res.data.data.extra_info)
          } else {
            throw new ApiError(res.error || "Error occurred while fetching data.", res.status ?? 400)
          }
          break;
        case "daily-performance":
          res = await dailyPerformanceReport(token, query);
          if (res.data) {
            setReportRecord(res.data.data)
          } else {
            throw new ApiError(res.error || "Error occurred while fetching data.", res.status ?? 400)
          }
          break;
        default:
          res = await plainReport(token, query);
          if (res.data) {
            setReportRecord(res.data.data)
          } else {
            throw new ApiError(res.error || "Error occurred while fetching data.", res.status ?? 400)
          }
      }

      const result = await APIFactory.purchase.getRecords(token, query)

      if (result.data) {
        setPurchases(result.data.data.results)
        setMaterialTypes(mapMaterialTypes(result.data.material_types))
        setStatus(mapStatus(result.data.status_list))
        setTotalCount(result.data.data.count)
      } else {
        throw new ApiError(result.error || "Error occurred while fetching data.", result.status ?? 400)
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toastUtils.error(`FAILED TO FETCH (${error.status})`, error instanceof Error ? capitalizeFirst(error.message) : "Error occurred while fetching purchase data.")
      } else {
        toastUtils.error("Unexpected error", "Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && isAuthenticated && token) {
      fetchPurchases()
    }
  }, [authLoading, isAuthenticated, token, filterParams, currentPage, pageSize])

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number.parseInt(value))
    setCurrentPage(1)
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const handleExportExcel = () => {
    alert("Exporting to Excel...")
    // In a real application, you would implement the Excel export functionality here
  }

  const handleExportPDF = async () => {
    if (!token) return

    setIsLoading(true)
    try {
      const query: Record<string, string> = {
        page: String(currentPage),
        page_size: String(pageSize)
      }

      // check the type of report
      if (filterParams.tin) query.tin = filterParams.tin
      if (filterParams.materialType) query.material_type = filterParams.materialType
      if (filterParams.status) query.status = filterParams.status
      if (filterParams.plateNumber) query.plateNumber = filterParams.plateNumber
      if (filterParams.startDate) {
        query.startDate = format(filterParams.startDate, "yyyy-MM-dd")
      }
      if (filterParams.endDate) {
        query.endDate = format(filterParams.endDate, "yyyy-MM-dd")
      }

      let res;
      switch (filterParams.type) {
        case "plain":
          res = await plainReport(token, query);
          break;
        case "aggregate":
          res = await aggregateReport(token, query);
          break;
        case "daily-performance":
          res = await dailyPerformanceReport(token, query);
          break;
        default:
          res = await plainReport(token, query);
      }

      if (res.data) {
        setReportRecord(res.data.data)
      } else {
        throw new ApiError(res.error || "Error occurred while fetching data.", res.status ?? 400)
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toastUtils.error(`FAILED TO FETCH (${error.status})`, error instanceof Error ? capitalizeFirst(error.message) : "Error occurred while fetching purchase data.")
      } else {
        toastUtils.error("Unexpected error", "Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAfterExport = async () => {
    //window.location.reload()
    return
  }

  useEffect(() => {
    if (reportRecord?.length > 0) {
      setShowPdfGenerator(true)
    }
  }, [reportRecord])

  // Prepare report data
  const reportData = {
    reportName: "Purchase Report",
    dateRange: {
      startDate: localDateFormatter(String(filterParams.startDate) || ""),
      endDate: localDateFormatter(String(filterParams.endDate) || ""),
    },
    filterCriteria: {
      materialType: String(filterParams.materialType) || "All",
      status: String(filterParams.status) || "All",
    },
    records: reportRecord,
    companyInfo: {
      name: "Scrap Management Inc.",
      businessInfo: "Reg. No: 123456789",
      email: "info@scrapmanagement.com",
      phone: "+1 (123) 456-7890",
      website: "www.scrapmanagement.com",
      address: "123 Recycling Way, Green City, 12345",
    },
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
        {!filterParams.type && (
         <PlainReportTable reportRecord={currentPurchases} filterCriteria={filterParams}></PlainReportTable>
        )}
        {filterParams.type === "plain" && (
         <PlainReportTable reportRecord={reportRecord} filterCriteria={filterParams}></PlainReportTable>
        )}
        {filterParams.type === "aggregate" && (
          <AggregateReportTable filterCriteria={filterParams} reportRecord={reportRecord} extra_info={recordInfo}></AggregateReportTable>
        )}
        {filterParams.type === "daily-performance" && (
          <DailyPerformanceTable filterCriteria={filterParams} reportRecord={reportRecord}></DailyPerformanceTable>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        {(filterParams.type === undefined || !filterParams.type) &&(
          <>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">Rows per page</p>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
          </>
        )}
        
         {/* PDF Generator */}
         {filterParams.type === "plain" && showPdfGenerator && <PlainReportPdfGenerator data={reportData} onExport={async () => await handleAfterExport()} />}
         {filterParams.type === "aggregate" && showPdfGenerator && <AggregateReportPdfGenerator data={reportData} extra_info={recordInfo} onExport={async () => await handleAfterExport()} />}
      </CardFooter>
    </Card>
  )
}
