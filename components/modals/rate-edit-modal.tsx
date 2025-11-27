"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MaterialType } from "@/lib/types/material-types"
import { toastUtils } from "@/lib/toast-utils"
import APIFactory  from "@/lib/api-factory"
import { ApiError } from "@/utils/errors"


interface RateEditModalProps {
  isOpen: boolean
  onClose: () => void
  rate: any
  onSubmit: (data: any) => void
  materialTypes: MaterialType[]
  _token: string
  reloadData: () => Promise<void>
}

export function RateEditModal({ isOpen, onClose, rate, onSubmit, materialTypes, _token, reloadData }: RateEditModalProps) {
  const [materialType, setMaterialType] = useState("")
  const [singleRate, setSingleRate] = useState(rate.rate?.toString() || "")
  const [heavyRate, setHeavyRate] = useState(rate.heavyRate?.toString() || "")
  const [mediumRate, setMediumRate] = useState(rate.mediumRate?.toString() || "")
  const [lightRate, setLightRate] = useState(rate.lightRate?.toString() || "")
  const [isSubmitting, setIsSubmitting] = useState(false)


  useEffect(() => {
    if (rate) {
      setMaterialType(rate.material_type || "")
      setSingleRate(rate.fixed_rate?.toString() || "")
      setHeavyRate(rate.heavy_rate?.toString() || "")
      setMediumRate(rate.medium_rate?.toString() || "")
      setLightRate(rate.light_rate?.toString() || "")
    }
  }, [rate])

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()

    if (!_token || !rate?._id) return

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("material_type", materialType.toLowerCase().trim())

    if (materialType.toLowerCase() === "scrap") {
      formData.append("heavy_rate", heavyRate.trim())
      formData.append("medium_rate", mediumRate.trim())
      formData.append("light_rate", lightRate.trim())
      formData.append("fixed_rate", "")
    } else {
      formData.append("fixed_rate", singleRate.trim())
      formData.append("heavy_rate", "")
      formData.append("medium_rate", "")
      formData.append("light_rate", "")
    }

    try {
      const res = await APIFactory.purchase.updateRate(_token, formData)
      if (res.data) {
        toastUtils.success("Rate Updated", `Rate for ${materialType} updated successfully.`)
        await reloadData()
        onClose()
      } else {
        throw new ApiError(res.error || "Failed to update rate", res.status ?? 400)
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toastUtils.error(`FAILED TO UPDATE (${error.status})`, error.message || "Failed to update rate")
      } else {
        toastUtils.error("Unexpected Error", error instanceof Error ? error.message : "Something went wrong")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Rate</DialogTitle>
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
                    <Label htmlFor="heavyRate">Heavy Rate (Br)</Label>
                    <Input
                      id="heavyRate"
                      type="number"
                      value={heavyRate}
                      onChange={(e) => setHeavyRate(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mediumRate">Medium Rate (Br)</Label>
                    <Input
                      id="mediumRate"
                      type="number"
                      value={mediumRate}
                      onChange={(e) => setMediumRate(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lightRate">Light Rate (Br)</Label>
                    <Input
                      id="lightRate"
                      type="number"
                      value={lightRate}
                      onChange={(e) => setLightRate(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="rate">Rate (Br)</Label>
                <Input
                  id="rate"
                  type="number"
                  value={singleRate}
                  onChange={(e) => setSingleRate(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
