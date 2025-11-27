import type { MaterialType, MaterialTypesResponse } from "@/lib/types/material-types"

export function mapMaterialTypes(obj: MaterialTypesResponse): MaterialType[] {
  return Object.entries(obj).map(([key, label]) => ({
    value: key,
    label,
  }))
}