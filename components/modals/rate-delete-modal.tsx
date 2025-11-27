"use client"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { MaterialType } from "@/lib/types/material-types"
import { toastUtils } from "@/lib/toast-utils"
import APIFactory  from "@/lib/api-factory"
import { ApiError } from "@/utils/errors"
import { capitalizeFirst } from "@/utils/stringFormatter"

interface RateDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  rate: any
  onConfirm: () => void
  materialTypes: MaterialType[]
  _token: string
  reloadData: () => Promise<void>
}

export function RateDeleteModal({ isOpen, onClose, rate, onConfirm, materialTypes, _token, reloadData }: RateDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)


  const materialType = rate.materialType || rate.material_type
  const formData = new FormData()
  formData.append("_id", rate._id)

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!_token || !rate._id) return
    setIsDeleting(true)

    try {
      const res = await APIFactory.purchase.deleteRate(_token, formData)
      if (res.data) {
        toastUtils.success("Rate Deleted", `Rate for ${materialType} deleted successfully.`)
        // onConfirm() => This will reload the page (the window)
        await reloadData()
        onClose()
      } else {
        throw new ApiError(res.error || "Failed to delete rate", res.status ?? 400)
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        toastUtils.error(`FAILED TO DELETE (${error.status})`, error.message || "Failed to delete rate")
      } else {
        toastUtils.error("Unexpected Error", error instanceof Error ? error.message : "Something went wrong")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Rate</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this rate? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDelete}>
          <div className="py-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-medium">Material Type:</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {capitalizeFirst(rate.material_type)}
              </Badge>
            </div>

            {rate.material_type === "scrap" ? (
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Heavy</p>
                  <p className="font-medium">Br.{rate.heavy_rate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Medium</p>
                  <p className="font-medium">Br.{rate.medium_rate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Light</p>
                  <p className="font-medium">Br.{rate.light_rate}</p>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Rate</p>
                <p className="font-medium">Br.{rate.fixed_rate}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
