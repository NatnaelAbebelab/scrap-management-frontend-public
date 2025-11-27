import type { Status, StatusResponse } from "@/lib/types/status-types"

export function mapStatus(obj: StatusResponse): Status[] {
  return Object.entries(obj).map(([key, label]) => ({
    value: key,
    label,
  }))
}