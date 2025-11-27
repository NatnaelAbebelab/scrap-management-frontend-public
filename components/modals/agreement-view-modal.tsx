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
import { format } from "date-fns"
import { FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface AgreementViewModalProps {
  isOpen: boolean
  onClose: () => void
  agreement: any
}

export function AgreementViewModal({ isOpen, onClose, agreement }: AgreementViewModalProps) {
  if (!agreement) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agreement Details</DialogTitle>
          <DialogDescription>View detailed information about this agreement.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Agreement Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Agreement Name</h4>
                <p className="text-base">{agreement.agreementName}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Agency</h4>
                <p className="text-base">{agreement.agency.tin}</p>
                <p className="text-sm text-muted-foreground">{agreement.agency.businessName}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Material Type</h4>
                <Badge variant="outline" className="capitalize">
                  {agreement.materialType}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Effective Date</h4>
                <p className="text-base">{format(new Date(agreement.effectiveDate), "PPP")}</p>
              </div>

              {agreement.proofFile && (
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Proof Document</h4>
                  <div className="flex items-center mt-1">
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                    <a
                      href={`#${agreement.proofFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      onClick={(e) => {
                        e.preventDefault()
                        // In a real app, this would be a real URL to the file
                        alert("In a real application, this would download or open the file: " + agreement.proofFile)
                      }}
                    >
                      Agreement Proof
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-200 my-2" />

          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Agreement Ranges</h3>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Range</TableHead>
                    <TableHead>Minimum</TableHead>
                    <TableHead>Maximum</TableHead>
                    <TableHead>Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agreement.ranges.map((range: any, index: number) => (
                    <TableRow key={range.id}>
                      <TableCell className="font-medium">Range {index + 1}</TableCell>
                      <TableCell>{range.min}</TableCell>
                      <TableCell>{range.max}</TableCell>
                      <TableCell>${range.rate.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
