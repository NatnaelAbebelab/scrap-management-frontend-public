"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AgencyViewModalProps {
  isOpen: boolean
  onClose: () => void
  agency: any
}

export default function AgencyViewModal({ isOpen, onClose, agency }: AgencyViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agency Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">TIN</h3>
            <p>{agency.tin}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Business Name</h3>
            <p>{agency.businessName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Agreement Type</h3>
            <Badge variant="outline" className="mt-1">
              {agency.agreement}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Remaining Amount</h3>
              <p className="text-amber-600 font-medium">₹{agency.remainingAmount.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Paid Amount</h3>
              <p className="text-green-600 font-medium">₹{agency.paidAmount.toLocaleString()}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Contract Value</h3>
            <p className="text-blue-600 font-medium">
              ₹{(agency.remainingAmount + agency.paidAmount).toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Payment Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{
                  width: `${Math.round((agency.paidAmount / (agency.remainingAmount + agency.paidAmount)) * 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((agency.paidAmount / (agency.remainingAmount + agency.paidAmount)) * 100)}% paid
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
