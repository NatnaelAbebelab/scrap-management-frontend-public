"use client"

import { useState } from "react"
import { RateTable } from "@/components/purchase/rate-table"
import { RateFilter } from "@/components/purchase/rate-filter"
import { MaterialType } from "@/lib/types/material-types"
import { RateFilterParams } from "@/lib/types/rate-api"

export default function RatePage() {
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([])
  const [filterParams, setFilterParams] = useState<RateFilterParams>({})

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rate Management</h1>
        </div>
      </div>
      <RateFilter materialTypes={materialTypes} onFilterApply={setFilterParams}/>
      <RateTable materialTypes={materialTypes} setMaterialTypes={setMaterialTypes} filterParams={filterParams}/>
    </div>
  )
}
