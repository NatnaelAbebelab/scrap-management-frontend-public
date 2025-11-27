"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface AgencyDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  agency: any
  onDelete: () => void
}

export default function AgencyDeleteModal({ isOpen, onClose, agency, onDelete }: AgencyDeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Agency
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this agency? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">ID</h3>
                <p>{agency.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p>{`${agency.firstName} ${agency.lastName}`}</p>
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-medium text-muted-foreground">Business Name</h3>
              <p>{agency.businessName}</p>
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-medium text-muted-foreground">TIN</h3>
              <p>{agency.tin}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
