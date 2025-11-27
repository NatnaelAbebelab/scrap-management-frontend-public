import { MaterialTypesResponse } from "./material-types"
  
export interface RatePaginatedData<T> {
   count: number
   next?: string | null
   previous?: string | null
   results: T[]
}
  
export interface Rate {
   _id: string
   heavy_rate: string | null
   medium_rate: string | null
   light_rate: string | null
   fixed_rate: string
   material_type: string
   status: string
   expired_date: string
   is_deleted: boolean
   created_by: string
   created_at: string
   updated_by: string
   updated_at: string
   record_time: string
}

export interface RateFilterParams {
   materialType?: string
   status?: string
   expiryDate?: Date
}
  
export interface GetRatesResponse {
   result: string
   data: RatePaginatedData<Rate>
   material_types: MaterialTypesResponse
}