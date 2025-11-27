"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ImageIcon, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { capitalizeFirst } from "@/utils/stringFormatter"
import { formatDate } from "@/utils/dateFormatter"
import { BASE_URL } from "@/lib/api-factory"
import { getStatusColor } from "@/utils/statusColor"
import { formatPrice } from "@/utils/priceFormatter";
import { toastUtils } from "@/lib/toast-utils"
import APIFactory  from "@/lib/api-factory"
import { ApiError } from "@/utils/errors"

interface PayCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  record: any
  onStatusChange: (status: string, message: string) => void
  _token: string
}

type ImageType = "grn" | "approve" | "scale"

export function PayCustomerModal({ isOpen, onClose, record, onStatusChange, _token }: PayCustomerModalProps) {
  const [currentImageType, setCurrentImageType] = useState<ImageType>("grn")
  const [imagesLoaded, setImagesLoaded] = useState<Record<ImageType, boolean>>({
    grn: false,
    approve: false,
    scale: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Reset image type when record changes
  useEffect(() => {
    if (record) {
      setCurrentImageType("grn")
      setImagesLoaded({
        grn: false,
        approve: false,
        scale: false,
      })
    }
  }, [record])

  if (!record) return null

  // Check if record has approved status to show images
  const hasApprovedStatus = ["approved"].includes(record.status?.toLowerCase());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!_token) return
    
    const formData = new FormData()
    formData.append("tin", record.customer)
    formData.append("record_no", record.record_no)
    try {
      const res = await APIFactory.purchase.payCustomer(_token, formData)
      if (res.data) {
        onStatusChange("Customer Paid", `Purchase record ${record.record_no} is paid successfully.`)
        onClose()
      } else {
        throw new ApiError(res.error || `Failed to pay customer ${record.record_no}`, res.status ?? 400)
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toastUtils.error(`FAILED TO PAY (${error.status})`, error.message || "Failed to pay customer")
      } else {
        toastUtils.error("Unexpected Error", error instanceof Error ? error.message : "Something went wrong")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Construct image URLs (these would be replaced with actual URLs from your API)
  const getImageUrl = (type: ImageType) => {
    switch (type) {
      case "grn":
        return `${BASE_URL}/media/grn-img/${record.grn_img}`
      case "approve":
        return `${BASE_URL}/media/approve-img/${record.approve_img}`
      case "scale":
        return `${BASE_URL}/media/scale-img/${record.scale_img}`
      default:
        return
    }
  }

  const handleImageError = (type: ImageType) => {
    setImagesLoaded((prev) => ({
      ...prev,
      [type]: false,
    }))
  }

  const handleImageLoad = (type: ImageType) => {
    setImagesLoaded((prev) => ({
      ...prev,
      [type]: true,
    }))
  }

  const nextImage = () => {
    const types: ImageType[] = ["grn", "approve", "scale"]
    const currentIndex = types.indexOf(currentImageType)
    const nextIndex = (currentIndex + 1) % types.length
    setCurrentImageType(types[nextIndex])
  }

  const prevImage = () => {
    const types: ImageType[] = ["grn", "approve", "scale"]
    const currentIndex = types.indexOf(currentImageType)
    const prevIndex = currentIndex === 0 ? types.length - 1 : currentIndex - 1
    setCurrentImageType(types[prevIndex])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[625px]", hasApprovedStatus && "sm:max-w-[1000px]")}>
        <DialogHeader>
          <DialogTitle>Pay Customer</DialogTitle>
          <DialogDescription>Pay customer for purchase record <i>{record.record_no}</i></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6">
          <div className={cn("flex-1", hasApprovedStatus ? "md:w-1/2" : "w-full")}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Record No.</p>
                  <p className="text-sm text-muted-foreground">{record.record_no}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Weight Date</p>
                  <p className="text-sm text-muted-foreground">{formatDate(record.first_date)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">First Weight(Kg)</p>
                  <p className="text-sm text-muted-foreground">{record.first_weight || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Second Weight(Kg)</p>
                  <p className="text-sm text-muted-foreground">{record.second_weight || "N/A"}</p>
                </div>
                {record.customer && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Customer Information</p>
                    <div className="text-sm p-2 bg-muted rounded-md">
                      <p className="font-medium">
                        Customer Name: {record.customer_fname} {record.customer_lname}
                      </p>
                      <p className="font-medium">Customer TIN: {record.customer}</p>
                      <p className="text-muted-foreground">Business name: {record.customer_business_name}</p>
                    </div>
                  </div>
                )}
                {record.plate_no && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Driver Information</p>
                    <div className="text-sm p-2 bg-muted rounded-md">
                      <p className="font-medium">Plate No: {record.plate_no}</p>
                      <p className="text-muted-foreground">Driver name: {record.driver_name}</p>
                    </div>
                  </div>
                )}
                {record.net_weight && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Net Weight(kg)</p>
                    <div className="text-sm p-2 bg-muted rounded-md">
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
                  </div>
                )}
                {(record.heavy_rate || record.medium_rate || record.light_rate || record.fixed_rate) && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Rate(Br)</p>
                    <div className="text-sm p-2 bg-muted rounded-md">
                      {record.heavy_rate && (
                        <span className="inline-block bg-muted-foreground/10 text-muted-foreground text-xs mb-1 mr-1 px-2 py-1 rounded-full">
                          H: {record.heavy_rate}
                        </span>
                      )}
                      {record.medium_rate && (
                        <span className="inline-block bg-muted-foreground/10 text-muted-foreground text-xs mb-1 mr-1 px-2 py-1 rounded-full">
                          M: {record.medium_rate}
                        </span>
                      )}
                      {record.light_rate && (
                        <span className="inline-block bg-muted-foreground/10 text-muted-foreground text-xs mb-1 mr-1 px-2 py-1 rounded-full">
                          L: {record.light_rate}
                        </span>
                      )}
                      {record.fixed_rate && (
                        <span className="inline-block bg-muted-foreground/10 text-muted-foreground text-xs mb-1 mr-1 px-2 py-1 rounded-full">
                          F: {record.fixed_rate}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {record.waste_deduction !== undefined && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Waste Deduction(Kg)</p>
                    <Badge
                      variant="secondary"
                      className="border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80"
                    >
                      {record.waste_deduction}
                    </Badge>
                  </div>
                )}
                {record.amount !== undefined && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">Net Price(Br)</p>
                          <p className="text-sm text-muted-foreground">
                            {typeof record.amount === "number" ? `Br.${record.amount.toFixed(2)}` : `Br.${record.amount}`}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Actual Price: Br.{formatPrice(record.net_price)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Status</p>
                  <Badge className={getStatusColor(record.status)}>{capitalizeFirst(record.status)}</Badge>
                </div>
                {record.updated_by && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Updated By</p>
                    <p className="text-sm text-muted-foreground">{record.updated_by}</p>
                  </div>
                )}
              </div>
              <Alert variant="success" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>This action will pay the customer <strong><i>Br.{formatPrice(record.net_price)}</i></strong>, for the purchase record.</AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Image preview section - only shown for approved records */}
          {hasApprovedStatus && (
            <div className="hidden md:block md:w-1/2 border-l pl-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium leading-none">Supporting Documents</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentImageType("grn")}
                    className={cn(
                      "px-2 py-1 text-xs rounded transition-all",
                      currentImageType === "grn"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    GRN
                  </button>
                  <button
                    onClick={() => setCurrentImageType("approve")}
                    className={cn(
                      "px-2 py-1 text-xs rounded transition-all",
                      currentImageType === "approve"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setCurrentImageType("scale")}
                    className={cn(
                      "px-2 py-1 text-xs rounded transition-all",
                      currentImageType === "scale"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    Scale
                  </button>
                </div>
              </div>

              {/* Image preview container */}
              <div className="relative">
                <div className="relative rounded-md overflow-hidden border min-h-[250px] flex items-center justify-center bg-muted/20">
                  {/* Image with fallback */}
                  <img
                    src={getImageUrl(currentImageType) || "/placeholder.svg"}
                    alt={`${currentImageType} document`}
                    className="w-full object-contain max-h-[250px]"
                    onError={() => handleImageError(currentImageType)}
                    onLoad={() => handleImageLoad(currentImageType)}
                    style={{ display: imagesLoaded[currentImageType] ? "block" : "none" }}
                  />

                  {/* Placeholder when image fails to load */}
                  {!imagesLoaded[currentImageType] && (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground/40 mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">
                        {currentImageType === "grn"
                          ? "GRN Image"
                          : currentImageType === "approve"
                            ? "Approve Image"
                            : "Scale Image"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Image not available</p>
                    </div>
                  )}

                  {/* Navigation buttons */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Thumbnail navigation */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {/* GRN Thumbnail */}
                  <button
                    className={cn(
                      "relative border rounded-md overflow-hidden h-16 flex items-center justify-center",
                      currentImageType === "grn" && "ring-2 ring-primary",
                    )}
                    onClick={() => setCurrentImageType("grn")}
                  >
                    <img
                      src={getImageUrl("grn") || "/placeholder.svg"}
                      alt="GRN document"
                      className="h-full w-full object-cover"
                      onError={() => handleImageError("grn")}
                      onLoad={() => handleImageLoad("grn")}
                      style={{ display: imagesLoaded.grn ? "block" : "none" }}
                    />
                    {!imagesLoaded.grn && (
                      <div className="flex flex-col items-center justify-center h-full w-full text-muted-foreground/50">
                        <ImageIcon className="h-4 w-4 mb-1" />
                        <span className="text-xs">GRN</span>
                      </div>
                    )}
                  </button>

                  {/* Approve Thumbnail */}
                  <button
                    className={cn(
                      "relative border rounded-md overflow-hidden h-16 flex items-center justify-center",
                      currentImageType === "approve" && "ring-2 ring-primary",
                    )}
                    onClick={() => setCurrentImageType("approve")}
                  >
                    <img
                      src={getImageUrl("approve") || "/placeholder.svg"}
                      alt="Approve document"
                      className="h-full w-full object-cover"
                      onError={() => handleImageError("approve")}
                      onLoad={() => handleImageLoad("approve")}
                      style={{ display: imagesLoaded.approve ? "block" : "none" }}
                    />
                    {!imagesLoaded.approve && (
                      <div className="flex flex-col items-center justify-center h-full w-full text-muted-foreground/50">
                        <ImageIcon className="h-4 w-4 mb-1" />
                        <span className="text-xs">Approve</span>
                      </div>
                    )}
                  </button>

                  {/* Scale Thumbnail */}
                  <button
                    className={cn(
                      "relative border rounded-md overflow-hidden h-16 flex items-center justify-center",
                      currentImageType === "scale" && "ring-2 ring-primary",
                    )}
                    onClick={() => setCurrentImageType("scale")}
                  >
                    <img
                      src={getImageUrl("scale") || "/placeholder.svg"}
                      alt="Scale document"
                      className="h-full w-full object-cover"
                      onError={() => handleImageError("scale")}
                      onLoad={() => handleImageLoad("scale")}
                      style={{ display: imagesLoaded.scale ? "block" : "none" }}
                    />
                    {!imagesLoaded.scale && (
                      <div className="flex flex-col items-center justify-center h-full w-full text-muted-foreground/50">
                        <ImageIcon className="h-4 w-4 mb-1" />
                        <span className="text-xs">Scale</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Pay Customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
