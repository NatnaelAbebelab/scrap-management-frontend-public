"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import React from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  FileEdit,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { format } from "date-fns"
import { AgreementModal } from "@/components/modals/agreement-modal"
import { AgreementViewModal } from "@/components/modals/agreement-view-modal"
import { AgreementEditModal } from "@/components/modals/agreement-edit-modal"
import { AgreementDeleteModal } from "@/components/modals/agreement-delete-modal"
import { toastUtils } from "@/lib/toast-utils"

// Mock data for agreements
const mockAgreements = [
  {
    id: "1",
    agreementName: "Paper Recycling Agreement 2023",
    agency: { tin: "123456789", businessName: "Eco Recycling Solutions" },
    materialType: "paper",
    effectiveDate: new Date("2023-01-15"),
    proofFile: "paper_agreement_2023.pdf",
    ranges: [
      { id: "1-1", min: 0, max: 100, rate: 0.5 },
      { id: "1-2", min: 100, max: 500, rate: 0.75 },
      { id: "1-3", min: 500, max: 1000, rate: 1.0 },
    ],
  },
  {
    id: "2",
    agreementName: "Plastic Collection Agreement",
    agency: { tin: "987654321", businessName: "Green Earth Recyclers" },
    materialType: "plastic",
    effectiveDate: new Date("2023-03-22"),
    proofFile: "plastic_agreement.pdf",
    ranges: [
      { id: "2-1", min: 0, max: 200, rate: 0.3 },
      { id: "2-2", min: 200, max: 800, rate: 0.6 },
    ],
  },
  {
    id: "3",
    agreementName: "Metal Scrap Collection",
    agency: { tin: "456789123", businessName: "Sustainable Materials Co." },
    materialType: "metal",
    effectiveDate: new Date("2023-05-10"),
    proofFile: "metal_agreement.pdf",
    ranges: [
      { id: "3-1", min: 0, max: 50, rate: 1.2 },
      { id: "3-2", min: 50, max: 150, rate: 1.5 },
      { id: "3-3", min: 150, max: 500, rate: 1.8 },
    ],
  },
  {
    id: "4",
    agreementName: "Glass Recycling Partnership",
    agency: { tin: "789123456", businessName: "Urban Waste Management" },
    materialType: "glass",
    effectiveDate: new Date("2023-07-05"),
    proofFile: "glass_agreement.pdf",
    ranges: [
      { id: "4-1", min: 0, max: 300, rate: 0.4 },
      { id: "4-2", min: 300, max: 1000, rate: 0.7 },
    ],
  },
  {
    id: "5",
    agreementName: "Electronic Waste Processing",
    agency: { tin: "321654987", businessName: "City Recycling Services" },
    materialType: "electronic",
    effectiveDate: new Date("2023-09-18"),
    proofFile: "ewaste_agreement.pdf",
    ranges: [
      { id: "5-1", min: 0, max: 100, rate: 2.0 },
      { id: "5-2", min: 100, max: 300, rate: 2.5 },
      { id: "5-3", min: 300, max: 600, rate: 3.0 },
    ],
  },
  {
    id: "6",
    agreementName: "Electronic Waste Processing",
    agency: { tin: "321654987", businessName: "City Recycling Services" },
    materialType: "electronic",
    effectiveDate: new Date("2023-09-18"),
    proofFile: "ewaste_agreement.pdf",
    ranges: [
      { id: "5-1", min: 0, max: 100, rate: 2.0 },
      { id: "5-2", min: 100, max: 300, rate: 2.5 },
      { id: "5-3", min: 300, max: 600, rate: 3.0 },
    ],
  },
  {
    id: "7",
    agreementName: "Electronic Waste Processing",
    agency: { tin: "321654987", businessName: "City Recycling Services" },
    materialType: "electronic",
    effectiveDate: new Date("2023-09-18"),
    proofFile: "ewaste_agreement.pdf",
    ranges: [
      { id: "5-1", min: 0, max: 100, rate: 2.0 },
      { id: "5-2", min: 100, max: 300, rate: 2.5 },
      { id: "5-3", min: 300, max: 600, rate: 3.0 },
    ],
  },
]

