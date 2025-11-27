import { UploadForm } from "@/components/purchase/upload-form"
import { ProtectedRoute } from "@/components/protected-route"

export default function UploadPage() {
  return (
    <ProtectedRoute allowedRoles={["super_admin", "weight_man", "purchaser"]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Upload Purchase Data</h2>
        </div>
        <div className="grid gap-4">
          <UploadForm />
        </div>
      </div>
    </ProtectedRoute>
  )
}
