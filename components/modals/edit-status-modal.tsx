"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { X, Upload, FileText, ImageIcon, File, ChevronLeft, ChevronRight, AlertCircle, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Status } from "@/lib/types/status-types"
import { capitalizeFirst } from "@/utils/stringFormatter"
import { getStatusColor } from "@/utils/statusColor"
import { useAuth } from "@/lib/auth-context"
import { toastUtils } from "@/lib/toast-utils"
import APIFactory  from "@/lib/api-factory"
import { ApiError } from "@/utils/errors"
import { RoleBasedContent } from "@/components/role-based-content"

interface EditStatusModalProps {
  isOpen: boolean
  onClose: () => void
  record: any
  onStatusChange: (title: string, message: string) => void
  status: Status[]
  _token: string
}

type FileWithPreview = {
  file: File
  preview: string
  type: string
}

type DocumentType = "grn" | "approve" | "scale"

interface DocumentFile {
  grn: FileWithPreview | null
  approve: FileWithPreview | null
  scale: FileWithPreview | null
}

export function EditStatusModal({ isOpen, onClose, record, onStatusChange, status, _token }: EditStatusModalProps) {
  const [newStatus, setNewStatus] = useState<string>("")
  const [grnNo, setGRNNo] = useState<number | undefined>(undefined)
  const [grnError, setGRNError] = useState<string | null>(null)
  const [isAddWaste, setIsAddWaste] = useState(false)
  const [waste, setWaste] = useState<number | undefined>(undefined)
  const [wasteError, setWasteError] = useState<string | null>(null)
  const [documents, setDocuments] = useState<DocumentFile>({
    grn: null,
    approve: null,
    scale: null,
  })
  const [activeDocType, setActiveDocType] = useState<DocumentType>("grn")
  const [validationError, setValidationError] = useState<string | null>(null)
  const grnFileInputRef = useRef<HTMLInputElement>(null)
  const approveFileInputRef = useRef<HTMLInputElement>(null)
  const scaleFileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    const fileCount = Object.values(documents).filter(Boolean).length
    if (fileCount < 3) {
      setValidationError(`Please upload all 3 required documents. Currently uploaded: ${fileCount}/3`)
    } else {
      setValidationError(null)
    }

    if (record) {
      setNewStatus(record.status || "")
      setWaste(parseFloat(record.waste_deduction))
    }
  }, [documents, record])

  if (!record) return null

  // Define status options based on record type
  const statusOptions = status

  const validateGRNNo = () => {
    // Clear previous error
    setGRNError(null)

    if (user?.role === "super_admin") {//supervisor
      if (grnNo === undefined || grnNo === null) {
        setGRNError("GRN No. is required for this status")
        return false
      }
  
      if (grnNo !== undefined && grnNo !== null) {
        if (grnNo < 0) {
          setGRNError("GRN No. cannot be negative")
          return false
        }
  
        if (grnNo === 0) {
          setGRNError("GRN No. must be greater than zero")
          return false
        }
      }
    }
    return true
  }

  const validateWaste = () => {
    // Clear previous error
    setGRNError(null)

    if (user?.role === "purchaser" || user?.role === "inspector") {//supervisor
      if (waste === undefined || waste === null) {
        setWasteError("Waste deduction is required for this status")
        return false
      }
  
      if (waste !== undefined && waste !== null) {
        if (waste < 0) {
          setWasteError("Waste deduction cannot be negative")
          return false
        }
  
        if (waste === 0) {
          setWasteError("GRN No. must be greater than zero")
          return false
        }
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!_token) return
    
    // Handle the user is supervisor
    const isSupervisor = user?.role === "supervisor" || user?.role === "super_admin"
    const formData = new FormData()
    if (isSupervisor) {
      const allFilesUploaded = Object.values(documents).every(Boolean)
      const isGRNValid = validateGRNNo()

      if (newStatus && allFilesUploaded && isGRNValid) {
        const files = [documents.grn!.file, documents.approve!.file, documents.scale!.file]

        formData.append("record_no", record.record_no)
        formData.append("grn_no", String(grnNo));
        formData.append("grn_img", files[0]);
        formData.append("approve_img", files[1]);
        formData.append("scale_img", files[2]);

        try {
          const res = await APIFactory.purchase.approvePurchase(_token, formData)
          if (res.data) {
            onStatusChange("Purchase Approved", `Purchase record ${record.record_no} is approved successfully.`)
            onClose()
          } else {
            throw new ApiError(res.error || `Failed to approve record ${record.record_no}`, res.status ?? 400)
          }
        } catch (error) {
          if (error instanceof ApiError) {
            toastUtils.error(`FAILED TO APPROVE (${error.status})`, error.message || "Failed to approve record")
          } else {
            toastUtils.error("Unexpected Error", error instanceof Error ? error.message : "Something went wrong")
          }
        } finally {
          setIsSubmitting(false)
        }
      } else if (!allFilesUploaded) {
        setValidationError(`Please upload all 3 required documents.`)
      }
    } else {// When the user isn't supervisor
      if (newStatus) {
        formData.append("record_no", record.record_no)
        formData.append("target_status", newStatus)

        try {
          const res = await APIFactory.purchase.changePurchaseStatus(_token, formData)
          if (res.data) {
            onStatusChange("Record Status Changed", `Purchase record ${record.record_no} status is changed successfully.`)
            onClose()
          } else {
            throw new ApiError(res.error || `Failed to change ${record.record_no} record status`, res.status ?? 400)
          }
        } catch (error) {
          if (error instanceof ApiError) {
            toastUtils.error(`FAILED TO CHANGE (${error.status})`, error.message || "Failed to change record status")
          } else {
            toastUtils.error("Unexpected Error", error instanceof Error ? error.message : "Something went wrong")
          }
        } finally {
          setIsSubmitting(false)
        }
      }
    }
  }

  const handleWasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!_token) return
    
    const formData = new FormData()
    formData.append("record_no", record.record_no)
    formData.append("waste", String(waste))

    const currentWasteDeduction = record.waste_deduction

    if (parseFloat(currentWasteDeduction) === 0.0) {
      // Add waste request
      try {
        const res = await APIFactory.purchase.addWasteDeduction(_token, formData)
        if (res.data) {
          onStatusChange("Waste Deduction", `Waste deduction is added successfully for ${record.record_no}.`)
          onClose()
        } else {
          throw new ApiError(res.error || `Failed to add waste deduction for ${record.record_no}`, res.status ?? 400)
        }
      } catch (error) {
        if (error instanceof ApiError) {
          toastUtils.error(`FAILED TO ADD WASTE (${error.status})`, error.message || "Failed to add waste deduction")
        } else {
          toastUtils.error("Unexpected Error", error instanceof Error ? error.message : "Something went wrong")
        }
      } finally {
        setWaste(undefined)
        setIsAddWaste(false)
        setIsSubmitting(false)
      }
    } else {
      // Edit waste request
      if (parseFloat(record.waste_deduction) == waste) {
        onStatusChange("Waste Deduction", `Waste deduction is updated successfully for ${record.record_no}.`)
        onClose()
        return
      }
      
      try {
        const res = await APIFactory.purchase.editWasteDeduction(_token, formData)
        if (res.data) {
          onStatusChange("Waste Deduction", `Waste deduction is added successfully for ${record.record_no}.`)
          onClose()
        } else {
          throw new ApiError(res.error || `Failed to add waste deduction for ${record.record_no}`, res.status ?? 400)
        }
      } catch (error) {
        if (error instanceof ApiError) {
          toastUtils.error(`FAILED TO ADD WASTE (${error.status})`, error.message || "Failed to add waste deduction")
        } else {
          toastUtils.error("Unexpected Error", error instanceof Error ? error.message : "Something went wrong")
        }
      } finally {
        setWaste(undefined)
        setIsAddWaste(false)
        setIsSubmitting(false)
      }
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: DocumentType) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      let preview = ""
      let type = "file"

      if (file.type.startsWith("image/")) {
        preview = URL.createObjectURL(file)
        type = "image"
      } else if (file.type === "application/pdf") {
        type = "pdf"
      } else if (file.type.includes("spreadsheet") || file.type.includes("excel")) {
        type = "spreadsheet"
      } else if (file.type.includes("word")) {
        type = "document"
      }

      setDocuments((prev) => ({
        ...prev,
        [docType]: { file, preview, type },
      }))

      setActiveDocType(docType)
    }

    // Reset the input value
    if (e.target) {
      e.target.value = ""
    }
  }

  const removeFile = (docType: DocumentType) => {
    setDocuments((prev) => {
      const newDocs = { ...prev }
      if (newDocs[docType]?.preview) {
        URL.revokeObjectURL(newDocs[docType]!.preview)
      }
      newDocs[docType] = null
      return newDocs
    })

    // Set active doc type to the first available document or the first type
    const remainingTypes = Object.entries(documents)
      .filter(([_, doc]) => doc !== null && _ !== docType)
      .map(([type]) => type as DocumentType)

    setActiveDocType(remainingTypes[0] || "grn")
  }

  const handleClose = () => {
    // Clean up object URLs
    Object.values(documents).forEach((doc) => {
      if (doc?.preview) {
        URL.revokeObjectURL(doc.preview)
      }
    })

    setDocuments({ grn: null, approve: null, scale: null })
    setNewStatus("")
    setGRNNo(undefined)
    setActiveDocType("grn")
    setValidationError(null)
    onClose()
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-6 w-6 text-blue-500" />
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />
      case "spreadsheet":
        return <FileText className="h-6 w-6 text-green-500" />
      case "document":
        return <FileText className="h-6 w-6 text-blue-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  const hasFiles = Object.values(documents).some(Boolean)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn("sm:max-w-[425px] transition-all duration-300", hasFiles && "sm:max-w-[750px]")}>
        <DialogHeader>
          <DialogTitle>Change Status</DialogTitle>
          <DialogDescription>
            Update the status for Purchase Record
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6">
          <div className={cn("flex-1 space-y-4", hasFiles ? "md:w-1/2" : "w-full")}>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">Current Status</p>
              <Badge className={getStatusColor(record.status)}>{capitalizeFirst(record.status)}</Badge>
            </div>
            {!isAddWaste && (
            <RoleBasedContent requiredRole={["super_admin", "purchaser", "inspector", "purchase_head", "supervisor", "finance", "manager"]}>
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none">New Status</p>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </RoleBasedContent>
            )}
            
            <RoleBasedContent requiredRole={["super_admin", "supervisor"]}>
              <div className="space-y-2">
                <Label htmlFor="grnNo">GRN No.</Label>
                <Input
                  id="grnNo"
                  type="number"
                  placeholder="Enter GRN number"
                  value={grnNo === undefined ? "" : grnNo}
                  onChange={(e) => {
                    setGRNNo(e.target.value ? Number(e.target.value) : undefined)
                    // Clear error when user starts typing
                    if (grnError) setGRNError(null)
                  }}
                  onBlur={() => validateGRNNo()}
                  className={cn("no-spinner", grnError && "border-red-500")}
                />
                {grnError && <p className="text-sm text-red-500">{grnError}</p>}
                {newStatus && ["Approved", "Paid"].includes(newStatus) && !grnError && (
                  <p className="text-xs text-muted-foreground">Amount is required for {newStatus} status</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Supporting Documents (Required: 3)</Label>
                  <Badge
                    variant={Object.values(documents).filter(Boolean).length === 3 ? "default" : "destructive"}
                    className="ml-2"
                  >
                    {Object.values(documents).filter(Boolean).length}/3
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {/* GRN Image Upload */}
                  <div className="flex items-center gap-2">
                    <Input
                      id="grn-upload"
                      type="file"
                      ref={grnFileInputRef}
                      onChange={(e) => handleFileChange(e, "grn")}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <Button
                      type="button"
                      variant={documents.grn ? "outline" : "secondary"}
                      onClick={() => grnFileInputRef.current?.click()}
                      className="w-full flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        GRN Image
                      </div>
                      {documents.grn && (
                        <Badge variant="outline" className="ml-2">
                          Uploaded
                        </Badge>
                      )}
                    </Button>
                  </div>

                  {/* Approve Image Upload */}
                  <div className="flex items-center gap-2">
                    <Input
                      id="approve-upload"
                      type="file"
                      ref={approveFileInputRef}
                      onChange={(e) => handleFileChange(e, "approve")}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <Button
                      type="button"
                      variant={documents.approve ? "outline" : "secondary"}
                      onClick={() => approveFileInputRef.current?.click()}
                      className="w-full flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Approve Image
                      </div>
                      {documents.approve && (
                        <Badge variant="outline" className="ml-2">
                          Uploaded
                        </Badge>
                      )}
                    </Button>
                  </div>

                  {/* Scale Image Upload */}
                  <div className="flex items-center gap-2">
                    <Input
                      id="scale-upload"
                      type="file"
                      ref={scaleFileInputRef}
                      onChange={(e) => handleFileChange(e, "scale")}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <Button
                      type="button"
                      variant={documents.scale ? "outline" : "secondary"}
                      onClick={() => scaleFileInputRef.current?.click()}
                      className="w-full flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Scale Image
                      </div>
                      {documents.scale && (
                        <Badge variant="outline" className="ml-2">
                          Uploaded
                        </Badge>
                      )}
                    </Button>
                  </div>
                </div>

                {validationError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{validationError}</AlertDescription>
                  </Alert>
                )}

                {/* Mobile file list (visible on small screens) */}
                <div className="md:hidden mt-4 space-y-2">
                  <p className="text-sm font-medium leading-none">Uploaded Files</p>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(documents).map(
                      ([docType, file]) =>
                        file && (
                          <div key={docType} className="relative flex items-center p-2 border rounded-md group">
                            {file.type === "image" ? (
                              <div className="h-12 w-12 rounded overflow-hidden mr-2">
                                <img
                                  src={file.preview || "/placeholder.svg"}
                                  alt={file.file.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-12 flex items-center justify-center mr-2">
                                {getFileIcon(file.type)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {docType === "grn"
                                  ? "GRN Image"
                                  : docType === "approve"
                                    ? "Approve Image"
                                    : "Scale Image"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{file.file.name}</p>
                              <p className="text-xs text-muted-foreground">{(file.file.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeFile(docType as DocumentType)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              </div>
            </RoleBasedContent>
          </div>

          {hasFiles && (
            <div className="hidden md:block md:w-1/2 border-l pl-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium leading-none">Uploaded Files</p>
                <div className="flex items-center gap-2">
                  {Object.entries(documents).map(
                    ([docType, doc]) =>
                      doc && (
                        <button
                          key={docType}
                          onClick={() => setActiveDocType(docType as DocumentType)}
                          className={cn(
                            "px-2 py-1 text-xs rounded transition-all",
                            activeDocType === docType
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {docType === "grn" ? "GRN" : docType === "approve" ? "Approve" : "Scale"}
                        </button>
                      ),
                  )}
                </div>
              </div>

              {/* Slider container */}
              <div className="relative">
                {/* File preview */}
                <div className="relative rounded-md overflow-hidden border min-h-[250px] flex items-center justify-center bg-muted/20">
                  {documents[activeDocType] && (
                    <>
                      {documents[activeDocType]!.type === "image" ? (
                        <img
                          src={documents[activeDocType]!.preview || "/placeholder.svg"}
                          alt={documents[activeDocType]!.file.name}
                          className="w-full object-contain max-h-[250px]"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          <div className="h-16 w-16 mb-2">{getFileIcon(documents[activeDocType]!.type)}</div>
                          <p className="text-sm font-medium">{documents[activeDocType]!.file.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {(documents[activeDocType]!.file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      )}

                      {/* Navigation buttons */}
                      {Object.values(documents).filter(Boolean).length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                            onClick={() => {
                              const docTypes = Object.entries(documents)
                                .filter(([_, doc]) => doc !== null)
                                .map(([type]) => type as DocumentType)

                              const currentIndex = docTypes.indexOf(activeDocType)
                              const prevIndex = currentIndex === 0 ? docTypes.length - 1 : currentIndex - 1
                              setActiveDocType(docTypes[prevIndex])
                            }}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                            onClick={() => {
                              const docTypes = Object.entries(documents)
                                .filter(([_, doc]) => doc !== null)
                                .map(([type]) => type as DocumentType)

                              const currentIndex = docTypes.indexOf(activeDocType)
                              const nextIndex = (currentIndex + 1) % docTypes.length
                              setActiveDocType(docTypes[nextIndex])
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {/* Remove button */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removeFile(activeDocType)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>

                {/* File list below slider */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {/* GRN Image */}
                  <button
                    className={cn(
                      "relative border rounded-md overflow-hidden h-16 flex items-center justify-center",
                      documents.grn && activeDocType === "grn" && "ring-2 ring-primary",
                    )}
                    onClick={() => documents.grn && setActiveDocType("grn")}
                  >
                    {documents.grn ? (
                      documents.grn.type === "image" ? (
                        <img
                          src={documents.grn.preview || "/placeholder.svg"}
                          alt={documents.grn.file.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full">
                          {getFileIcon(documents.grn.type)}
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full w-full text-muted-foreground/50">
                        <Upload className="h-4 w-4 mb-1" />
                        <span className="text-xs">GRN</span>
                      </div>
                    )}
                  </button>

                  {/* Approve Image */}
                  <button
                    className={cn(
                      "relative border rounded-md overflow-hidden h-16 flex items-center justify-center",
                      documents.approve && activeDocType === "approve" && "ring-2 ring-primary",
                    )}
                    onClick={() => documents.approve && setActiveDocType("approve")}
                  >
                    {documents.approve ? (
                      documents.approve.type === "image" ? (
                        <img
                          src={documents.approve.preview || "/placeholder.svg"}
                          alt={documents.approve.file.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full">
                          {getFileIcon(documents.approve.type)}
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full w-full text-muted-foreground/50">
                        <Upload className="h-4 w-4 mb-1" />
                        <span className="text-xs">Approve</span>
                      </div>
                    )}
                  </button>

                  {/* Scale Image */}
                  <button
                    className={cn(
                      "relative border rounded-md overflow-hidden h-16 flex items-center justify-center",
                      documents.scale && activeDocType === "scale" && "ring-2 ring-primary",
                    )}
                    onClick={() => documents.scale && setActiveDocType("scale")}
                  >
                    {documents.scale ? (
                      documents.scale.type === "image" ? (
                        <img
                          src={documents.scale.preview || "/placeholder.svg"}
                          alt={documents.scale.file.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full">
                          {getFileIcon(documents.scale.type)}
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full w-full text-muted-foreground/50">
                        <Upload className="h-4 w-4 mb-1" />
                        <span className="text-xs">Scale</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/*Toggle section to add waste deduction*/}
        <RoleBasedContent requiredRole={["super_admin", "purchaser", "inspector"]}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Add Waste Deduction</h3>
                <div className="flex items-center space-x-2">
                  <Switch id="add-waste" checked={isAddWaste} onCheckedChange={setIsAddWaste}/>
                  <Label htmlFor="edit-ranges">Add Waste</Label>
                </div>
              </div>

              {isAddWaste && (
                <>
                  <div key={1} className="flex items-center gap-2">
                    <div className="grid gap-2 flex-1">
                      <div className="space-y-2">
                        <Label htmlFor="grnNo">Waste Deduction (kg)</Label>
                        <Input
                          id="waste"
                          type="number"
                          placeholder="Enter waste deduction weight"
                          value={waste === undefined ? "" : waste}
                          onChange={(e) => {
                            setWaste(e.target.value ? Number(e.target.value) : undefined)
                            // Clear error when user starts typing
                            if (wasteError) setWasteError(null)
                          }}
                          onBlur={() => validateWaste()}
                          className={cn("no-spinner", wasteError && "border-red-500")}
                        />
                        {wasteError && <p className="text-sm text-red-500">{wasteError}</p>}
                        {!wasteError && (
                          <p className="text-xs text-muted-foreground">Waste deduction weight is required.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </RoleBasedContent>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {!isAddWaste && (
            <>
              <RoleBasedContent requiredRole={["super_admin", "supervisor"]}>
                <Button onClick={handleSubmit} disabled={!newStatus || Object.values(documents).filter(Boolean).length !== 3}>
                  Save Changes
                </Button>
              </RoleBasedContent>
              <RoleBasedContent requiredRole={["purchaser", "inspector", "purchase_head", "finance", "manager"]}>
                <Button onClick={handleSubmit} disabled={!newStatus}>
                  Save Changes
                </Button>
              </RoleBasedContent>
            </>
          )}
          {isAddWaste && (
            <RoleBasedContent requiredRole={["purchaser", "inspector"]}>
              <Button onClick={handleWasteSubmit} disabled={!waste}>
                Add Waste
              </Button>
            </RoleBasedContent>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
