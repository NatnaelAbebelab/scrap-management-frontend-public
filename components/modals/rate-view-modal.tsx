"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { capitalizeFirst } from "@/utils/stringFormatter"
import { formatDate } from "@/utils/dateFormatter"

interface RateViewModalProps {
  isOpen: boolean
  onClose: () => void
  rate: any
}

export function RateViewModal({ isOpen, onClose, rate }: RateViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expired Date</p>
              <p>{formatDate(rate.expired_date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Material Type</p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {capitalizeFirst(rate.material_type)}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Rate Information</p>
            {rate.material_type === "scrap" ? (
              <div className="grid grid-cols-3 gap-4 mt-2">
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
              <p className="font-medium">Br.{rate.fixed_rate}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
