"use client"

import { useState } from "react"
import { RecordsTable } from "@/components/purchase/records-table"
import { RecordsFilter } from "@/components/purchase/records-filter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CheckCircle, DollarSign, AlertCircle } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { MaterialType } from "@/lib/types/material-types"
import { Status } from "@/lib/types/status-types"
import { PurchaseFilterParams } from "@/lib/types/purchase-api"

export default function RecordsPage() {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    paid: 0,
    other: 0,
  })
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([])
  const [status, setStatus] = useState<Status[]>([])
  const [filterParams, setFilterParams] = useState<PurchaseFilterParams>({})
  return (
    <ProtectedRoute allowedRoles={["super_admin", "weight_man", "purchaser", "inspector", "purchase_head", "supervisor", "finance", "manager"]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Purchase Records</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Records</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Records</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.paid}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Other Records</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.other}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <RecordsFilter materialTypes={materialTypes} _status={status} onFilterApply={setFilterParams}/>
          <RecordsTable materialTypes={materialTypes} setMaterialTypes={setMaterialTypes} status={status} setStatus={setStatus} onStatsUpdate={(newStats) => setStats(newStats)} filterParams={filterParams}/>
        </div>
      </div>
    </ProtectedRoute>
  )
}
