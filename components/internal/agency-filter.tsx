"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export default function AgencyFilter() {
  const [remainingAmount, setRemainingAmount] = useState([0, 100000])
  const [paidAmount, setPaidAmount] = useState([0, 100000])

  const handleClearFilters = () => {
    setRemainingAmount([0, 100000])
    setPaidAmount([0, 100000])

  }
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Agencies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">TIN</label>
            <Input placeholder="Enter TIN number" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Business Name</label>
            <Input placeholder="Enter business name" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Agreement Type</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select agreement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Payment Status</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Fully Paid</SelectItem>
                <SelectItem value="partial">Partially Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="remaining-amount">Remaining Amount</Label>
              <span className="text-xs text-muted-foreground">
                ₹{remainingAmount[0]} - ₹{remainingAmount[1]}
              </span>
            </div>
            <Slider
              id="remaining-amount"
              min={0}
              max={100000}
              step={1000}
              value={remainingAmount}
              onValueChange={setRemainingAmount}
              className="py-4"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="paid-amount">Paid Amount</Label>
              <span className="text-xs text-muted-foreground">
                ₹{paidAmount[0]} - ₹{paidAmount[1]}
              </span>
            </div>
            <Slider
              id="paid-amount"
              min={0}
              max={100000}
              step={1000}
              value={paidAmount}
              onValueChange={setPaidAmount}
              className="py-4"
            />
          </div>

          <div className="flex items-end">
            <Button className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
