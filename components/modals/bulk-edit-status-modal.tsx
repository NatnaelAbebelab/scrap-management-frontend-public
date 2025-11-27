"use client"

import { useState } from "react"
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
import { X } from "lucide-react"
import type { Status } from "@/lib/types/status-types"
import { useAuth } from "@/lib/auth-context"
import { toastUtils } from "@/lib/toast-utils"
import APIFactory  from "@/lib/api-factory"
import { ApiError } from "@/utils/errors"

interface BulkEditStatusModalProps {
  isOpen: boolean
  onClose: () => void
  selectedRecords: any[]
  onRemoveRecord: (recordNo: string) => void
  onStatusChange: (title: string, message: string) => void
  status: Status[]
  _token: string
}

export function BulkEditStatusModal({
  isOpen,
  onClose,
  selectedRecords,
  onRemoveRecord,
  onStatusChange,
  status,
  _token
}: BulkEditStatusModalProps) {
  const [newStatus, setNewStatus] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!selectedRecords || selectedRecords.length === 0) return null

  const statusOptions = status

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStatus || selectedRecords.length === 0) return
  
    setIsSubmitting(true)
  
    const formData = new FormData()
    formData.append("target_status", newStatus.trim().toLowerCase())
    selectedRecords.forEach(record => {
      formData.append("record_nos", record.record_no)  // Make sure record.id is the correct value you expect
    })
  
    try {
      const res = await APIFactory.purchase.bulkChangePurchaseStatus(_token, formData)
      if (res.data) {
        onStatusChange("Record Status Changed", `Purchase records status is changed successfully.`)
        onClose()
      } else {
        throw new ApiError(res.error || `Failed to change records status`, res.status ?? 400)
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toastUtils.error(`FAILED TO CHANGE (${error.status})`, error.message || "Failed to change records status")
      } else {
        toastUtils.error("Unexpected Error", error instanceof Error ? error.message : "Something went wrong")
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Change Status</DialogTitle>
          <DialogDescription>
            Update the status for {selectedRecords.length} Records
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">Selected Records</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedRecords.map((record) => (
                <Badge key={record.record_no} variant="outline" className="flex items-center gap-1">
                  #{record.record_no}
                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => onRemoveRecord(record.record_no)}>
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">New Status</p>
            <Select onValueChange={setNewStatus}>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!newStatus}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
