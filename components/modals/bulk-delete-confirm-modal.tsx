"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BulkDeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  selectedRecords: any[]
  onRemoveRecord: (id: string) => void
  onDelete: () => void
}

export function BulkDeleteConfirmModal({
  isOpen,
  onClose,
  selectedRecords,
  onRemoveRecord,
  onDelete,
}: BulkDeleteConfirmModalProps) {
  if (!selectedRecords || selectedRecords.length === 0) return null

  // Determine if it's a purchase record or internal record based on properties
  const isPurchaseRecord = selectedRecords[0].supplier !== undefined

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirm Bulk Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedRecords.length} {isPurchaseRecord ? "Purchase" : "Transport"}{" "}
            Records?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete the selected records from the system.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">Selected Records</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedRecords.map((record) => (
                <Badge key={record.id} variant="outline" className="flex items-center gap-1">
                  #{record.id}
                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => onRemoveRecord(record.id)}>
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
