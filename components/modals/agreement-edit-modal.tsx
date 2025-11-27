"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Plus, Trash2, Upload, Check, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toastUtils } from "@/lib/toast-utils"

// Mock data for agencies
const agencies = [
  { tin: "123456789", businessName: "Eco Recycling Solutions" },
  { tin: "987654321", businessName: "Green Earth Recyclers" },
  { tin: "456789123", businessName: "Sustainable Materials Co." },
  { tin: "789123456", businessName: "Urban Waste Management" },
  { tin: "321654987", businessName: "City Recycling Services" },
]

const materialTypes = [
  { value: "paper", label: "Paper" },
  { value: "plastic", label: "Plastic" },
  { value: "metal", label: "Metal" },
  { value: "glass", label: "Glass" },
  { value: "organic", label: "Organic" },
  { value: "electronic", label: "Electronic" },
]

interface Range {
  min: number
  max: number
  rate: number
  id: string
}

export function AgreementEditModal({
  isOpen,
  onClose,
  agreement,
  onUpdateAgreement,
  onUpdateRanges,
}: {
  isOpen: boolean
  onClose: () => void
  agreement: any
  onUpdateAgreement: (data: any) => void
  onUpdateRanges: (data: any) => void
}) {
  const [agreementName, setAgreementName] = useState("")
  const [agencyTin, setAgencyTin] = useState("")
  const [agencyFound, setAgencyFound] = useState<boolean | null>(null)
  const [selectedAgencyDetails, setSelectedAgencyDetails] = useState<any>(null)
  const [materialType, setMaterialType] = useState("")
  const [effectiveDate, setEffectiveDate] = useState<Date | undefined>(undefined)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [currentProofFileName, setCurrentProofFileName] = useState<string | null>(null)
  const [ranges, setRanges] = useState<Range[]>([])
  const [editRanges, setEditRanges] = useState(false)

  const validateAgency = () => {
    const foundAgency = agencies.find((a) => a.tin === agencyTin)
    if (foundAgency) {
      setAgencyFound(true)
      setSelectedAgencyDetails(foundAgency)
    } else {
      setAgencyFound(false)
      setSelectedAgencyDetails(null)
    }
  }

  useEffect(() => {
    if (agreement) {
      setAgreementName(agreement.agreementName || "")
      setAgencyTin(agreement.agency?.tin || "")
      const matchedAgency = agencies.find((a) => a.tin === agreement.agency?.tin)
      setSelectedAgencyDetails(matchedAgency || null)
      setAgencyFound(!!matchedAgency)

      setMaterialType(agreement.materialType || "")
      setEffectiveDate(agreement.effectiveDate ? new Date(agreement.effectiveDate) : undefined)
      setCurrentProofFileName(agreement.proofFile || null)

      if (agreement.ranges && Array.isArray(agreement.ranges)) {
        setRanges(
          agreement.ranges.map((r: any) => ({
            ...r,
            id: r.id || Date.now().toString() + Math.random().toString(),
          })),
        )
      } else {
        setRanges([{ min: 0, max: 0, rate: 0, id: "1" }])
      }
    }
  }, [agreement, isOpen])

  const addRange = () => {
    if (ranges.length === 0) {
      setRanges([{ min: 0, max: 0, rate: 0, id: "1" }])
      return
    }

    const lastRange = ranges[ranges.length - 1]
    const newRange = {
      min: lastRange.max,
      max: lastRange.max,
      rate: 0,
      id: Date.now().toString(),
    }
    setRanges([...ranges, newRange])
  }

  const removeRange = (id: string) => {
    if (ranges.length <= 1) return
    setRanges(ranges.filter((range) => range.id !== id))
  }

  const updateRange = (id: string, field: keyof Range, value: number) => {
    const updatedRanges = ranges.map((range) => {
      if (range.id === id) {
        return { ...range, [field]: value }
      }
      return range
    })
    setRanges(updatedRanges)
  }

  const validateRanges = () => {
    if (ranges[0].min !== 0) {
      toastUtils.error(`Validation Error`, "First range minimum must be 0")
      return false
    }

    for (let i = 1; i < ranges.length; i++) {
      if (ranges[i].min !== ranges[i - 1].max) {
        toastUtils.error(`Validation Error`, `Range ${i + 1} minimum must equal Range ${i} maximum`)
        return false
      }
    }

    for (let i = 0; i < ranges.length; i++) {
      if (ranges[i].min >= ranges[i].max) {
        toastUtils.error(`Validation Error`, `Range ${i + 1} minimum must be less than maximum`)
        return false
      }
    }

    return true
  }

  const handleUpdateAgreement = () => {
    if (!agreementName || !agencyTin || !materialType || !effectiveDate || !selectedAgencyDetails) {
      toastUtils.error(`Validation Error`, "Please fill all required fields")
      return
    }

    const agreementData = {
      id: agreement.id,
      agreementName,
      agency: selectedAgencyDetails,
      materialType,
      effectiveDate,
      proofFile: proofFile ? proofFile.name : currentProofFileName,
    }

    onUpdateAgreement(agreementData)
  }

  const handleUpdateRanges = () => {
    if (!validateRanges()) return

    onUpdateRanges({
      id: agreement.id,
      ranges,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0])
      setCurrentProofFileName(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Agreement</DialogTitle>
          <DialogDescription>Update agreement information and rate ranges.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Agreement Information</h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agreement-name">Agreement Name</Label>
                <Input
                  id="agreement-name"
                  placeholder="Enter agreement name"
                  value={agreementName}
                  onChange={(e) => setAgreementName(e.target.value)}
                />
              </div>

              {/* Updated TIN input with validation */}
              <div className="space-y-2">
                <Label htmlFor="agency-tin">Agency TIN</Label>
                <div className="relative">
                  <Input
                    id="agency-tin"
                    placeholder="Enter agency TIN"
                    value={agencyTin}
                    onChange={(e) => {
                      setAgencyTin(e.target.value)
                      setAgencyFound(null)
                    }}
                    onBlur={validateAgency}
                    className="pr-10"
                  />
                  {agencyFound !== null && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {agencyFound ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {selectedAgencyDetails && (
                  <div className="text-sm p-2 bg-muted rounded-md">
                    <p className="font-medium">{selectedAgencyDetails.tin}</p>
                    <p className="text-muted-foreground">{selectedAgencyDetails.businessName}</p>
                  </div>
                )}
                {agencyFound === false && (
                  <p className="text-sm text-red-500">Agency with this TIN not found</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="material-type">Material Type</Label>
                <Select value={materialType} onValueChange={setMaterialType}>
                  <SelectTrigger id="material-type">
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="effective-date">Effective Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="effective-date"
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !effectiveDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {effectiveDate ? format(effectiveDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={effectiveDate} onSelect={setEffectiveDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proof-file">Proof Document</Label>
                <div className="flex items-center gap-2">
                  <Input id="proof-file" type="file" onChange={handleFileChange} className="hidden" />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("proof-file")?.click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {proofFile ? proofFile.name : currentProofFileName || "Upload Document"}
                  </Button>
                  {(proofFile || currentProofFileName) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setProofFile(null)
                        setCurrentProofFileName(null)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Button onClick={handleUpdateAgreement}>Update Agreement Information</Button>
          </div>

          <div className="h-px bg-gray-200 my-2" />

          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Agreement Ranges</h3>
              <div className="flex items-center space-x-2">
                <Switch id="edit-ranges" checked={editRanges} onCheckedChange={setEditRanges} />
                <Label htmlFor="edit-ranges">Edit Ranges</Label>
              </div>
            </div>

            {editRanges && (
              <>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={addRange}>
                    <Plus className="h-4 w-4 mr-1" /> Add Range
                  </Button>
                </div>

                {ranges.map((range, index) => (
                  <div key={range.id} className="flex items-center gap-2">
                    <div className="grid grid-cols-3 gap-2 flex-1">
                      <div>
                        <Label htmlFor={`min-${range.id}`} className="text-xs">Min</Label>
                        <Input
                          id={`min-${range.id}`}
                          type="number"
                          value={range.min}
                          onChange={(e) => updateRange(range.id, "min", Number(e.target.value))}
                          disabled={index === 0}
                          min={0}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`max-${range.id}`} className="text-xs">Max</Label>
                        <Input
                          id={`max-${range.id}`}
                          type="number"
                          value={range.max}
                          onChange={(e) => updateRange(range.id, "max", Number(e.target.value))}
                          min={range.min}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`rate-${range.id}`} className="text-xs">Rate</Label>
                        <Input
                          id={`rate-${range.id}`}
                          type="number"
                          value={range.rate}
                          onChange={(e) => updateRange(range.id, "rate", Number(e.target.value))}
                          min={0}
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="pt-5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRange(range.id)}
                        disabled={ranges.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button onClick={handleUpdateRanges}>Update Ranges</Button>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

