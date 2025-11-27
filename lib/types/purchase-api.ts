import { MaterialTypesResponse } from "./material-types"
import { StatusResponse } from "./status-types"
  
export interface PurchasePaginatedData<T> {
   count: number
   next?: string | null
   previous?: string | null
   results: T[]
}
  
export interface Purchase {
    _id: string
    record_no: string
    plate_no: string
    first_weight: string
    first_date: string
    first_time: string
    second_weight: string
    second_date: string
    second_time: string
    net_weight: string
    customer: string
    type: string
    material_type: string
    heavy_grade: string
    medium_grade: string
    light_grade: string
    heavy_rate: string
    medium_rate: string
    light_rate: string
    fixed_rate: string
    driver_name: string
    grn_no: string
    net_price: string
    waste_deduction: string
    item_code: string
    grn_img: string
    approve_img: string
    scale_img: string
    status: string
    is_deleted: boolean
    created_by: string
    created_at: string
    updated_by: string
    updated_at: string
    record_time: string

    // additional from other modal
    customer_business_name: string,
    customer_fname: string,
    customer_lname: string,
    amount: string
  }
  

export interface PurchaseFilterParams {
   tin?: string,
   materialType?: string
   status?: string
   plateNumber?: string
   startDate?: Date
   endDate?: Date
}

export interface PurchaseReportFilterParams {
   type?: string,
   tin?: string,
   materialType?: string
   status?: string
   plateNumber?: string
   startDate?: Date
   endDate?: Date
}
  
export interface GetPurchaseResponse {
   result: string
   data: PurchasePaginatedData<Purchase>
   totalRecordsCount: number
   approvedRecordsCount: number
   paidRecordsCount: number
   otherRecordsCount: number
   material_types: MaterialTypesResponse
   status_list: StatusResponse
}