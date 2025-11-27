import type { Metadata } from "next"
import AgencyTable from "@/components/internal/agency-table"
import AgencyFilter from "@/components/internal/agency-filter"

export const metadata: Metadata = {
  title: "Agency Management",
  description: "Manage agencies for internal transportation",
}

export default function AgencyPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Agency Management</h1>
        </div>
        </div>
        <AgencyFilter />
        <AgencyTable />
    </div>
  )
}
