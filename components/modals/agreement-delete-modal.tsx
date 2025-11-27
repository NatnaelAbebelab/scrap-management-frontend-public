"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

interface AgreementDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  agreement: any
}

export function AgreementDeleteModal({ isOpen, onClose, onConfirm, agreement }: AgreementDeleteModalProps) {
  if (!agreement) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Agreement</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this agreement? This action will also delete all associated ranges and
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="grid gap-2">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Agreement Name:</span>
              <span className="ml-2">{agreement.agreementName}</span>
            </div>

            <div>
              <span className="text-sm font-medium text-muted-foreground">Agency:</span>
              <span className="ml-2">{agreement.agency.businessName}</span>
            </div>

            <div>
              <span className="text-sm font-medium text-muted-foreground">Material Type:</span>
              <Badge variant="outline" className="ml-2 capitalize">
                {agreement.materialType}
              </Badge>
            </div>

            <div>
              <span className="text-sm font-medium text-muted-foreground">Ranges:</span>
              <span className="ml-2">{agreement.ranges.length} range(s) will be deleted</span>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
