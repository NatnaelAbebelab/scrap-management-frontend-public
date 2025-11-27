"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Edit, Trash } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ViewRecordModal } from "@/components/modals/view-record-modal"
import { EditStatusModal } from "@/components/modals/edit-status-modal"
import { DeleteConfirmModal } from "@/components/modals/delete-confirm-modal"
import { BulkEditStatusModal } from "@/components/modals/bulk-edit-status-modal"
import { BulkDeleteConfirmModal } from "@/components/modals/bulk-delete-confirm-modal"
import { toastUtils } from "@/lib/toast-utils"
import { getStatusColor } from "@/utils/statusColor"

// Mock data for the table
const mockData = Array.from({ length: 100 }).map((_, i) => ({
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

export function InternalRecordsTable() {
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRecords, setSelectedRecords] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bulkEditModalOpen, setBulkEditModalOpen] = useState(false)
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)

  const totalPages = Math.ceil(mockData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = mockData.slice(startIndex, endIndex)

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number.parseInt(value))
    setCurrentPage(1) // Reset to first page when changing page size
    setSelectedRecords([]) // Clear selections when changing page size
    setSelectAll(false)
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
    setSelectedRecords([]) // Clear selections when changing page size
    setSelectAll(false)
  }

  // Handle checkbox selection
  const handleSelectRecord = (id: number) => {
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
      setSelectedRecords(currentData.map((record) => record.id))
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
  const removeFromSelection = (id: number) => {
    setSelectedRecords((prev) => prev.filter((recordId) => recordId !== id))
  }

  // Get selected records data
  const getSelectedRecordsData = () => {
    return mockData.filter((record) => selectedRecords.includes(record.id))
  }

  // Handle status change for a single record
  const handleStatusChange = async (title: string, message: string) => {
    toastUtils.success(title, message)
    setEditModalOpen(false)
    //await fetchPurchases() // on success
  }

  // Handle bulk status change
  const handleBulkStatusChange = (newStatus: string) => {
    // In a real app, you would call an API to update the statuses
    toastUtils.success("Statuses updated", `${selectedRecords.length} records updated to ${newStatus}`)
    setBulkEditModalOpen(false)
    setSelectedRecords([])
    setSelectAll(false)
  }

  // Handle delete for a single record
  const handleDelete = (id: number) => {
    // In a real app, you would call an API to delete the record
    toastUtils.success("Record deleted", `Record #${id} has been deleted`)
    setDeleteModalOpen(false)
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
          <CardTitle>Internal Transport Records</CardTitle>
          {selectedRecords.length > 0 && (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleBulkEdit}>
                Edit Selected ({selectedRecords.length})
              </Button>
              <Button variant="destructive" onClick={openBulkDeleteModal}>
                Delete Selected ({selectedRecords.length})
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative max-h-[500px] overflow-auto">
              <table className="w-full min-w-[800px] caption-bottom text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 w-[40px] px-4 text-left align-middle">
                      <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="Select all records" />
                    </th>
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
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((record) => (
                    <tr key={record.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">
                        <Checkbox
                          checked={selectedRecords.includes(record.id)}
                          onCheckedChange={() => handleSelectRecord(record.id)}
                          aria-label={`Select record ${record.id}`}
                        />
                      </td>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditRecord(record)}
                            aria-label="Edit record"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRecord(record)}
                            aria-label="Delete record"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
        onStatusChange={handleStatusChange}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        record={currentRecord}
        onDelete={handleDelete}
      />

      {/* Bulk Edit Status Modal */}
      <BulkEditStatusModal
        isOpen={bulkEditModalOpen}
        onClose={() => setBulkEditModalOpen(false)}
        selectedRecords={getSelectedRecordsData()}
        onRemoveRecord={removeFromSelection}
        onStatusChange={handleBulkStatusChange}
      />

      {/* Bulk Delete Confirm Modal */}
      <BulkDeleteConfirmModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        selectedRecords={getSelectedRecordsData()}
        onRemoveRecord={removeFromSelection}
        onDelete={handleBulkDelete}
      />
    </>
  )
}
