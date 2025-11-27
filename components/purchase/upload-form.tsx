"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CalendarIcon, Upload, X, ChevronUp, ChevronDown, AlertCircle } from "lucide-react"
import { format, subDays } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { toastUtils } from "@/lib/toast-utils"
import APIFactory  from "@/lib/api-factory"
import { ApiError } from "@/utils/errors"
import { useAuth } from "@/lib/auth-context"
import { capitalizeFirst } from "@/utils/stringFormatter"

type UploadResponse = {
  skipped_records: {
    invalid_records_no: number[]
    invalid_firm: string[]
    invalid_material_type: string[]
  }
  total_records: number
}

export function UploadForm() {
  const [date, setDate] = useState<Date>()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null)
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()
  const [formKey, setFormKey] = useState(Date.now())
  const [isInvalidRecordsOpen, setIsInvalidRecordsOpen] = useState(false)
  const [isInvalidFirmOpen, setIsInvalidFirmOpen] = useState(false)
  const [isInvalidMaterialOpen, setIsInvalidMaterialOpen] = useState(false)

  const today = new Date()
  const sevenDaysAgo = subDays(today, 6)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) return

    setIsLoading(true)

    if (!date) {
      toastUtils.error("Validation Error", "Please select a date")
      return
    }

    if (!file) {
      toastUtils.error("Validation Error", "Please select a file to upload")
      return
    }

    setIsUploading(true)

    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("date", format(date, "yyyy-MM-dd"))

      const result = await APIFactory.purchase.uploadData(token, formData)

      if (result.error || !result.data) {
        throw new ApiError(result.error || "Uploading purchase data failed.", result.status ?? 400)
      }
      const skippedRecordsResponse: UploadResponse = {
        skipped_records: {
          invalid_records_no: result.data.skipped_records.invalid_records_no,
          invalid_firm: result.data.skipped_records.invalid_firm,
          invalid_material_type:  result.data.skipped_records.invalid_material_type,
        },
        total_records: parseInt(result.data.total_records),
      }
      setUploadResult(skippedRecordsResponse)
      
      const hasSkipped =
        skippedRecordsResponse.skipped_records.invalid_records_no.length > 0 ||
        skippedRecordsResponse.skipped_records.invalid_firm.length > 0 ||
        skippedRecordsResponse.skipped_records.invalid_material_type.length > 0

      hasSkipped ? toastUtils.warning("WARNING", "Purchase data is uploaded successfully but has skipped records.") : toastUtils.success("SUCCESS", "Purchase data is uploaded successfully.")
      
    } catch (error) {
      if (error instanceof ApiError) {
        toastUtils.error(`UPLOAD FAILED (${error.status})`, error instanceof Error ? capitalizeFirst(error.message) : "Please check your credentials and try again")
      } else {
        toastUtils.error("Unexpected error", "Something went wrong")
      }
      setIsUploading(false)
    }

    // Reset form fields
    setIsUploading(false)
    setIsLoading(false)
    setDate(undefined)
    setFile(null)
    setFormKey(Date.now())
  }

  const resetForm = () => {
    setFile(null)
    setUploadResult(null)
  }

  const getTotalSkippedRecords = () => {
    if (!uploadResult) return 0
    return (
      uploadResult.skipped_records.invalid_records_no.length +
      uploadResult.skipped_records.invalid_firm.length +
      uploadResult.skipped_records.invalid_material_type.length
    )
  }

  const getSuccessfulRecords = () => {
    if (!uploadResult) return 0
    return uploadResult.total_records - getTotalSkippedRecords()
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toastUtils.error("Unauthorized Access", "You must be logged in to access this page.")
      // Optional: redirect to login or show access denied
    }
  }, [authLoading, isAuthenticated])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Purchase Data</CardTitle>
        <CardDescription>Upload an Excel file containing purchase data for a specific date</CardDescription>
      </CardHeader>
      <form key={formKey} onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  fromDate={sevenDaysAgo}
                  toDate={today}/>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Upload Excel File
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Excel files only (.xlsx, .xls)</p>
                </div>
                {file && (
                  <div className="w-full px-4 pb-4">
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400">Selected: {file.name}</p>
                  </div>
                )}
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          {uploadResult && (
            <div className="space-y-4 mt-6">
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Upload Summary</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Records</p>
                    <p className="text-2xl font-bold">{uploadResult.total_records}</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Processed Successfully</p>
                    <p className="text-2xl font-bold text-green-600">{getSuccessfulRecords()}</p>
                  </div>
                </div>

                {getTotalSkippedRecords() > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Skipped Records</AlertTitle>
                    <AlertDescription>
                      {getTotalSkippedRecords()} records were skipped during processing. See details below.
                    </AlertDescription>
                  </Alert>
                )}

                {uploadResult.skipped_records.invalid_records_no.length > 0 && (
                  <Collapsible
                    open={isInvalidRecordsOpen}
                    onOpenChange={setIsInvalidRecordsOpen}
                    className="border rounded-md"
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-center space-x-2">
                          <X className="h-4 w-4 text-red-500" />
                          <span>Invalid Record Numbers</span>
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                            {uploadResult.skipped_records.invalid_records_no.length}
                          </span>
                        </div>
                        {isInvalidRecordsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 border-t">
                      <div className="max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-4 gap-2">
                          {uploadResult.skipped_records.invalid_records_no.map((recordNo, index) => (
                            <div key={index} className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                              {recordNo}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {uploadResult.skipped_records.invalid_firm.length > 0 && (
                  <Collapsible
                    open={isInvalidFirmOpen}
                    onOpenChange={setIsInvalidFirmOpen}
                    className="border rounded-md"
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-center space-x-2">
                          <X className="h-4 w-4 text-red-500" />
                          <span>Invalid Firms</span>
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                            {uploadResult.skipped_records.invalid_firm.length}
                          </span>
                        </div>
                        {isInvalidFirmOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 border-t">
                      <div className="max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2">
                          {uploadResult.skipped_records.invalid_firm.map((firm, index) => (
                            <div key={index} className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                              {firm}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {uploadResult.skipped_records.invalid_material_type.length > 0 && (
                  <Collapsible
                    open={isInvalidMaterialOpen}
                    onOpenChange={setIsInvalidMaterialOpen}
                    className="border rounded-md"
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-center space-x-2">
                          <X className="h-4 w-4 text-red-500" />
                          <span>Invalid Material Types</span>
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                            {uploadResult.skipped_records.invalid_material_type.length}
                          </span>
                        </div>
                        {isInvalidMaterialOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 border-t">
                      <div className="max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2">
                          {uploadResult.skipped_records.invalid_material_type.map((material, index) => (
                            <div key={index} className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                              {material}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Data"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
