import { InternalReportsFilter } from "@/components/internal/internal-reports-filter"
import { InternalReportsTable } from "@/components/internal/internal-reports-table"

export default function InternalReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Internal Transport Reports</h2>
      </div>

      <div className="grid gap-4">
        <InternalReportsFilter />
        <InternalReportsTable />
      </div>
    </div>
  )
}