export function AgreementTable() {
  const [agreements, setAgreements] = useState(mockAgreements)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null)
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const totalPages = Math.ceil(agreements.length / rowsPerPage)

  const paginatedAgreements = agreements.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const toggleAllRows = () => {
    if (selectedRows.length === paginatedAgreements.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedAgreements.map((agreement) => agreement.id))
    }
  }

  const handleAddAgreement = (data: any) => {
    const newAgreement = {
      ...data,
      id: (agreements.length + 1).toString(),
    }
    setAgreements([...agreements, newAgreement])
    setIsAddModalOpen(false)
    toastUtils.success("Agreement Created", "The agreement has been successfully created.")
  }

  const handleUpdateAgreement = (data: any) => {
    setAgreements(agreements.map((agreement) => (agreement.id === data.id ? { ...agreement, ...data } : agreement)))
    toastUtils.success("Agreement Updated", "The agreement information has been successfully updated.")
  }

  const handleUpdateRanges = (data: any) => {
    setAgreements(
      agreements.map((agreement) => (agreement.id === data.id ? { ...agreement, ranges: data.ranges } : agreement)),
    )
    toastUtils.success("Ranges Updated", "The agreement ranges have been successfully updated.")
  }

  const handleDeleteAgreement = () => {
    setAgreements(agreements.filter((agreement) => agreement.id !== selectedAgreement.id))
    setIsDeleteModalOpen(false)
    setSelectedAgreement(null)
    toastUtils.success("Agreement Deleted", "The agreement and its ranges have been successfully deleted.")
  }

  const openViewModal = (agreement: any) => {
    setSelectedAgreement(agreement)
    setIsViewModalOpen(true)
  }

  const openEditModal = (agreement: any) => {
    setSelectedAgreement(agreement)
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (agreement: any) => {
    setSelectedAgreement(agreement)
    setIsDeleteModalOpen(true)
  }

  const getMaterialTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      paper: "bg-blue-100 text-blue-800",
      plastic: "bg-green-100 text-green-800",
      metal: "bg-yellow-100 text-yellow-800",
      glass: "bg-purple-100 text-purple-800",
      organic: "bg-orange-100 text-orange-800",
      electronic: "bg-red-100 text-red-800",
    }

    return <Badge className={`${colors[type] || "bg-gray-100 text-gray-800"} capitalize`}>{type}</Badge>
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
              <CardTitle>Agreement Management</CardTitle>
              <CardDescription style={{ paddingTop: '5px' }}>
                Manage agreements and rate ranges with agencies
              </CardDescription>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Agreement
          </Button>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <div className="relative max-h-[500px] overflow-auto">
              <Table>
                <TableHeader className="bg-white sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[120px]"></TableHead>
                    <TableHead>Agreement Name</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Material Type</TableHead>
                    <TableHead>Effective Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAgreements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No agreements found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedAgreements.map((agreement) => (
                      <React.Fragment key={agreement.id}>
                        <TableRow
                          key={agreement.id}
                          className={selectedRows.includes(agreement.id) ? "bg-muted/50" : ""}
                        >
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => toggleRowExpansion(agreement.id)}>
                              {expandedRows.includes(agreement.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium">{agreement.agreementName}</TableCell>
                          <TableCell>
                            <div>
                              <div>{agreement.agency.tin}</div>
                              <div className="text-xs text-muted-foreground">{agreement.agency.businessName}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getMaterialTypeBadge(agreement.materialType)}</TableCell>
                          <TableCell>{format(new Date(agreement.effectiveDate), "PP")}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openViewModal(agreement)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openEditModal(agreement)}>
                                <FileEdit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openDeleteModal(agreement)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>

                        {expandedRows.includes(agreement.id) && (
                          <TableRow className="bg-muted/30">
                            <TableCell colSpan={7} className="p-0">
                              <div className="px-4 py-2">
                                <div className="text-sm font-medium mb-2">Agreement Ranges</div>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Range</TableHead>
                                      <TableHead>Minimum</TableHead>
                                      <TableHead>Maximum</TableHead>
                                      <TableHead>Rate</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {agreement.ranges.map((range: any, index: number) => (
                                      <TableRow key={range.id}>
                                        <TableCell className="font-medium">Range {index + 1}</TableCell>
                                        <TableCell>{range.min}</TableCell>
                                        <TableCell>{range.max}</TableCell>
                                        <TableCell>${range.rate.toFixed(2)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">Rows per page</p>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => {
                setRowsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={rowsPerPage.toString()} />
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
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      <AgreementModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddAgreement} />

      <AgreementViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        agreement={selectedAgreement}
      />

      <AgreementEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        agreement={selectedAgreement}
        onUpdateAgreement={handleUpdateAgreement}
        onUpdateRanges={handleUpdateRanges}
      />

      <AgreementDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAgreement}
        agreement={selectedAgreement}
      />
    </>
  )
}
