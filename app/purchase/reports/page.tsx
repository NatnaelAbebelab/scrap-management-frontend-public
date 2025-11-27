"use client"

import { useState } from "react"
import { ReportsFilter } from "@/components/purchase/reports-filter"
import { ReportsTable } from "@/components/purchase/reports-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CheckCircle, DollarSign, AlertCircle } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { MaterialType } from "@/lib/types/material-types"
import { Status } from "@/lib/types/status-types"
import { PurchaseReportFilterParams } from "@/lib/types/purchase-api"

export default function ReportsPage() {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    paid: 0,
    other: 0,
  })
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([])
  const [status, setStatus] = useState<Status[]>([])
  const [filterParams, setFilterParams] = useState<PurchaseReportFilterParams>({})

  return (
    <ProtectedRoute allowedRoles={["super_admin", "weight_man", "purchaser", "inspector", "purchase_head", "supervisor", "finance", "manager"]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        </div>

        <div className="grid gap-4">
          <ReportsFilter materialTypes={materialTypes} _status={status} onFilterApply={setFilterParams}/>
          <ReportsTable  materialTypes={materialTypes} setMaterialTypes={setMaterialTypes} status={status} setStatus={setStatus} onStatsUpdate={(newStats) => setStats(newStats)} filterParams={filterParams}/>
        </div>
      </div>
    </ProtectedRoute>
  )
}
