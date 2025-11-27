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
import { AlertTriangle } from "lucide-react"
import { toastUtils } from "@/lib/toast-utils"
import APIFactory  from "@/lib/api-factory"
import { ApiError } from "@/utils/errors"
import { useAuth } from "@/lib/auth-context"

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  record: any
  onDelete: (record: string) => void
  _token: string
}

export function DeleteConfirmModal({ isOpen, onClose, record, onDelete, _token }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { user } = useAuth()
  if (!record) return null

  const formData = new FormData()
  formData.append("record_no", record.record_no)

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!_token) return
    setIsDeleting(true)

    // Handle the user is supervisor
    const isSupervisor = user?.role === "supervisor" || user?.role === "super_admin"

    if (isSupervisor) {
      try {
        const res = await APIFactory.purchase.declinePurchaseBySupervisor(_token, formData)
        if (res.data) {
          onDelete(record.record_no)
          onClose()
        } else {
          throw new ApiError(res.error || "Failed to decline purchase record status", res.status ?? 400)
        }
      } catch (error: any) {
        if (error instanceof ApiError) {
          toastUtils.error(`FAILED TO DECLINE (${error.status})`, error.message || "Failed to decline purchase record status")
        } else {
          toastUtils.error("Unexpected Error", error instanceof Error ? error.message : "Something went wrong")
        }
      } finally {
        setIsDeleting(false)
      }
    } else {
      try {
        const res = await APIFactory.purchase.declinePurchase(_token, formData)
        if (res.data) {
          onDelete(record.record_no)
          onClose()
        } else {
          throw new ApiError(res.error || "Failed to delete purchase record status", res.status ?? 400)
        }
      } catch (error: any) {
        if (error instanceof ApiError) {
          toastUtils.error(`FAILED TO DELETE (${error.status})`, error.message || "Failed to delete purchase record status")
        } else {
          toastUtils.error("Unexpected Error", error instanceof Error ? error.message : "Something went wrong")
        }
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete Purchase Record <strong><i>{record.record_no}</i></strong> status?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete the record from the system.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
