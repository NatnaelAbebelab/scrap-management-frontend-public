"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MaterialType } from "@/lib/types/material-types"
import { toastUtils } from "@/lib/toast-utils"
import APIFactory  from "@/lib/api-factory"
import { ApiError } from "@/utils/errors"

interface RateModalProps {
  materialTypes: MaterialType[]
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  _token: string
  reloadData: () => Promise<void>
}

export function RateModal({ isOpen, onClose, onSubmit, materialTypes, _token, reloadData }: RateModalProps) {
  const [materialType, setMaterialType] = useState("")
  const [rate, setRate] = useState("")
  const [heavyRate, setHeavyRate] = useState("")
  const [mediumRate, setMediumRate] = useState("")
  const [lightRate, setLightRate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!_token) return

    setIsSubmitting(true)
  
    // Build FormData
    const formData = new FormData()
    formData.append("material_type", materialType.toLowerCase().trim())

    if (materialType.toLowerCase() === "scrap") {
      formData.append("heavy_rate", heavyRate.trim())
      formData.append("medium_rate", mediumRate.trim())
      formData.append("light_rate", lightRate.trim())
      formData.append("fixed_rate", "")
    } else {
      formData.append("fixed_rate", rate.trim())
      formData.append("heavy_rate", "")
      formData.append("medium_rate", "")
      formData.append("light_rate", "")
    }
  
    try {
      const res = await APIFactory.purchase.addRate(_token, formData)
      if (res.data) {
        // Prepare rate object for local state update
        const newRate = {
          id: Date.now(),
          materialType,
          heavyRate: materialType.toLowerCase() === "scrap" ? heavyRate : null,
          mediumRate: materialType.toLowerCase() === "scrap" ? mediumRate : null,
          lightRate: materialType.toLowerCase() === "scrap" ? lightRate : null,
          fixedRate: materialType.toLowerCase() === "scrap" ? null : rate,
          date: new Date(),
        }
        onSubmit(newRate)
        onClose()
        await reloadData()
      } else {
        throw new ApiError(res.error || "Failed to add rate", res.status ?? 400)
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toastUtils.error(`FAILED TO ADD RATE (${error.status})`, error.message || "Failed to add rate.")
      } else {
        toastUtils.error("Unexpected error", error instanceof Error ? error.message : "Something went wrong")
      }
    } finally {
      setIsSubmitting(false)
    }
  
    // Reset form fields
    setMaterialType("")
    setRate("")
    setHeavyRate("")
    setMediumRate("")
    setLightRate("")
  }
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Rate</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="materialType">Material Type</Label>
              <Select value={materialType} onValueChange={setMaterialType} required>
                <SelectTrigger id="materialType">
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

            {materialType === "scrap" ? (
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="heavyRate">Heavy Rate (Br.)</Label>
                    <Input
                      id="heavyRate"
                      type="number"
                      value={heavyRate}
                      onChange={(e) => setHeavyRate(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mediumRate">Medium Rate (Br.)</Label>
                    <Input
                      id="mediumRate"
                      type="number"
                      value={mediumRate}
                      onChange={(e) => setMediumRate(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lightRate">Light Rate (Br.)</Label>
                    <Input
                      id="lightRate"
                      type="number"
                      value={lightRate}
                      onChange={(e) => setLightRate(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : materialType ? (
              <div className="grid gap-2">
                <Label htmlFor="rate">Rate (Br.)</Label>
                <Input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.1"
                  required
                />
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!materialType}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
