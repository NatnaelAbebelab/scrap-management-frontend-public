"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Edit, Trash, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { toastUtils } from "@/lib/toast-utils"
import AgencyRegisterModal from "@/components/modals/agency-register-modal"
import AgencyViewModal from "@/components/modals/agency-view-modal"
import AgencyEditModal from "@/components/modals/agency-edit-modal"
import AgencyDeleteModal from "@/components/modals/agency-delete-modal"

// Mock data for agencies
const mockAgencies = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    tin: "123456789",
    businessName: "JD Transport Co.",
    agreement: "Annual",
    remainingAmount: 25000,
    paidAmount: 75000,
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    tin: "987654321",
    businessName: "Smith Logistics",
    agreement: "Monthly",
    remainingAmount: 5000,
    paidAmount: 15000,
  },
  {
    id: 3,
    firstName: "Robert",
    lastName: "Johnson",
    tin: "456789123",
    businessName: "RJ Carriers",
    agreement: "Quarterly",
    remainingAmount: 12000,
    paidAmount: 48000,
  },
  {
    id: 4,
    firstName: "Emily",
    lastName: "Williams",
    tin: "789123456",
    businessName: "Williams Transport",
    agreement: "Annual",
    remainingAmount: 30000,
    paidAmount: 70000,
  },
  {
    id: 5,
    firstName: "Michael",
    lastName: "Brown",
    tin: "321654987",
    businessName: "Brown Shipping",
    agreement: "Monthly",
    remainingAmount: 3000,
    paidAmount: 27000,
  },
  {
    id: 6,
    firstName: "Sarah",
    lastName: "Davis",
    tin: "654987321",
    businessName: "Davis Freight",
    agreement: "Quarterly",
    remainingAmount: 18000,
    paidAmount: 42000,
  },
  {
    id: 7,
    firstName: "David",
    lastName: "Miller",
    tin: "159753468",
    businessName: "Miller Logistics",
    agreement: "Annual",
    remainingAmount: 40000,
    paidAmount: 60000,
  },
  {
    id: 8,
    firstName: "Lisa",
    lastName: "Wilson",
    tin: "753159486",
    businessName: "Wilson Carriers",
    agreement: "Monthly",
    remainingAmount: 8000,
    paidAmount: 32000,
  },
  {
    id: 9,
    firstName: "James",
    lastName: "Taylor",
    tin: "486753159",
    businessName: "Taylor Transport",
    agreement: "Quarterly",
    remainingAmount: 15000,
    paidAmount: 45000,
  },
  {
    id: 10,
    firstName: "Patricia",
    lastName: "Anderson",
    tin: "258369147",
    businessName: "Anderson Logistics",
    agreement: "Annual",
    remainingAmount: 35000,
    paidAmount: 65000,
  },
  {
    id: 11,
    firstName: "Richard",
    lastName: "Thomas",
    tin: "147258369",
    businessName: "Thomas Shipping",
    agreement: "Monthly",
    remainingAmount: 4000,
    paidAmount: 16000,
  },
  {
    id: 12,
    firstName: "Jennifer",
    lastName: "Jackson",
    tin: "369147258",
    businessName: "Jackson Freight",
    agreement: "Quarterly",
    remainingAmount: 20000,
    paidAmount: 40000,
  },
]

