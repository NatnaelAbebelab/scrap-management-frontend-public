"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Eye, Edit, Trash, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RateModal } from "@/components/modals/rate-modal"
import { RateViewModal } from "@/components/modals/rate-view-modal"
import { RateEditModal } from "@/components/modals/rate-edit-modal"
import { RateDeleteModal } from "@/components/modals/rate-delete-modal"
import { useToast } from "@/hooks/use-toast"
import { toastUtils } from "@/lib/toast-utils"
import APIFactory  from "@/lib/api-factory"
import { ApiError } from "@/utils/errors"
import { capitalizeFirst } from "@/utils/stringFormatter"
import { formatDate } from "@/utils/dateFormatter"
import { getStatusColor } from "@/utils/statusColor"
import { useAuth } from "@/lib/auth-context"
import type { MaterialType } from "@/lib/types/material-types"
import { mapMaterialTypes } from "@/utils/material-utils"
import { RateFilterParams } from "@/lib/types/rate-api"

interface RateTableProps {
  setMaterialTypes: React.Dispatch<React.SetStateAction<MaterialType[]>>
  materialTypes: MaterialType[]
  filterParams: RateFilterParams
}


export function RateTable({ materialTypes, setMaterialTypes, filterParams }: RateTableProps) {
  const [rates, setRates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRate, setSelectedRate] = useState<any>(null)
  const { toast } = useToast()

  const totalPages = Math.ceil(totalCount / pageSize)
  const currentRates = rates // Already the correct page from backend

  const { token, isAuthenticated, isLoading: authLoading } = useAuth()

  const fetchRates = async () => {
    if (!token) return

    setIsLoading(true)
    try {
      const query: Record<string, string> = {
        page: String(currentPage),
        page_size: String(pageSize)
      }

      if (filterParams.materialType) query.material_type = filterParams.materialType
      if (filterParams.status) query.status = filterParams.status
      if (filterParams.expiryDate) {
        query.expiry_date = format(filterParams.expiryDate, "yyyy-MM-dd")
      }

      const res = await APIFactory.purchase.getRates(token, query)

      if (res.data) {
        setRates(res.data.data.results)
        setMaterialTypes(mapMaterialTypes(res.data.material_types))
        setTotalCount(res.data.data.count)
      } else {
        throw new ApiError(res.error || "Error occurred while fetching data.", res.status ?? 400)
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toastUtils.error(`FAILED TO FETCH (${error.status})`, error instanceof Error ? capitalizeFirst(error.message) : "Error occurred while fetching rate data.")
      } else {
        toastUtils.error("Unexpected error", "Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && isAuthenticated && token) {
      fetchRates()
    }
  }, [authLoading, isAuthenticated, token, filterParams, currentPage, pageSize])

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number.parseInt(value))
    setCurrentPage(1)
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const handleCreateRate = (newRate: any) => {
    const id = rates.length > 0 ? Math.max(...rates.map((rate) => rate.id)) + 1 : 1
    const rateWithId = { ...newRate, id, date: new Date() }
    setRates([rateWithId, ...rates])
    setIsCreateModalOpen(false)
    toastUtils.success("Rate Created", `New rate for ${newRate.materialType} has been created successfully.`)
  }

  const handleViewRate = (rate: any) => {
    setSelectedRate(rate)
    setIsViewModalOpen(true)
  }

  const handleEditRate = (rate: any) => {
    setSelectedRate(rate)
    setIsEditModalOpen(true)
  }

  const handleDeleteRate = (rate: any) => {
    setSelectedRate(rate)
    setIsDeleteModalOpen(true)
  }

  const handleUpdateRate = (updatedRate: any) => {
    const updatedRates = rates.map((rate) => (rate.id === updatedRate.id ? { ...rate, ...updatedRate } : rate))
    setRates(updatedRates)
    setIsEditModalOpen(false)
    toastUtils.success("Rate Updated", `Rate for ${updatedRate.materialType} has been updated successfully.`)
  }

  const handleConfirmDelete = () => {
    if (selectedRate) {
      const updatedRates = rates.filter((rate) => rate.id !== selectedRate.id)
      setRates(updatedRates)
      setIsDeleteModalOpen(false)
      toastUtils.success("Rate Deleted", `Rate for ${selectedRate.materialType} has been deleted successfully.`)
    }
  }
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
                <CardTitle>Purchase Rates</CardTitle>
                <CardDescription style={{ paddingTop: '5px' }}>
                Set and manage rates for different material types in the purchase process
                </CardDescription>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Rate
            </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative max-h-[500px] overflow-auto">
              <table className="w-full min-w-[1200px] caption-bottom text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b transition-colors">
                    <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Material Type</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Heavy Rate (Br)</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Medium Rate (Br)</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Light Rate (Br)</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Fixed Rate (Br)</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Expiry Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {currentRates.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center p-4">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  currentRates.map((rate, index) => (
                    <tr
                      key={rate._id}
                      className={`border-b transition-colors hover:bg-muted/50 ${
                        index % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"
                      }`}
                    >
                      <td className="p-4 align-middle">{index + 1}</td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        >
                          {capitalizeFirst(rate.material_type)}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">{rate.heavy_rate ? `Br.${rate.heavy_rate}` : "-"}</td>
                      <td className="p-4 align-middle">{rate.medium_rate ? `Br.${rate.medium_rate}` : "-"}</td>
                      <td className="p-4 align-middle">{rate.light_rate ? `Br.${rate.light_rate}` : "-"}</td>
                      <td className="p-4 align-middle">{rate.fixed_rate ? `Br.${rate.fixed_rate}` : "-"}</td>
                      <td className="p-4 align-middle">
                        <Badge className={getStatusColor(rate.status)}>{capitalizeFirst(rate.status)}</Badge>
                      </td>
                      <td className="p-4 align-middle">{formatDate(rate.expired_date)}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewRate(rate)}
                            aria-label="View rate"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditRate(rate)}
                            aria-label="Edit rate"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRate(rate)}
                            aria-label="Delete rate"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
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
                disabled={currentPage === totalPages}
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

      {/* Create Rate Modal */}
      <RateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRate}
        materialTypes={materialTypes}
        _token={token || ""}
        reloadData={fetchRates}/>
      
      {/* View Rate Modal */}
      {selectedRate && (
        <RateViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} rate={selectedRate} />
      )}

      {/* Edit Rate Modal */}
      {selectedRate && (
        <RateEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          rate={selectedRate}
          onSubmit={handleUpdateRate}
          materialTypes={materialTypes}
          _token={token || ""}
          reloadData={fetchRates}/>
      )}

      {/* Delete Rate Modal */}
      {selectedRate && (
        <RateDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          rate={selectedRate}
          onConfirm={handleConfirmDelete}
          materialTypes={materialTypes}
          _token={token || ""}
          reloadData={fetchRates}/>
      )}
    </>
  )
}
