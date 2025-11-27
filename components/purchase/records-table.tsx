"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,  Eye, Edit, Trash, Send, ArrowLeftRight } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ViewRecordModal } from "@/components/modals/view-record-modal"
import { EditStatusModal } from "@/components/modals/edit-status-modal"
import { DeleteConfirmModal } from "@/components/modals/delete-confirm-modal"
import { PayCustomerModal } from "@/components/modals/pay-customer-modal"
import { BulkEditStatusModal } from "@/components/modals/bulk-edit-status-modal"
import { BulkDeleteConfirmModal } from "@/components/modals/bulk-delete-confirm-modal"
import { StatusBasedContent } from "../status-based-content"
import { RoleBasedContent } from "../role-based-content"
import { toastUtils } from "@/lib/toast-utils"
import APIFactory  from "@/lib/api-factory"
import { ApiError } from "@/utils/errors"
import { capitalizeFirst } from "@/utils/stringFormatter"
import { formatDate } from "@/utils/dateFormatter"
import { useAuth } from "@/lib/auth-context"
import type { MaterialType } from "@/lib/types/material-types"
import type { Status } from "@/lib/types/status-types"
import { mapMaterialTypes } from "@/utils/material-utils"
import { mapStatus } from "@/utils/status-utils"
import { getStatusColor } from "@/utils/statusColor"
import { PurchaseFilterParams } from "@/lib/types/purchase-api"

interface PurchaseTableProps {
  setMaterialTypes: React.Dispatch<React.SetStateAction<MaterialType[]>>
  setStatus: React.Dispatch<React.SetStateAction<Status[]>>
  onStatsUpdate: (stats: { total: number; approved: number; paid: number; other: number }) => void
  materialTypes: MaterialType[]
  status: Status[]
  filterParams: PurchaseFilterParams
}

