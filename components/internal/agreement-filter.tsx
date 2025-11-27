"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const materialTypes = [
  { value: "all", label: "All Types" },
  { value: "paper", label: "Paper" },
  { value: "plastic", label: "Plastic" },
  { value: "metal", label: "Metal" },
  { value: "glass", label: "Glass" },
  { value: "organic", label: "Organic" },
  { value: "electronic", label: "Electronic" },
]

export function AgreementFilter() {
  const [tin, setTin] = useState("")
  const [materialType, setMaterialType] = useState("all")
  const [effectiveDate, setEffectiveDate] = useState<Date | undefined>(undefined)

  const handleFilter = () => {
    console.log("Filters applied:", { tin, materialType, effectiveDate })
    // In a real application, this would filter the data
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Agreements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="tin">Agency TIN</Label>
            <Input id="tin" placeholder="Enter TIN" value={tin} onChange={(e) => setTin(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="material-type">Material Type</Label>
            <Select value={materialType} onValueChange={setMaterialType}>
              <SelectTrigger id="material-type">
                <SelectValue placeholder="Select material type" />
              </SelectTrigger>
              <SelectContent>
                {materialTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="effective-date">Effective Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="effective-date"
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !effectiveDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {effectiveDate ? format(effectiveDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={effectiveDate} onSelect={setEffectiveDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-end">
            <Button onClick={handleFilter} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