export default function AgencyTable() {
  const { toast } = useToast()
  const [agencies, setAgencies] = useState(mockAgencies)
  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAgencies, setSelectedAgencies] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Modal states
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentAgency, setCurrentAgency] = useState<any>(null)

  const totalPages = Math.ceil(agencies.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = agencies.slice(startIndex, endIndex)

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number.parseInt(value))
    setCurrentPage(1) // Reset to first page when changing page size
    setSelectedAgencies([]) // Clear selections when changing page size
    setSelectAll(false)
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
    setSelectedAgencies([]) // Clear selections when changing page
    setSelectAll(false)
  }

  // Handle checkbox selection
  const handleSelectAgency = (id: number) => {
    setSelectedAgencies((prev) => {
      if (prev.includes(id)) {
        return prev.filter((agencyId) => agencyId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAgencies([])
    } else {
      setSelectedAgencies(currentData.map((agency) => agency.id))
    }
    setSelectAll(!selectAll)
  }

  const handleRegister = (newAgency: any) => {
    const id = agencies.length > 0 ? Math.max(...agencies.map((a) => a.id)) + 1 : 1
    const agencyWithId = { ...newAgency, id, remainingAmount: 0, paidAmount: 0 }
    setAgencies([...agencies, agencyWithId])
    setIsRegisterModalOpen(false)
    toastUtils.success("Agency registered", "The agency has been successfully registered.")
  }

  const handleEdit = (updatedAgency: any) => {
    setAgencies(agencies.map((agency) => (agency.id === updatedAgency.id ? updatedAgency : agency)))
    setIsEditModalOpen(false)
    toastUtils.success("Agency updated", "The agency has been successfully updated.")
  }

  const handleDelete = (id: number) => {
    setAgencies(agencies.filter((agency) => agency.id !== id))
    setIsDeleteModalOpen(false)
    toastUtils.success("Agency deleted", "The agency has been successfully deleted.")
  }

  // Open view modal
  const handleViewAgency = (agency: any) => {
    setCurrentAgency(agency)
    setIsViewModalOpen(true)
  }

  // Open edit modal
  const handleEditAgency = (agency: any) => {
    setCurrentAgency(agency)
    setIsEditModalOpen(true)
  }

  // Open delete modal
  const handleDeleteAgency = (agency: any) => {
    setCurrentAgency(agency)
    setIsDeleteModalOpen(true)
  }

  // Get agreement badge color
  const getAgreementColor = (agreement: string) => {
    switch (agreement) {
      case "Annual":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Quarterly":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Monthly":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
                <CardTitle>Agency Management</CardTitle>
                <CardDescription style={{ paddingTop: '5px' }}>
                    View and manage agencies for internal transportation.
                </CardDescription>
            </div>
            <Button onClick={() => setIsRegisterModalOpen(true)} className="gap-1">
              <Plus className="h-4 w-4" />
              Register Agency
            </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative max-h-[500px] overflow-auto">
              <table className="w-full min-w-[1200px] caption-bottom text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b transition-colors bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">TIN</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Business Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Agreement</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Remaining Amount</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Paid Amount</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((agency, index) => (
                    <tr
                      key={agency.id}
                      className={`border-b transition-colors hover:bg-muted/50 ${
                        index % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"
                      }`}
                    >
                      <td className="p-4 align-middle">{agency.id}</td>
                      <td className="p-4 align-middle">{`${agency.firstName} ${agency.lastName}`}</td>
                      <td className="p-4 align-middle">{agency.tin}</td>
                      <td className="p-4 align-middle">{agency.businessName}</td>
                      <td className="p-4 align-middle">
                        <Badge className={getAgreementColor(agency.agreement)}>{agency.agreement}</Badge>
                      </td>
                      <td className="p-4 align-middle">₹{agency.remainingAmount.toLocaleString()}</td>
                      <td className="p-4 align-middle">₹{agency.paidAmount.toLocaleString()}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewAgency(agency)}
                            aria-label="View agency"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditAgency(agency)}
                            aria-label="Edit agency"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAgency(agency)}
                            aria-label="Delete agency"
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

      {/* Modals */}
      <AgencyRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegister}
      />

      {currentAgency && (
        <>
          <AgencyViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} agency={currentAgency} />

          <AgencyEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            agency={currentAgency}
            onEdit={handleEdit}
          />

          <AgencyDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            agency={currentAgency}
            onDelete={() => handleDelete(currentAgency.id)}
          />
        </>
      )}
    </>
  )
}
