import { InternalUploadForm } from "@/components/internal/internal-upload-form"
import { ProtectedRoute } from "@/components/protected-route"

export default function InternalUploadPage() {
  return (
    <ProtectedRoute allowedRoles={["weight_man"]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Upload Internal Transport Data</h2>
        </div>
        <div className="grid gap-4">
          <InternalUploadForm />
        </div>
      </div>
    </ProtectedRoute>
  )
}
