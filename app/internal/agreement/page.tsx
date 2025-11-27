import type { Metadata } from "next"
import { AgreementFilter } from "@/components/internal/agreement-filter"
import { AgreementTable } from "@/components/internal/agreement-table"

export const metadata: Metadata = {
  title: "Agency Management",
  description: "Manage agencies for internal transportation",
}

export default function AgreementPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
      <div>
          <h1 className="text-3xl font-bold tracking-tight">Agreement Management</h1>
      </div>
      </div>
      <AgreementFilter />
      <AgreementTable />
    </div>
  )
}