export function RecordsTable({ materialTypes, setMaterialTypes, setStatus, onStatsUpdate , status, filterParams }: PurchaseTableProps) {
  const [purchases, setPurchases] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [bulkEditModalOpen, setBulkEditModalOpen] = useState(false)
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)

  const totalPages = Math.ceil(totalCount / pageSize)
  const currentPurchases = purchases // Already the correct page from backend

  const { token, isAuthenticated, isLoading: authLoading, user } = useAuth()

  const fetchPurchases = async () => {
    if (!token) return

    setIsLoading(true)
    try {
      const query: Record<string, string> = {
        page: String(currentPage),
        page_size: String(pageSize)
      }

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

      const res = await APIFactory.purchase.getRecords(token, query)

      if (res.data) {
        setPurchases(res.data.data.results)
        setMaterialTypes(mapMaterialTypes(res.data.material_types))
        setStatus(mapStatus(res.data.status_list))
        setTotalCount(res.data.data.count)

        // Send stats to parent
        onStatsUpdate({
          total: res.data.totalRecordsCount ?? 0,
          approved: res.data.approvedRecordsCount ?? 0,
          paid: res.data.paidRecordsCount ?? 0,
          other: res.data.otherRecordsCount ?? 0,
        });
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

  useEffect(() => {
    if (!authLoading && isAuthenticated && token) {
      fetchPurchases()
    }
  }, [authLoading, isAuthenticated, token, filterParams, currentPage, pageSize])

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number.parseInt(value))
    setCurrentPage(1)
    setSelectedRecords([]) // Clear selections when changing page size
    setSelectAll(false)
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
    setSelectedRecords([]) // Clear selections when changing page size
    setSelectAll(false)
  }

  // Handle checkbox selection
  const handleSelectRecord = (id: string) => {
    setSelectedRecords((prev) => {
      if (prev.includes(id)) {
        return prev.filter((recordId) => recordId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRecords([])
    } else {
      setSelectedRecords(currentPurchases.map((record) => record.record_no))
    }
    setSelectAll(!selectAll)
  }

  // Open view modal
  const handleViewRecord = (record: any) => {
    setCurrentRecord(record)
    setViewModalOpen(true)
  }

  // Open edit modal
  const handleEditRecord = (record: any) => {
    setCurrentRecord(record)
    setEditModalOpen(true)
  }

  // Open delete modal
  const handleDeleteRecord = (record: any) => {
    setCurrentRecord(record)
    setDeleteModalOpen(true)
  }

  // pay customer
  const handlePayCustomer = (record: any) => {
    setCurrentRecord(record)
    setPayModalOpen(true)
  }

  // Handle bulk edit
  const handleBulkEdit = () => {
    if (selectedRecords.length === 0) {
      toastUtils.warning("No records selected", "Please select at least one record to edit")
      return
    }
    setBulkEditModalOpen(true)
  }

  // Handle bulk delete
  const openBulkDeleteModal = () => {
    if (selectedRecords.length === 0) {
      toastUtils.warning("No records selected", "Please select at least one record to delete")
      return
    }
    setBulkDeleteModalOpen(true)
  }

  // Remove a record from selection (used in bulk modals)
  const removeFromSelection = (id: string) => {
    setSelectedRecords((prev) => prev.filter((recordId) => recordId !== id))
  }

  // Get selected records data
  const getSelectedRecordsData = () => {
    return currentPurchases.filter((record) => selectedRecords.includes(record.record_no))
  }

  // Handle status change for a single record
  const handleStatusChange = async (title: string, message: string) => {
    toastUtils.success(title, message)
    setEditModalOpen(false)
    await fetchPurchases() // on success
  }

  // Handle bulk status change
  const handleBulkStatusChange = async (title: string, message: string) => {
    toastUtils.success(title, message)
    setBulkEditModalOpen(false)
    setSelectedRecords([])
    setSelectAll(false)
    await fetchPurchases()
  }

  // Handle delete for a single record
  const handleDelete = async (record: string) => {
    toastUtils.success("Purchase Record Delete", `Record #${record} has been delete.`)
    setDeleteModalOpen(false)
    await fetchPurchases()
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    // In a real app, you would call an API to delete the records
    toastUtils.success("Records deleted", `${selectedRecords.length} records have been deleted`)
    setBulkDeleteModalOpen(false)
    setSelectedRecords([])
    setSelectAll(false)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Purchase Records</CardTitle>
          {selectedRecords.length > 0 && (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleBulkEdit}>
                Edit Selected ({selectedRecords.length})
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="w-full overflow-x-auto overflow-y-auto max-h-[600px] max-w-[1200px]">
              <table className="w-full min-w-[1200px] caption-bottom text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <RoleBasedContent requiredRole={["super_admin", "purchaser", "inspector", "purchase_head", "finance", "manager"]}>
                      <th className="h-12 w-[40px] px-4 text-left align-middle">
                        <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="Select all records" />
                      </th>
                    </RoleBasedContent>
                    <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
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
                    <th className="h-12 px-4 text-left align-middle font-medium right-0">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {currentPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center p-4">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  currentPurchases.map((record, index) => (
                    <tr key={record._id}
                    className={`border-b transition-colors hover:bg-muted/50 ${
                      index % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"
                    }`}>
                      <RoleBasedContent requiredRole={["super_admin", "purchaser", "inspector", "purchase_head", "finance", "manager"]}>
                        <td className="p-4 align-middle">
                          <Checkbox
                            checked={selectedRecords.includes(record.record_no)}
                            onCheckedChange={() => handleSelectRecord(record.record_no)}
                            aria-label={`Select record ${record.record_no}`}
                          />
                        </td>
                      </RoleBasedContent>
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
                      <td className="p-4 align-middle">{record.first_weight}</td>
                      <td className="p-4 align-middle">{record.second_weight}</td>
                      <td className="p-4 align-middle">
                        <div className="text-sm p-2 bg-muted rounded-md space-y-1">
                          <p className="font-medium">Net Weight: {record.net_weight}</p>
                          <div className="inline-block text-muted-foreground text-xs px-2 py-1 rounded-full">
                            <span className="inline-block bg-muted-foreground/10 text-muted-foreground text-xs mb-1 mr-1 px-2 py-1 rounded-full">
                              H: {record.heavy_grade}
                            </span>
                            <span className="inline-block bg-muted-foreground/10 text-muted-foreground text-xs mb-1 mr-1 px-2 py-1 rounded-full">
                              M: {record.medium_grade}
                            </span>
                            <span className="inline-block bg-muted-foreground/10 text-muted-foreground text-xs mb-1 mr-1 px-2 py-1 rounded-full">
                              L: {record.light_grade}
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
                            {record.waste_deduction}
                          </Badge>
                      </td>
                      <td className="p-4 align-middle">Br.{record.amount}</td>
                      <td className="p-4 align-middle">{formatDate(record.first_date)}</td>
                      <td className="p-4 align-middle">
                        <Badge className={getStatusColor(record.status)}>{capitalizeFirst(record.status)}</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewRecord(record)}
                            aria-label="View record"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <RoleBasedContent requiredRole={["super_admin", "purchaser", "inspector", "purchase_head", "supervisor", "finance", "manager"]}>
                            <StatusBasedContent requiredStatus={["new", "prepared", "inspected", "verified", "approved"]} status={record.status}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditRecord(record)}
                                aria-label="Edit record"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </StatusBasedContent>
                          </RoleBasedContent>
                          <RoleBasedContent requiredRole={["super_admin", "purchaser", "inspector", "purchase_head", "supervisor", "manager"]}>
                            <StatusBasedContent requiredStatus={["new", "prepared", "inspected", "verified", "approved"]} status={record.status}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteRecord(record)}
                                aria-label="Delete record"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </StatusBasedContent>
                          </RoleBasedContent>
                          <RoleBasedContent requiredRole={["super_admin", "finance"]}>
                            <StatusBasedContent requiredStatus={["approved"]} status={record.status}>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handlePayCustomer(record)}
                                      aria-label="Delete record"
                                    >
                                      <ArrowLeftRight className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Pay Customer</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </StatusBasedContent>
                          </RoleBasedContent>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">Rows per page</p>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
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
        </CardFooter>
      </Card>

      {/* View Record Modal */}
      <ViewRecordModal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} record={currentRecord} />

      {/* Edit Status Modal */}
      <EditStatusModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        record={currentRecord}
        status={status}
        onStatusChange={handleStatusChange}
        _token={token || ""}/>

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        record={currentRecord}
        onDelete={handleDelete}
        _token={token || ""}/>

      {/* Pay Customer Modal */}
      <PayCustomerModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        record={currentRecord}
        onStatusChange={handleStatusChange}
        _token={token || ""}/>

      {/* Bulk Edit Status Modal */}
      <BulkEditStatusModal
        isOpen={bulkEditModalOpen}
        onClose={() => setBulkEditModalOpen(false)}
        selectedRecords={getSelectedRecordsData()}
        onRemoveRecord={removeFromSelection}
        onStatusChange={handleBulkStatusChange}
        status={status}
        _token={token || ""}/>

      {/* Bulk Delete Confirm Modal */}
      <BulkDeleteConfirmModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        selectedRecords={getSelectedRecordsData()}
        onRemoveRecord={removeFromSelection}
        onDelete={handleBulkDelete}/>
    </>
  )
}
